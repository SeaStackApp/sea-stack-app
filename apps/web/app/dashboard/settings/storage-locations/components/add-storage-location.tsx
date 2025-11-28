import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AddS3StorageForm from '@/app/dashboard/settings/storage-locations/components/add-s3-storage-form';

export default function AddStorageLocation() {
    const [open, setOpen] = useState(false);
    return (
        <div className='text-center py-6'>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild={true}>
                    <Button>Add storage destination</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Storage Destination</DialogTitle>
                        <DialogDescription>
                            Add a new S3-compatible storage destination for backups and artifacts.
                        </DialogDescription>
                    </DialogHeader>
                    <AddS3StorageForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
