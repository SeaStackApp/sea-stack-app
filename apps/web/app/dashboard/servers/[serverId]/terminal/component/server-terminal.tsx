'use client';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

export default function ServerTerminal({
    serverId,
}: Readonly<{ serverId: string }>) {
    const { resolvedTheme } = useTheme();
    const termRef = useRef<HTMLDivElement>(null);

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
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    }, [serverId, resolvedTheme]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='w-full h-full bg-transparent border rounded-lg p-2'>
                <div id={serverId} ref={termRef} className='rounded-xl' />
            </div>
        </div>
    );
}
