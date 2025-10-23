import { getPosts, searchPosts } from "@/lib/post" //検索機能追加のためsearchPostsを追記
import PostCard from "@/components/post/PostCard"
import { Post } from "@/types/post"

type SearchParams = {
    search? : string
}

export default async function PostsPage(
    {searchParams}:{searchParams: Promise<SearchParams>}) { //型指定
    const resolvedSearchParams = await searchParams //二段階でsearchを取得する。直接取ろうとするとエラーになる。
    const query = resolvedSearchParams.search || "" //空の場合も想定

    //以下、すべての記事を取得していた
    //const posts = await getPosts() as Post[] //まずはDBから記事の取得→使いやすいように定数に入れておく※asは型設定、複数の可能性で[]とする
    //検索ワードがあったら対象の記事を取得、検索なしならすべて取得へと修正
    const posts = query    
    ? await searchPosts(query) as Post[] //queryがあったら、検索したワードの記事一覧を取得：
    : await getPosts() as Post[] //queryがなかったら、記事一覧を取得（最初に書いてたまま）

    
    return(
        <>
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post)=>(
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
        </>
    )
}