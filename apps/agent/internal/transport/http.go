package transport

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/seastackapp/sea-stack-app/apps/agent/internal/types"
)

// HTTPTransport sends metrics to the backend via HTTP
type HTTPTransport struct {
	backendURL string
	agentToken string
	client     *http.Client
}

// NewHTTPTransport creates a new HTTP transport
func NewHTTPTransport(backendURL, agentToken string) *HTTPTransport {
	return &HTTPTransport{
		backendURL: backendURL,
		agentToken: agentToken,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// tRPC request format
type trpcRequest struct {
	Input json.RawMessage `json:"input"`
}

// Send sends metrics to the backend via tRPC
func (t *HTTPTransport) Send(ctx context.Context, metrics types.AgentMetrics) error {
	// Marshal the metrics as the input
	inputData, err := json.Marshal(metrics)
	if err != nil {
		return fmt.Errorf("failed to marshal metrics: %w", err)
	}

	// Wrap in tRPC format
	trpcData := trpcRequest{
		Input: inputData,
	}

	data, err := json.Marshal(trpcData)
	if err != nil {
		return fmt.Errorf("failed to marshal tRPC request: %w", err)
	}

	// tRPC endpoint: /api/trpc/metrics.ingest
	url := t.backendURL + "/api/trpc/metrics.ingest"

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+t.agentToken)

	resp, err := t.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return nil
}
