import { getOwnPosts } from "@/lib/ownPost"
import { auth } from "@/auth"
import PostDropdownMenu from "@/components/post/PostDropdownMenu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashBoardPage() {

    //ログインしているユーザーidの取得
    const session = await auth()
    const userId = session?.user?.id
    if(!session?.user?.email || !userId){
        throw new Error("不正なリクエストです")
    }

    // 表示修正のためタイムゾーン指定
    function formatDateToJST(dateInput: string | Date) {
    // 文字列で渡ってきたら Date に変換、すでに Date 型ならそのまま使う
        const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,        // 24時間表記
            timeZone: "Asia/Tokyo", // 日本時間
        });
    }

    const posts = await getOwnPosts(userId)
    return(
        <div className='p-12'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-bold mb-4'>記事一覧</h1>
                <Button>
                    <Link href="/manage/posts/create">新規記事作成</Link>
                </Button>
            </div>
            <table className='table-auto w-full border-collapse border'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='border p-2 text-center'>タイトル</th>
                        <th className='border p-2 text-center'>表示／非表示</th>
                        <th className='border p-2 text-center'>更新日時</th>
                        <th className='border p-2 text-center'>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post)=>(
                        <tr key={post.id}>
                            <td className='border p-2'>{post.title}</td>
                            <td className='border p-2 text-center'>
                                {post.published ? "表示" : "非表示"}
                            </td>
                            <td className='border p-2 text-center'>
                                {formatDateToJST(post.updatedAt)}
                            </td>
                            <td className='border p-2 text-center'>
                                <PostDropdownMenu postId={post.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}