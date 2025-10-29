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
        {children} 
        </>
    )
}