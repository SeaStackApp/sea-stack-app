package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/seastackapp/sea-stack-app/apps/agent/internal/collector"
	"github.com/seastackapp/sea-stack-app/apps/agent/internal/transport"
	"github.com/seastackapp/sea-stack-app/apps/agent/internal/types"
)

func main() {
	// Load configuration from environment
	backendURL := getEnv("BACKEND_URL", "http://localhost:3000")
	agentToken := getEnv("AGENT_TOKEN", "")
	intervalStr := getEnv("COLLECTION_INTERVAL_SECONDS", "60")
	agentID := getEnv("AGENT_ID", uuid.New().String())

	if agentToken == "" {
		log.Fatal("AGENT_TOKEN environment variable is required")
	}

	interval, err := strconv.Atoi(intervalStr)
	if err != nil || interval <= 0 {
		log.Fatalf("Invalid COLLECTION_INTERVAL_SECONDS: %s", intervalStr)
	}

	log.Printf("Starting agent with ID: %s", agentID)
	log.Printf("Backend URL: %s", backendURL)
	log.Printf("Collection interval: %d seconds", interval)

	// Create transport
	tp := transport.NewHTTPTransport(backendURL, agentToken)

	// Setup signal handling
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	// Collection ticker
	ticker := time.NewTicker(time.Duration(interval) * time.Second)
	defer ticker.Stop()

	// Collect and send metrics immediately on startup
	collectAndSend(ctx, agentID, tp)

	// Main loop
	for {
		select {
		case <-ticker.C:
			collectAndSend(ctx, agentID, tp)
		case sig := <-sigCh:
			log.Printf("Received signal %v, shutting down...", sig)
			return
		}
	}
}

func collectAndSend(ctx context.Context, agentID string, tp *transport.HTTPTransport) {
	// Collect system metrics
	systemMetrics, err := collector.CollectSystemMetrics()
	if err != nil {
		log.Printf("Error collecting system metrics: %v", err)
	}

	// Collect Docker metrics
	containerMetrics, err := collector.CollectDockerMetrics(ctx)
	if err != nil {
		log.Printf("Error collecting Docker metrics: %v", err)
		// Continue with empty container metrics if Docker is not available
		containerMetrics = []types.ContainerMetrics{}
	}

	// Build payload
	metrics := types.AgentMetrics{
		AgentID:          agentID,
		Timestamp:        time.Now().UTC(),
		SystemMetrics:    systemMetrics,
		ContainerMetrics: containerMetrics,
	}

	// Log metrics as JSON (for debugging)
	if jsonData, err := json.Marshal(metrics); err == nil {
		log.Printf("Collected metrics: %s", string(jsonData))
	}

	// Send to backend
	if err := tp.Send(ctx, metrics); err != nil {
		log.Printf("Error sending metrics: %v", err)
	} else {
		log.Printf("Successfully sent metrics to backend")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
