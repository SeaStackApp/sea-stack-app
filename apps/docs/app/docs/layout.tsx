import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { EditThisPage } from '@/components/edit-this-page'

export default function DocsLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex">
                <div className="hidden md:block">
                    <Sidebar />
                </div>
                <main className="flex-1 md:ml-64">
                    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
                        <article className="prose">
                            {children}
                        </article>
                        <EditThisPage />
                    </div>
                </main>
            </div>
        </div>
    )
}
