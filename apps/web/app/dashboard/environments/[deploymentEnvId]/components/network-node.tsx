import { Handle, Position } from '@xyflow/react';
import {
    Card,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type NetworkNodeProps = Readonly<{
    data: { network: { id: string; name: string } };
    isConnectable: boolean;
}>;

/**
 * Network node component for the React Flow diagram.
 * Displays network name as a smaller card on the right side of the graph.
 * Has a target handle on the left for receiving connections from service nodes.
 */
export function NetworkNode({ data: { network }, isConnectable }: NetworkNodeProps) {
    return (
        <>
            <Handle
                type='target'
                position={Position.Left}
                isConnectable={isConnectable}
            />

            <Card className='w-[200px]'>
                <CardHeader>
                    <CardTitle>{network.name}</CardTitle>
                </CardHeader>
            </Card>
        </>
    );
}
