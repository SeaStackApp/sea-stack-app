'use client';
import { useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import { getLayoutedElements } from './flow-utils';
import { ServiceNode } from './service-node';
import { NetworkNode } from './network-node';

type Service = inferProcedureOutput<
    typeof appRouter.services.listServices
>[number];

type ServiceFlowDiagramProps = {
    readonly services: Service[];
};

/**
 * ServiceFlowDiagram component displays services and networks as a bipartite graph.
 * Services are shown on the left, networks on the right, with edges connecting
 * services to their associated networks. Uses Dagre for automatic layout.
 */
export default function ServiceFlowDiagram({
    services,
}: ServiceFlowDiagramProps) {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // Create nodes and edges from services
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        // Collect all unique networks
        const networksMap = new Map<string, { id: string; name: string }>();

        services.forEach((service) => {
            service.networks.forEach((network) => {
                const networkId = String(network.id);
                if (!networksMap.has(networkId)) {
                    networksMap.set(networkId, {
                        id: networkId,
                        name: String(network.name),
                    });
                }
            });
        });

        // Create service nodes
        const serviceNodes: Node[] = services.map((service) => {
            return {
                id: service.id,
                type: 'service',
                data: {
                    service,
                },
                position: { x: 0, y: 0 }, // Will be set by dagre layout
            };
        });

        // Create network nodes
        const networkNodes: Node[] = Array.from(networksMap.values()).map(
            (network) => {
                return {
                    id: `network-${network.id}`,
                    type: 'network',
                    position: { x: 0, y: 0 }, // Will be set by dagre layout
                    data: {
                        network,
                    },
                };
            }
        );

        const nodes = [...serviceNodes, ...networkNodes];

        // Create edges connecting services to networks
        const edges: Edge[] = [];

        services.forEach((service) => {
            service.networks.forEach((network) => {
                const networkId = String(network.id);
                const edgeId = `${service.id}|||network-${networkId}`;

                edges.push({
                    id: edgeId,
                    source: service.id,
                    target: `network-${networkId}`,
                    type: 'smoothstep',
                    animated: false,
                    deletable: false,
                    selectable: false,
                    focusable: false,
                    style: {
                        stroke: 'oklch(0.556 0 0)',
                        strokeWidth: 2,
                        strokeDasharray: '5,5',
                    },
                });
            });
        });

        // Apply automatic layout based on edges
        return getLayoutedElements(nodes, edges);
    }, [services]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes and edges when they change
    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const onNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            // Only navigate for service nodes, not network nodes
            if (!node.id.startsWith('network-')) {
                router.push(`/dashboard/services/${node.id}`);
            }
        },
        [router]
    );

    if (services.length === 0) {
        return (
            <div className='flex items-center justify-center h-[600px] border border-border rounded-lg bg-card text-muted-foreground'>
                No services found in this environment
            </div>
        );
    }

    return (
        <div className='border border-border rounded-lg w-full h-[70vh]'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition='bottom-right'
                edgesFocusable={false}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                connectionMode={ConnectionMode.Loose}
                nodeTypes={{
                    service: ServiceNode,
                    network: NetworkNode,
                }}
            >
                <Background
                    color={isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}
                    gap={16}
                />
                <Controls
                    style={{
                        background: isDark
                            ? 'oklch(0.205 0 0)'
                            : 'oklch(1 0 0)',
                        border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}`,
                    }}
                    showInteractive={false}
                />
            </ReactFlow>
        </div>
    );
}
