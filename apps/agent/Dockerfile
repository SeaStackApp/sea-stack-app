# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build static binary with no CGO
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o agent ./cmd/agent

# Final stage - minimal runtime
FROM alpine:3.21

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /build/agent .

# Run as non-root user
RUN addgroup -g 1001 agent && \
    adduser -D -u 1001 -G agent agent && \
    chown -R agent:agent /app

USER agent

ENTRYPOINT ["/app/agent"]
