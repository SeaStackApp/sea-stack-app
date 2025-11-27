'use client';

import { useEffect, useRef } from 'react';

export default function ApiDocsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Dynamically load Swagger UI
        const loadSwaggerUI = async () => {
            if (!containerRef.current) return;

            // Load CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css';
            document.head.appendChild(link);

            // Load and initialize Swagger UI
            const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-es-bundle.js')).default;
            
            SwaggerUIBundle({
                domNode: containerRef.current,
                url: '/api/docs/openapi.json',
                deepLinking: true,
            });
        };

        loadSwaggerUI();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div ref={containerRef} />
        </div>
    );
}
