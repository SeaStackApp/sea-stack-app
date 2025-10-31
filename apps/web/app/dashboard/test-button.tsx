'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function TestButton() {
    return (
        <Button
            onClick={async () => {
                const result = await authClient.passkey.addPasskey({
                    name: 'example-passkey-name',
                    authenticatorAttachment: 'cross-platform',
                });
                console.log(result);
            }}
        >
            Add passkey
        </Button>
    );
}
