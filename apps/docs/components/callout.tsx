import { AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'note' | 'warning' | 'danger' | 'success'

interface CalloutProps {
    readonly type?: CalloutType
    readonly title?: string
    readonly children: React.ReactNode
}

const calloutConfig = {
    note: {
        icon: Info,
        className: 'bg-primary/10 border-primary/30 text-foreground',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-amber-500/10 border-amber-500/30 text-foreground',
    },
    danger: {
        icon: AlertCircle,
        className: 'bg-red-500/10 border-red-500/30 text-foreground',
    },
    success: {
        icon: CheckCircle,
        className: 'bg-green-500/10 border-green-500/30 text-foreground',
    },
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
    const config = calloutConfig[type]
    const Icon = config.icon

    return (
        <div
            className={cn(
                'my-6 rounded-lg border p-4',
                config.className
            )}
        >
            <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    {title && (
                        <div className="font-semibold mb-1">{title}</div>
                    )}
                    <div className="text-sm [&>p]:m-0">{children}</div>
                </div>
            </div>
        </div>
    )
}
