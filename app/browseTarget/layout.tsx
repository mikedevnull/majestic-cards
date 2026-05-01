export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="max-w-4xl flex-1 w-full mx-auto">
        <h2 className="text-xl font-bold mb-8">Select target for card</h2>
        {children}

    </main >
}