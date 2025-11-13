//サーバーコンポーネント（DBからのデータ取得はここ）
import EditPostForm from "./EditPostForm"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { getOwnPost } from "@/lib/ownPost"

type Params = {
    params: Promise<{id: string}>
}

export default async function EditPage({params}: Params){

        const session = await auth()
        const userId = session?.user?.id
        if(!session?.user?.email || !userId){
            throw new Error("不正なリクエストです")
        }
    
        const {id} = await params
        const post = await getOwnPost(userId,id) //ログインしているユーザーIDと記事のIDを取得
    
        if(!post){
            notFound() //postが存在しない場合はnotFoundに飛ばす
        }

    return(
        <EditPostForm post={post} />
    )
}