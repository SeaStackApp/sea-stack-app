import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
    title: 'SeaStack Documentation',
    description: 'Documentation for SeaStack - Manage remote servers and deploy containerized applications',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
