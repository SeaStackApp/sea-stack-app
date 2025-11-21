import { TabsContent } from '@/components/ui/tabs';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as React from 'react';
import ContainerSelector from '@/app/dashboard/services/[serviceId]/components/tabs/logs/container-selector';

export default function LogsTab({
    service,
}: Readonly<{
    service: Service;
}>) {
    return (
        <TabsContent value='logs'>
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <ContainerSelector service={service} />
                </CardContent>
            </Card>
        </TabsContent>
    );
}
