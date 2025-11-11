'use client';
import { authClient } from '@/lib/auth-client';
import DashboardPage from '@/components/dashboard-page';
import PageDescription from '@/components/page-description';
import PageTitle from '@/components/page-title';
import {
    TableRow,
    TableBody,
    Table,
    TableHeader,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import PaddedSpinner from '@/components/padded-spinner';
import InviteMember from './components/invite-member';
import MemberLine from './components/member-line';
import InvitationLine from './components/invitation-line';
import { Separator } from '@/components/ui/separator';

export default function MembersPage() {
    const { data: activeOrganization, isPending } =
        authClient.useActiveOrganization();

    if (isPending || !activeOrganization) return <PaddedSpinner />;

    const members = activeOrganization.members || [];
    const invitations = (activeOrganization.invitations || []).filter(
        (i) => i.status === 'pending'
    );

    return (
        <DashboardPage className='space-y-6'>
            <div>
                <PageTitle>Manage Members</PageTitle>
                <PageDescription>
                    Invite and manage members of your organization
                </PageDescription>
            </div>

            <div className='space-y-4'>
                <div>
                    <h3 className='text-lg font-medium mb-2'>Members</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className='text-center'>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className='text-center text-muted-foreground'
                                    >
                                        No members yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <MemberLine
                                        key={member.id}
                                        member={member}
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {invitations.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h3 className='text-lg font-medium mb-2'>
                                Pending Invitations
                            </h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Expires</TableHead>
                                        <TableHead className='text-center'>
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invitations.map((invitation) => (
                                        <InvitationLine
                                            key={invitation.id}
                                            invitation={invitation}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}

                <div className='text-center p-6'>
                    <InviteMember />
                </div>
            </div>
        </DashboardPage>
    );
}
