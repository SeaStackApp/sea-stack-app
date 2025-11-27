'use client';

import { useEffect, useRef, useState } from 'react';

export default function ApiDocsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Dynamically load Swagger UI
        const loadSwaggerUI = async () => {
            if (!containerRef.current) return;

            // Check if CSS is already loaded
            const existingLink = document.querySelector(
                'link[href*="swagger-ui.css"]'
            );
            if (!existingLink) {
                // Load CSS from the installed package
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href =
                    '/_next/static/css/swagger-ui.css';
                document.head.appendChild(link);
            }

            try {
                // Load and initialize Swagger UI
                const SwaggerUIBundle = (
                    await import('swagger-ui-dist/swagger-ui-es-bundle.js')
                ).default;

                if (mounted && containerRef.current) {
                    SwaggerUIBundle({
                        domNode: containerRef.current,
                        url: '/api/docs/openapi.json',
                        deepLinking: true,
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to load Swagger UI:', error);
                setIsLoading(false);
            }
        };

        loadSwaggerUI();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <p>Loading API documentation...</p>
                </div>
            )}
            <div ref={containerRef} />
            <style jsx global>{`
                /* Swagger UI CSS is loaded via the JS bundle */
                .swagger-ui .info {
                    margin: 50px 0;
                }
            `}</style>
        </div>
    );
}
