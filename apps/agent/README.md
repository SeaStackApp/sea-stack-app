# SeaStack Agent

The SeaStack Agent is a lightweight Go application that collects system and Docker container metrics from hosts and sends them to the SeaStack backend.

## Features

- Collects host metrics using gopsutil:
  - CPU usage percentage
  - Memory usage (used, total, percentage)
  - Disk usage (used, total, percentage)
  - Network I/O (bytes received/sent)
  - Load averages (1, 5, 15 minutes)
  - Process count

- Collects Docker container metrics via `/var/run/docker.sock`:
  - Container ID, name, image, state
  - CPU usage percentage
  - Memory usage and limits
  - Network I/O per container

- Sends metrics to backend via HTTP API
- JSON-formatted output with RFC3339 timestamps
- Configurable collection intervals
- No CGO dependencies - static binary

## Configuration

The agent is configured via environment variables:

- `BACKEND_URL` - Backend base URL (default: `http://localhost:3000`)
- `AGENT_TOKEN` - Authentication token (required)
- `COLLECTION_INTERVAL_SECONDS` - Metrics collection interval (default: `60`)
- `AGENT_ID` - Unique agent identifier (default: auto-generated UUID)

The agent sends metrics to the tRPC endpoint at `{BACKEND_URL}/api/trpc/metrics.ingest`.

## Building

```bash
# Build binary
CGO_ENABLED=0 go build -o bin/agent ./cmd/agent

# Build Docker image
docker build -t seastack-agent .
```

## Running

### Local (binary)

```bash
export AGENT_TOKEN="your-token"
export BACKEND_URL="http://localhost:3000"
./bin/agent
```

### Docker

```bash
docker run -d \
  --name seastack-agent \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e AGENT_TOKEN="your-token" \
  -e BACKEND_URL="http://backend:3000" \
  -e COLLECTION_INTERVAL_SECONDS=60 \
  seastack-agent
```

Note: Mount `/var/run/docker.sock` to enable Docker container metrics collection.

## Project Structure

```
apps/agent/
├── cmd/agent/main.go           # Application entry point
├── internal/
│   ├── collector/
│   │   ├── system.go           # Host metrics collection
│   │   └── docker.go           # Docker container metrics
│   ├── transport/
│   │   └── http.go             # HTTP client for backend API
│   └── types/
│       └── metrics.go          # Metric data structures
├── Dockerfile                   # Multi-stage Docker build
└── README.md
```
