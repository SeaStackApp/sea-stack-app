import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

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
        nodesep: 55, // Spacing between nodes
        edgesep: 30, // Spacing between edges
        marginx: 50, // Margin on x-axis
        marginy: 50, // Margin on y-axis
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: 300,
            height: 150,
        });
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

    return { nodes: layoutedNodes as Node[], edges };
};
