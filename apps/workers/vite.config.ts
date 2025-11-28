import { defineConfig } from 'vite';

// Vite config for a Node (SSR) worker app. This ensures we can import uncompiled
// workspace packages like `@repo/queues` and `@repo/utils` by bundling/transpiling them.
export default defineConfig({
    appType: 'custom',
    // Dev server file-system access: allow resolving files from the monorepo root
    // so linked packages under ../../packages can be served/transformed in dev.
    server: {
        fs: {
            allow: ['..'],
        },
    },
    resolve: {
        // Keep workspace symlinks so Vite can resolve source TS files in packages
        preserveSymlinks: true,
    },
    esbuild: {
        platform: 'node',
        target: 'node18',
    },
    optimizeDeps: {
        // In SSR builds deps optimizer is not used; prevent discovery to silence warnings
        noDiscovery: true,
    },
    ssr: {
        target: 'node',
        // Important: inline our monorepo packages so Vite transpiles their TS on the fly
        // This lets you import e.g. `@repo/queues` without pre-compiling to JS
        noExternal: [/^@repo\//],
        // And make sure everything else stays external so vite-node doesn't try to
        // transform dependencies from node_modules (which caused missing url errors)
        // Externalize all bare deps except our workspace packages
        external: [/^(?!@repo\/)\w[\w-]*.*/],
    },
    build: {
        ssr: true,
        outDir: 'dist',
        target: 'node18',
        rollupOptions: {
            input: 'src/index.ts',
            output: {
                entryFileNames: 'index.mjs',
                format: 'esm',
                preserveModules: false,
            },
        },
    },
});
