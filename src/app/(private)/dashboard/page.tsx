import { getOwnPosts } from "@/lib/ownPost"
import { auth } from "@/auth"

export default async function DashBoardPage() {
    const session = await auth()
    const userId = session?.user?.id
    if(!session?.user?.email || !userId){
        throw new Error("不正なリクエストです")
    }
    const posts = await getOwnPosts(userId)
    return(
        <div>
        dashboard
        </div>
    )
}