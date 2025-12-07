package types

import "time"

// SystemMetrics represents host-level metrics
type SystemMetrics struct {
	CPUPercent    float64 `json:"cpuPercent"`
	MemoryUsedGB  float64 `json:"memoryUsedGB"`
	MemoryTotalGB float64 `json:"memoryTotalGB"`
	MemoryPercent float64 `json:"memoryPercent"`
	DiskUsedGB    float64 `json:"diskUsedGB"`
	DiskTotalGB   float64 `json:"diskTotalGB"`
	DiskPercent   float64 `json:"diskPercent"`
	NetworkRxMB   float64 `json:"networkRxMB"`
	NetworkTxMB   float64 `json:"networkTxMB"`
	LoadAverage1  float64 `json:"loadAverage1"`
	LoadAverage5  float64 `json:"loadAverage5"`
	LoadAverage15 float64 `json:"loadAverage15"`
	ProcessCount  int     `json:"processCount"`
}

// ContainerMetrics represents Docker container metrics
type ContainerMetrics struct {
	ContainerID   string  `json:"containerId"`
	Name          string  `json:"name"`
	Image         string  `json:"image"`
	State         string  `json:"state"`
	CPUPercent    float64 `json:"cpuPercent"`
	MemoryUsedMB  float64 `json:"memoryUsedMB"`
	MemoryLimitMB float64 `json:"memoryLimitMB"`
	NetworkRxMB   float64 `json:"networkRxMB"`
	NetworkTxMB   float64 `json:"networkTxMB"`
}

// AgentMetrics is the complete payload sent to the backend
type AgentMetrics struct {
	AgentID          string             `json:"agentId"`
	Timestamp        time.Time          `json:"timestamp"`
	SystemMetrics    SystemMetrics      `json:"systemMetrics"`
	ContainerMetrics []ContainerMetrics `json:"containerMetrics"`
}
