'use client';

import { useEffect, useRef } from 'react';
import SwaggerUI from 'swagger-ui-dist/swagger-ui-es-bundle.js';
import 'swagger-ui-dist/swagger-ui.css';

export default function ApiDocsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            SwaggerUI({
                domNode: containerRef.current,
                url: '/api/docs/openapi.json',
                deepLinking: true,
                presets: [SwaggerUI.presets.apis, SwaggerUI.SwaggerUIStandalonePreset],
                layout: 'BaseLayout',
            });
        }
    }, []);

    return (
        <div className="min-h-screen">
            <div ref={containerRef} />
        </div>
    );
}
