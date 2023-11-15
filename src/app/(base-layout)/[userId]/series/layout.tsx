export default async function SeriesLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (<div className="mt-12 mb-12 lg:mr-28 lg:ml-28 mr-4 ml-4 mx-auto">
        {children}
    </div>)
}