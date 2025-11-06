export default function CardsGrid({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    return (
        <div className='grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 my-6 gap-2'>
            {children}
        </div>
    );
}
