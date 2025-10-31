import { createAuthClient } from 'better-auth/react';
import { organizationClient, passkeyClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    plugins: [organizationClient(), passkeyClient()],
});
