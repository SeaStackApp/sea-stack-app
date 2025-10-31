'use client';
import { useTRPC } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

export default function SSHKeysPage() {
    const trpc = useTRPC();
    const sshKeys = useQuery(trpc.sshKeys.list.queryOptions());

    if (!sshKeys.data) return null;

    return <>{JSON.stringify(sshKeys.data)}</>;
}
