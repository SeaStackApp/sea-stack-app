import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import ServiceSettingsDropdown from './service-settings-dropdown';
import { inferProcedureOutput } from '@trpc/server';
import { appRouter } from '@repo/api';

type Service = inferProcedureOutput<
    typeof appRouter.services.listServices
>[number];

type ServiceNodeProps = Readonly<{
    data: { service: Service };
    isConnectable: boolean;
}>;

/**
 * Service node component for the React Flow diagram.
 * Displays service information including name, description, and server badge.
 * Has a source handle on the right for connecting to network nodes.
 */
export function ServiceNode({ data: { service }, isConnectable }: ServiceNodeProps) {
    return (
        <>
            <Handle
                type='source'
                position={Position.Right}
                isConnectable={isConnectable}
            />

            <Card className='w-[300px]'>
                <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    {service.description && (
                        <CardDescription>
                            {service.description}
                        </CardDescription>
                    )}
                    <CardAction
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ServiceSettingsDropdown
                            service={service}
                        />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <Badge
                        variant='secondary'
                        className='text-xs'
                    >
                        {service.server.name}
                    </Badge>
                </CardContent>
            </Card>
        </>
    );
}
