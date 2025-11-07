import PrivateHeader from '@/components/layouts/PrivateHeader'

export default function PrivateLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
        
    return(
        <>
        {/*headerは共通で、その下はページごとに変える*/}
        <PrivateHeader />
        <div className="container mx-auto px-4 py-8">
        {children}
        </div> 
        </>
    )
}