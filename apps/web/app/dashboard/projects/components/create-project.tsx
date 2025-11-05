'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import ProjectForm from '@/app/dashboard/projects/components/project-form';

export default function CreateProject() {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
                <Button>Create a new project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                    <DialogDescription>
                        Create a new project that will group your some of your
                        apps together.
                    </DialogDescription>
                    <ProjectForm onCreate={() => setOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
