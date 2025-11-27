import { generateOpenApiDocument } from 'trpc-to-openapi';
import { appRouter } from './root';

export const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'SeaStack API',
    description:
        'SeaStack API for managing Docker Swarm deployments, servers, services, and more. This API uses tRPC with OpenAPI endpoints following the dot-path convention (e.g., `health.ping`, `sshKeys.list`). For mutations, use POST requests with JSON body. For queries, use GET requests with query parameters.',
    version: '1.0.0',
    baseUrl: '/api/trpc',
    docsUrl: '/api-docs',
    tags: [
        'Health',
        'SSH Keys',
        'Servers',
        'Registries',
        'Projects',
        'Services',
        'Domains',
        'Deployments',
        'Networks',
        'Volumes',
        'Notifications',
    ],
    securitySchemes: {
        cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'better-auth.session_token',
            description:
                'Session cookie authentication. Login through the web interface to obtain a session.',
        },
    },
});

export { generateOpenApiDocument };
