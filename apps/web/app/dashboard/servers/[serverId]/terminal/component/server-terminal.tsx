'use client';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useTRPCClient } from '@/lib/trpc';

export default function ServerTerminal({
    serverId,
}: Readonly<{ serverId: string }>) {
    const { resolvedTheme } = useTheme();
    const termRef = useRef<HTMLDivElement>(null);
    const trpc = useTRPCClient();

    useEffect(() => {
        const container = document.getElementById(serverId);
        if (container) {
            container.innerHTML = '';
        }
        const term = new XTerm({
            cursorBlink: true,
            convertEol: true,
            theme: {
                cursor: resolvedTheme === 'light' ? '#000000' : 'transparent',
                background: 'rgba(0, 0, 0, 0)',
                foreground: 'currentColor',
            },
        });

        term.open(termRef.current!);

        const sub = trpc.servers.shell.subscribe(
            {
                serverId,
            },
            {
                onData: (data) => {
                    term.write(data);
                },
            }
        );

        term.onData(async (data) => {
            await trpc.servers.shellInput.mutate({
                serverId,
                data,
            });
        });

        return () => sub.unsubscribe();
    }, [serverId, resolvedTheme, trpc]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full h-full bg-transparent border rounded-lg p-2'>
                <div id={serverId} ref={termRef} className='rounded-xl' />
            </div>
        </div>
    );
}
