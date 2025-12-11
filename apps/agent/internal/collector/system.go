package collector

import (
	"github.com/seastackapp/sea-stack-app/apps/agent/internal/types"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/load"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
)

// CollectSystemMetrics gathers host metrics using gopsutil
func CollectSystemMetrics() (types.SystemMetrics, error) {
	var metrics types.SystemMetrics

	// CPU percentage
	cpuPercents, err := cpu.Percent(0, false)
	if err == nil && len(cpuPercents) > 0 {
		metrics.CPUPercent = cpuPercents[0]
	}

	// Memory stats
	vmem, err := mem.VirtualMemory()
	if err == nil {
		metrics.MemoryUsedGB = float64(vmem.Used) / (1024 * 1024 * 1024)
		metrics.MemoryTotalGB = float64(vmem.Total) / (1024 * 1024 * 1024)
		metrics.MemoryPercent = vmem.UsedPercent
	}

	// Disk stats (root partition)
	diskStats, err := disk.Usage("/")
	if err == nil {
		metrics.DiskUsedGB = float64(diskStats.Used) / (1024 * 1024 * 1024)
		metrics.DiskTotalGB = float64(diskStats.Total) / (1024 * 1024 * 1024)
		metrics.DiskPercent = diskStats.UsedPercent
	}

	// Network stats
	netStats, err := net.IOCounters(false)
	if err == nil && len(netStats) > 0 {
		metrics.NetworkRxMB = float64(netStats[0].BytesRecv) / (1024 * 1024)
		metrics.NetworkTxMB = float64(netStats[0].BytesSent) / (1024 * 1024)
	}

	// Load average
	loadAvg, err := load.Avg()
	if err == nil {
		metrics.LoadAverage1 = loadAvg.Load1
		metrics.LoadAverage5 = loadAvg.Load5
		metrics.LoadAverage15 = loadAvg.Load15
	}

	// Process count
	processes, err := process.Processes()
	if err == nil {
		metrics.ProcessCount = len(processes)
	}

	return metrics, nil
}
