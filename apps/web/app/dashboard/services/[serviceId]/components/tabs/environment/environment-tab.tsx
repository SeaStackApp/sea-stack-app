'use client';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/app/dashboard/services/[serviceId]/Service';
import ServiceEnvironmentVariablesForm from './service-environment-variables-form';

export default function EnvironmentTab({
    service,
}: Readonly<{
    service: Service;
}>) {
    return (
        <TabsContent value='environment' className='mt-2 space-y-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                    <ServiceEnvironmentVariablesForm serviceId={service.id} />
                </CardContent>
            </Card>
        </TabsContent>
    );
}
