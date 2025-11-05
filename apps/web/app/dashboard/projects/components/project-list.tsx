'use client';

import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import PaddedSpinner from '@/components/padded-spinner';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ProjectSettingsDropdown from '@/app/dashboard/projects/components/project-settings-dropdown';

export default function ProjectList() {
    const trpc = useTRPC();
    const projectListQuery = useQuery(trpc.projects.list.queryOptions());
    if (!projectListQuery.data) return <PaddedSpinner />;
    return (
        <div className='grid grid-cols-4 my-6 gap-2'>
            {projectListQuery.data.map((project) => (
                <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        {project.description && (
                            <CardDescription>
                                {project.description}
                            </CardDescription>
                        )}
                        <CardAction>
                            <ProjectSettingsDropdown project={project} />
                        </CardAction>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}
