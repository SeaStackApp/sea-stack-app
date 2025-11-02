import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export default function PaddedSpinner({
    className,
    spinnerClassName,
}: Readonly<{ className?: string; spinnerClassName?: string }>) {
    return (
        <div className={cn('grid items-center justify-center h-32', className)}>
            <Spinner className={spinnerClassName} />
        </div>
    );
}
