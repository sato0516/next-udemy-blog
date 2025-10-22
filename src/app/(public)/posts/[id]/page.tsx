import { getPost } from "@/lib/post"
import { notFound } from "next/navigation"

type Params = {
    params: Promise<{id: string}>
}

export default async function PostPage({params}: Params) {
    const {id} = await params
    const post = await getPost(id)

    if(!post){
        notFound() //postが存在しない場合はnotFound関数を呼ぶ
    }

    return(
        <div>
            
        </div>
    )
}