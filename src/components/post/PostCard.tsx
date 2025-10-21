import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
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
                {post.topImage && ( //postのtopImageがあるなら表示
                    <div className="relative w-full h-48">
                        <Image
                            src={post.topImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw,33vw"//nextJS公式に記載のレスポンシブ対応
                            className="rounded-t-md object-cover"
                            priority
                        />
                    </div>
                )} 
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