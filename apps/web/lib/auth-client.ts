import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';
import { passkeyClient } from '@better-auth/passkey/client';

export const authClient = createAuthClient({
    plugins: [organizationClient(), passkeyClient()],
});
