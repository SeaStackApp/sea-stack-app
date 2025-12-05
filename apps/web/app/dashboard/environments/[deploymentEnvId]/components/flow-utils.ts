import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

/**
 * Calculate automatic layout using Dagre for a bipartite graph.
 * Services are positioned on the left, networks on the right.
 * 
 * @param nodes - Array of React Flow nodes (services and networks)
 * @param edges - Array of React Flow edges connecting services to networks
 * @returns Object containing layouted nodes and original edges
 */
export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Configure graph with increased spacing to prevent overlaps
    dagreGraph.setGraph({
        rankdir: 'LR', // Left to right for bipartite graph (services -> networks)
        ranksep: 200, // Increased spacing between ranks
        nodesep: 100, // Spacing between nodes
        edgesep: 30, // Spacing between edges
        marginx: 50, // Margin on x-axis
        marginy: 50, // Margin on y-axis
    });

    nodes.forEach((node) => {
        // Different sizes for service and network nodes
        const isNetworkNode = node.id.startsWith('network-');
        dagreGraph.setNode(node.id, {
            width: isNetworkNode ? 200 : 300,
            height: isNetworkNode ? 80 : 150,
        });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const isNetworkNode = node.id.startsWith('network-');
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - (isNetworkNode ? 100 : 150),
                y: nodeWithPosition.y - (isNetworkNode ? 40 : 75),
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};
