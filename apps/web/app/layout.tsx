import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TCPQueryClientProvider } from '@/components/trpc-provider';

export const metadata: Metadata = {
    title: 'SeaStack',
    description: 'Application deployment made easy.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TCPQueryClientProvider>
            <html lang='en' suppressHydrationWarning>
                <body>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </TCPQueryClientProvider>
    );
}
