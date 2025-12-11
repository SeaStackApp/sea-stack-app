package collector

import (
	"context"
	"encoding/json"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/seastackapp/sea-stack-app/apps/agent/internal/types"
)

// CollectDockerMetrics gathers Docker container metrics via /var/run/docker.sock
func CollectDockerMetrics(ctx context.Context) ([]types.ContainerMetrics, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	defer cli.Close()

	containers, err := cli.ContainerList(ctx, container.ListOptions{All: true})
	if err != nil {
		return nil, err
	}

	var metrics []types.ContainerMetrics
	for _, c := range containers {
		// Get short container ID (first 12 characters)
		shortID := c.ID
		if len(c.ID) > 12 {
			shortID = c.ID[:12]
		}

		m := types.ContainerMetrics{
			ContainerID: shortID,
			Name:        c.Names[0], // Names is a slice, take first
			Image:       c.Image,
			State:       c.State,
		}

		// Get container stats (only for running containers)
		if c.State == "running" {
			statsCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
			stats, err := cli.ContainerStats(statsCtx, c.ID, false)
			cancel()

			if err == nil {
				// The Docker SDK returns a stream, we need to read it once
				var statsJSON container.StatsResponse
				if err := json.NewDecoder(stats.Body).Decode(&statsJSON); err == nil {
					// Calculate CPU percentage
					cpuDelta := float64(statsJSON.CPUStats.CPUUsage.TotalUsage - statsJSON.PreCPUStats.CPUUsage.TotalUsage)
					systemDelta := float64(statsJSON.CPUStats.SystemUsage - statsJSON.PreCPUStats.SystemUsage)
					cpuCount := float64(statsJSON.CPUStats.OnlineCPUs)
					if cpuCount == 0 {
						cpuCount = float64(len(statsJSON.CPUStats.CPUUsage.PercpuUsage))
					}
					if systemDelta > 0 && cpuDelta > 0 {
						m.CPUPercent = (cpuDelta / systemDelta) * cpuCount * 100.0
					}

					// Memory usage
					m.MemoryUsedMB = float64(statsJSON.MemoryStats.Usage) / (1024 * 1024)
					m.MemoryLimitMB = float64(statsJSON.MemoryStats.Limit) / (1024 * 1024)

					// Network I/O
					var rxBytes, txBytes uint64
					for _, v := range statsJSON.Networks {
						rxBytes += v.RxBytes
						txBytes += v.TxBytes
					}
					m.NetworkRxMB = float64(rxBytes) / (1024 * 1024)
					m.NetworkTxMB = float64(txBytes) / (1024 * 1024)
				}
				stats.Body.Close()
			}
		}

		metrics = append(metrics, m)
	}

	return metrics, nil
}
