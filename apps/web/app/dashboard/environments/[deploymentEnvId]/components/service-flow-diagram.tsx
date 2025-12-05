'use client';
import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import ServiceSettingsDropdown from './service-settings-dropdown';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';

type Service = inferProcedureOutput<
    typeof appRouter.services.listServices
>[number];

type ServiceFlowDiagramProps = {
    readonly services: Service[];
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
                if (!networkToServices.has(network.id)) {
                    networkToServices.set(network.id, []);
                }
                networkToServices.get(network.id)!.push(service);
            });
        });

        // Create nodes for services
        const nodes: Node[] = services.map((service, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            
            return {
                id: service.id,
                type: 'default',
                position: { x: col * 350, y: row * 200 },
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
                .find((n) => n.id === networkId);
            
            if (!network || servicesInNetwork.length < 2) return;

            // Connect all services in the same network
            for (let i = 0; i < servicesInNetwork.length; i++) {
                for (let j = i + 1; j < servicesInNetwork.length; j++) {
                    const sourceService = servicesInNetwork[i];
                    const targetService = servicesInNetwork[j];
                    if (!sourceService || !targetService) continue;
                    
                    const sourceId = sourceService.id;
                    const targetId = targetService.id;
                    const edgeId = [sourceId, targetId].sort().join('-');

                    if (!edgeMap.has(edgeId)) {
                        edgeMap.set(edgeId, { networks: [] });
                    }
                    edgeMap.get(edgeId)!.networks.push(network.name);
                }
            }
        });

        edgeMap.forEach(({ networks }, edgeId) => {
            const [source, target] = edgeId.split('-');
            if (!source || !target) return;
            
            edges.push({
                id: edgeId,
                source,
                target,
                label: networks.join(', '),
                type: 'smoothstep',
                animated: false,
                style: {
                    stroke: isDark ? 'oklch(0.488 0.243 264.376)' : 'oklch(0.205 0 0)',
                    strokeWidth: 2,
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

        return { nodes, edges };
    }, [services, isDark]);

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

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
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
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
                <MiniMap
                    nodeColor={isDark ? 'oklch(0.488 0.243 264.376)' : 'oklch(0.205 0 0)'}
                    maskColor={isDark ? 'oklch(0.205 0 0 / 0.5)' : 'oklch(1 0 0 / 0.5)'}
                    style={{
                        background: isDark ? 'oklch(0.205 0 0)' : 'oklch(1 0 0)',
                        border: `1px solid ${isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.922 0 0)'}`,
                    }}
                />
            </ReactFlow>
        </div>
    );
}
