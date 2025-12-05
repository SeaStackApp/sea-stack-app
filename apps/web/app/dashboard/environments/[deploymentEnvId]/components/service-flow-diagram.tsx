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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import ServiceSettingsDropdown from './service-settings-dropdown';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';
import dagre from 'dagre';

type Service = inferProcedureOutput<
    typeof appRouter.services.listServices
>[number];

type ServiceFlowDiagramProps = {
    readonly services: Service[];
};

// Function to calculate automatic layout using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'LR', ranksep: 150, nodesep: 100 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 300, height: 150 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 150,
                y: nodeWithPosition.y - 75,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export default function ServiceFlowDiagram({
    services,
}: ServiceFlowDiagramProps) {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // Create nodes and edges from services
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        // Group services by networks
        const networkToServices = new Map<string, Service[]>();
        
        services.forEach((service) => {
            service.networks.forEach((network) => {
                const networkId = String(network.id);
                if (!networkToServices.has(networkId)) {
                    networkToServices.set(networkId, []);
                }
                const servicesArray = networkToServices.get(networkId);
                if (servicesArray) {
                    servicesArray.push(service);
                }
            });
        });

        // Create nodes for services (initial positioning will be updated by layout)
        const nodes: Node[] = services.map((service) => {
            return {
                id: service.id,
                type: 'default',
                position: { x: 0, y: 0 }, // Will be set by dagre layout
                data: {
                    label: (
                        <div className="flex flex-col gap-2 p-2 w-full">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-base">
                                    {service.name}
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <ServiceSettingsDropdown service={service} />
                                </div>
                            </div>
                            {service.description && (
                                <div className="text-xs text-muted-foreground">
                                    {service.description}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <Badge variant="secondary" className="text-xs">
                                    {service.server.name}
                                </Badge>
                            </div>
                        </div>
                    ),
                },
                style: {
                    background: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                    border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}`,
                    borderRadius: '0.625rem',
                    padding: 0,
                    width: 300,
                    cursor: 'pointer',
                },
            };
        });

        // Create edges based on shared networks
        const edges: Edge[] = [];
        const edgeMap = new Map<string, { networks: string[] }>();

        networkToServices.forEach((servicesInNetwork, networkId) => {
            const network = services
                .flatMap((s) => s.networks)
                .find((n) => String(n.id) === networkId);
            
            if (!network || servicesInNetwork.length < 2) return;

            // Connect all services in the same network
            for (let i = 0; i < servicesInNetwork.length; i++) {
                for (let j = i + 1; j < servicesInNetwork.length; j++) {
                    const sourceService = servicesInNetwork[i];
                    const targetService = servicesInNetwork[j];
                    
                    const sourceId = sourceService.id;
                    const targetId = targetService.id;
                    const edgeId = [sourceId, targetId].sort().join('|||');

                    if (!edgeMap.has(edgeId)) {
                        edgeMap.set(edgeId, { networks: [] });
                    }
                    const edgeData = edgeMap.get(edgeId);
                    if (edgeData) {
                        edgeData.networks.push(String(network.name));
                    }
                }
            }
        });

        edgeMap.forEach(({ networks }, edgeId) => {
            const parts = edgeId.split('|||');
            const source = parts[0];
            const target = parts[1];
            
            if (!source || !target) {
                return;
            }
            
            edges.push({
                id: edgeId,
                source: source,
                target: target,
                label: networks.join(', '),
                type: 'smoothstep',
                animated: false,
                deletable: false,
                selectable: false,
                focusable: false,
                style: {
                    stroke: isDark ? 'oklch(0.556 0 0)' : 'oklch(0.556 0 0)',
                    strokeWidth: 2,
                    strokeDasharray: '5,5',
                },
                labelStyle: {
                    fill: isDark ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
                    fontSize: 12,
                    fontWeight: 500,
                },
                labelBgStyle: {
                    fill: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                    fillOpacity: 0.9,
                },
            });
        });

        // Apply automatic layout based on edges
        const layouted = getLayoutedElements(nodes, edges);
        return layouted;
    }, [services, isDark]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Update nodes and edges when theme changes
    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const onNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            router.push(`/dashboard/services/${node.id}`);
        },
        [router]
    );

    if (services.length === 0) {
        return (
            <div className="flex items-center justify-center h-[600px] border border-border rounded-lg bg-card text-muted-foreground">
                No services found in this environment
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '600px' }} className="border border-border rounded-lg">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-left"
                edgesUpdatable={false}
                edgesFocusable={false}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
            >
                <Background
                    color={isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}
                    gap={16}
                />
                <Controls
                    style={{
                        background: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                        border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}`,
                    }}
                />
            </ReactFlow>
        </div>
    );
}
