import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PostCardProps } from "@/types/post"

export default function PostCard({post}: PostCardProps) {
    return (
        //｛post.~｝動的にDBから取得する箇所
        <Card className="hover:shadow-lg transition-shadow">
            <Link href={`/posts/${post.id}`}>
                <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                    <div className="flex item-center justify-between text-sm text-gray-500">
                        <span>{post.author.name}</span>
                        <time>{
                        formatDistanceToNow(new Date(post.createdAt),{
                            addSuffix: true,//オプション追加：「～日前」を表示する指示
                            locale: ja
                        })}</time>
                    </div>
                </CardContent>
            </Link>
        </Card>
    )
}