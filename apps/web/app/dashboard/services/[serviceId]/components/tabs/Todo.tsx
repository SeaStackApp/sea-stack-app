import { TabsContent } from '@/components/ui/tabs';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from '@/components/ui/empty';

export default function TodoTab({
    value,
}: Readonly<{
    value: string;
}>) {
    return (
        <TabsContent value={value}>
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>Coming soon</EmptyTitle>
                    <EmptyDescription>
                        This tab is still under development.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </TabsContent>
    );
}
