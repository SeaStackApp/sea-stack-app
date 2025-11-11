import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CopyToClipboardButton = (
    props: React.ComponentProps<typeof Button> &
        Readonly<{
            copyText: string;
        }>
) => {
    const { copyText, ...rest } = props;
    return (
        <Button
            {...rest}
            onClick={async (e) => {
                if (props.onClick) props.onClick(e);
                await navigator.clipboard.writeText(copyText);
                toast.success('Copied to clipboard');
            }}
        />
    );
};
