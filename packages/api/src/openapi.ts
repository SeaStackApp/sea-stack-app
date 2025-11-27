import type { OpenAPIObject } from 'openapi3-ts/oas31';

// Static OpenAPI document that describes the tRPC API endpoints
// This provides documentation for the API without requiring full output schema definitions
export const openApiDocument: OpenAPIObject = {
    openapi: '3.1.0',
    info: {
        title: 'SeaStack API',
        description:
            'SeaStack API for managing Docker Swarm deployments, servers, services, and more. This API uses tRPC with superjson transformation. Endpoints follow the tRPC dot-path convention (e.g., `health.ping`, `sshKeys.list`). For mutations, use POST requests with JSON body. For queries, use GET requests with query parameters encoded as JSON in the `input` parameter.',
        version: '1.0.0',
    },
    servers: [
        {
            url: '/api/trpc',
            description: 'tRPC API endpoint',
        },
    ],
    tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'SSH Keys', description: 'SSH key management' },
        { name: 'Servers', description: 'Server management' },
        { name: 'Registries', description: 'Container registry management' },
        { name: 'Projects', description: 'Project management' },
        { name: 'Services', description: 'Docker service management' },
        { name: 'Domains', description: 'Domain routing configuration' },
        { name: 'Networks', description: 'Docker network management' },
        { name: 'Volumes', description: 'Docker volume management' },
        { name: 'Notifications', description: 'Notification provider management' },
    ],
    paths: {
        '/health.ping': {
            get: {
                tags: ['Health'],
                summary: 'Health check endpoint',
                description: 'Returns a simple health check response with status and timestamp.',
                responses: {
                    '200': {
                        description: 'Health check response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        result: {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        status: { type: 'string', example: 'ok' },
                                                        timestamp: { type: 'string', format: 'date-time' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/sshKeys.list': {
            get: {
                tags: ['SSH Keys'],
                summary: 'List all SSH keys',
                description: 'Returns a list of all SSH keys in the organization. Private keys are omitted for security.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'List of SSH keys' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/sshKeys.createKey': {
            post: {
                tags: ['SSH Keys'],
                summary: 'Create a new SSH key',
                description: 'Creates a new SSH key pair that can be used for server authentication.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'privateKey', 'publicKey'],
                                properties: {
                                    name: { type: 'string', description: 'Name of the SSH key' },
                                    privateKey: { type: 'string', description: 'Private key content in PEM format' },
                                    publicKey: { type: 'string', description: 'Public key content' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created SSH key' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/sshKeys.update': {
            post: {
                tags: ['SSH Keys'],
                summary: 'Update an SSH key',
                description: 'Updates an existing SSH key with new data.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['keyId', 'name', 'privateKey', 'publicKey'],
                                properties: {
                                    keyId: { type: 'string', description: 'Unique identifier of the SSH key' },
                                    name: { type: 'string', description: 'Name of the SSH key' },
                                    privateKey: { type: 'string', description: 'Private key content in PEM format' },
                                    publicKey: { type: 'string', description: 'Public key content' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Updated SSH key' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/sshKeys.delete': {
            post: {
                tags: ['SSH Keys'],
                summary: 'Delete an SSH key',
                description: 'Permanently deletes an SSH key from the organization.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['keyId'],
                                properties: {
                                    keyId: { type: 'string', description: 'Unique identifier of the SSH key' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Deleted SSH key' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/sshKeys.generateRSAKeyPair': {
            get: {
                tags: ['SSH Keys'],
                summary: 'Generate a new RSA key pair',
                description: 'Generates a new 4096-bit RSA key pair. Returns both public and private keys.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Generated key pair' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/sshKeys.getKeyData': {
            get: {
                tags: ['SSH Keys'],
                summary: 'Get SSH key data including private key',
                description: 'Returns the full SSH key data including the decrypted private key.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with keyId',
                    },
                ],
                responses: {
                    '200': { description: 'SSH key data' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'SSH key not found' },
                },
            },
        },
        '/servers.list': {
            get: {
                tags: ['Servers'],
                summary: 'List all servers',
                description: 'Returns a list of all servers configured in the organization.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'List of servers' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/servers.create': {
            post: {
                tags: ['Servers'],
                summary: 'Create a new server',
                description: 'Creates a new server connection with SSH credentials.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'hostname', 'port', 'user', 'SSHKeyId'],
                                properties: {
                                    name: { type: 'string', description: 'Display name for the server' },
                                    hostname: { type: 'string', description: 'Hostname or IP address of the server' },
                                    port: { type: 'number', description: 'SSH port number (typically 22)' },
                                    user: { type: 'string', description: 'SSH username for server access' },
                                    SSHKeyId: { type: 'string', description: 'ID of the SSH key to use for authentication' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created server' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/servers.delete': {
            post: {
                tags: ['Servers'],
                summary: 'Delete a server',
                description: 'Permanently deletes a server from the organization.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['serverId'],
                                properties: {
                                    serverId: { type: 'string', description: 'Unique identifier of the server' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/servers.reboot': {
            post: {
                tags: ['Servers'],
                summary: 'Reboot a server',
                description: 'Sends a reboot command to the remote server.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['serverId'],
                                properties: {
                                    serverId: { type: 'string', description: 'Unique identifier of the server' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Reboot command result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/servers.uptime': {
            get: {
                tags: ['Servers'],
                summary: 'Get server uptime',
                description: 'Returns the uptime information for the server.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with serverId',
                    },
                ],
                responses: {
                    '200': { description: 'Server uptime' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/servers.setup': {
            post: {
                tags: ['Servers'],
                summary: 'Setup server for SeaStack',
                description: 'Configures the server with Docker Swarm and other dependencies.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['serverId'],
                                properties: {
                                    serverId: { type: 'string', description: 'Unique identifier of the server' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Setup result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/registries.list': {
            get: {
                tags: ['Registries'],
                summary: 'List all container registries',
                description: 'Returns a list of all container registries. Passwords are omitted.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'List of registries' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/registries.create': {
            post: {
                tags: ['Registries'],
                summary: 'Create a new container registry',
                description: 'Creates a new container registry with authentication credentials.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'username', 'password', 'url'],
                                properties: {
                                    name: { type: 'string', description: 'Display name for the container registry' },
                                    username: { type: 'string', description: 'Username for registry authentication' },
                                    password: { type: 'string', description: 'Password or access token for registry authentication' },
                                    url: { type: 'string', description: 'URL of the container registry' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created registry' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/registries.update': {
            post: {
                tags: ['Registries'],
                summary: 'Update a container registry',
                description: 'Updates an existing container registry configuration.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Updated registry' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/registries.delete': {
            post: {
                tags: ['Registries'],
                summary: 'Delete a container registry',
                description: 'Permanently deletes a container registry from the organization.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/projects.list': {
            get: {
                tags: ['Projects'],
                summary: 'List all projects',
                description: 'Returns a list of all projects with their deployment environments.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'List of projects' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/projects.create': {
            post: {
                tags: ['Projects'],
                summary: 'Create a new project',
                description: 'Creates a new project with a default deployment environment.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: {
                                    name: { type: 'string', description: 'Name of the project' },
                                    description: { type: 'string', description: 'Optional description of the project' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created project' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/projects.delete': {
            post: {
                tags: ['Projects'],
                summary: 'Delete a project',
                description: 'Permanently deletes a project and all its deployment environments.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/services.listServices': {
            get: {
                tags: ['Services'],
                summary: 'List services in an environment',
                description: 'Returns a list of all services in the specified deployment environment.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with environmentId',
                    },
                ],
                responses: {
                    '200': { description: 'List of services' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/services.getService': {
            get: {
                tags: ['Services'],
                summary: 'Get service details',
                description: 'Returns detailed information about a specific service.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: true,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with serviceId',
                    },
                ],
                responses: {
                    '200': { description: 'Service details' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'Service not found' },
                },
            },
        },
        '/services.createSwarmService': {
            post: {
                tags: ['Services'],
                summary: 'Create a Docker Swarm service',
                description: 'Creates a new Docker Swarm service in the specified environment.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'image', 'serverId', 'environmentId'],
                                properties: {
                                    name: { type: 'string', description: 'Name of the Docker Swarm service' },
                                    description: { type: 'string', description: 'Optional description of the service' },
                                    image: { type: 'string', description: 'Docker image to deploy (e.g., nginx:latest)' },
                                    serverId: { type: 'string', description: 'ID of the server to deploy the service on' },
                                    environmentId: { type: 'string', description: 'ID of the deployment environment' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created service' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/services.deleteService': {
            post: {
                tags: ['Services'],
                summary: 'Delete a service',
                description: 'Permanently deletes a service and its configurations.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/services.deployService': {
            post: {
                tags: ['Services'],
                summary: 'Deploy a service',
                description: 'Deploys the service to its configured server. Returns true if successful.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deployment result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/services.createDomain': {
            post: {
                tags: ['Services', 'Domains'],
                summary: 'Create a domain for a service',
                description: 'Creates a new domain mapping for a service with Traefik routing.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['serviceId', 'domain', 'internalPort', 'https'],
                                properties: {
                                    serviceId: { type: 'string', description: 'Unique identifier of the service' },
                                    domain: { type: 'string', description: 'Valid FQDN for the domain' },
                                    internalPort: { type: 'integer', minimum: 1, maximum: 65535, description: 'Internal container port to route traffic to' },
                                    internalContainer: { type: 'string', description: 'Optional specific container name for routing' },
                                    https: { type: 'boolean', description: 'Whether to enable HTTPS/TLS for this domain' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created domain' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/domains.delete': {
            post: {
                tags: ['Domains'],
                summary: 'Delete a domain',
                description: 'Permanently deletes a domain mapping from a service.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/networks.list': {
            get: {
                tags: ['Networks'],
                summary: 'List all networks',
                description: 'Returns a list of Docker networks, optionally filtered by server.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with optional serverId',
                    },
                ],
                responses: {
                    '200': { description: 'List of networks' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/networks.create': {
            post: {
                tags: ['Networks'],
                summary: 'Create a new network',
                description: 'Creates a new Docker network on the specified server.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'serverId'],
                                properties: {
                                    name: { type: 'string', description: 'Name of the Docker network' },
                                    driver: { type: 'string', enum: ['overlay', 'bridge', 'host', 'none'], default: 'overlay', description: 'Network driver type' },
                                    subnet: { type: 'string', description: 'Subnet in CIDR notation (e.g., 10.0.0.0/24)' },
                                    gateway: { type: 'string', description: 'Gateway IP address' },
                                    attachable: { type: 'boolean', default: false, description: 'Whether standalone containers can attach to this network' },
                                    attachToReverseProxy: { type: 'boolean', default: false, description: 'Whether to attach the reverse proxy (Traefik) to this network' },
                                    serverId: { type: 'string', description: 'ID of the server to create the network on' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created network' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/networks.delete': {
            post: {
                tags: ['Networks'],
                summary: 'Delete a network',
                description: 'Permanently deletes a Docker network.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/volumes.list': {
            get: {
                tags: ['Volumes'],
                summary: 'List all volumes',
                description: 'Returns a list of volumes, optionally filtered by service.',
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: 'input',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                        description: 'JSON encoded object with optional serviceId',
                    },
                ],
                responses: {
                    '200': { description: 'List of volumes' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/volumes.create': {
            post: {
                tags: ['Volumes'],
                summary: 'Create a new volume',
                description: 'Creates a new volume for a service.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'mountPath', 'serviceId'],
                                properties: {
                                    name: { type: 'string', description: 'Docker volume name' },
                                    mountPath: { type: 'string', description: 'Absolute path inside the container where the volume will be mounted' },
                                    readOnly: { type: 'boolean', default: false, description: 'Whether the volume should be mounted as read-only' },
                                    serviceId: { type: 'string', description: 'ID of the service to attach the volume to' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created volume' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/volumes.update': {
            post: {
                tags: ['Volumes'],
                summary: 'Update a volume',
                description: 'Updates an existing volume configuration.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Updated volume' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/volumes.delete': {
            post: {
                tags: ['Volumes'],
                summary: 'Delete a volume',
                description: 'Permanently deletes a volume.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/notifications.listProviders': {
            get: {
                tags: ['Notifications'],
                summary: 'List all notification providers',
                description: 'Returns a list of all notification providers configured for the organization.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'List of notification providers' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/notifications.createDiscordProvider': {
            post: {
                tags: ['Notifications'],
                summary: 'Create a Discord notification provider',
                description: 'Creates a new Discord webhook notification provider.',
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'webhookUrl'],
                                properties: {
                                    name: { type: 'string', description: 'Display name of the notification provider' },
                                    webhookUrl: { type: 'string', format: 'uri', description: 'Discord webhook URL' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Created notification provider' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/notifications.testProvider': {
            post: {
                tags: ['Notifications'],
                summary: 'Test a notification provider',
                description: 'Sends a test notification to verify the provider is configured correctly.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Test result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
        '/notifications.deleteProvider': {
            post: {
                tags: ['Notifications'],
                summary: 'Delete a notification provider',
                description: 'Permanently deletes a notification provider from the organization.',
                security: [{ cookieAuth: [] }],
                responses: {
                    '200': { description: 'Deletion result' },
                    '401': { description: 'Unauthorized' },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'better-auth.session_token',
                description: 'Session cookie authentication. Login through the web interface to obtain a session.',
            },
        },
    },
};
