import { prisma } from '@/lib/prisma'

export async function getPosts(){
    return await prisma.post.findMany({
        where: { published: true}, //公開設定のものを指定
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy :{
            createdAt: 'desc' //新しい順で指定
        }
    })
}

//DBから1記事分のデータを取得する関数
export async function getPost(id: string){
    return await prisma.post.findUnique({
        where: {id},
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

export async function searchPosts(search: string){ //引数は検索したい文字列
    
    //全角スペースを半角スペースに変換＆スペースで分割（空文字などを除外）
    const decodedSearch = decodeURIComponent(search)
    const normalizedSearch = decodedSearch.replace(/[\s　]+/g,' ').trim()
    const searchWords = normalizedSearch.split(' ').filter(Boolean)

    //filtersを定義：入力された単語を１つずつ、記事のタイトルか記事の内容どちらかに入っているかチェック
    const filters = searchWords.map( word =>({
        OR : [
            { title: { contains: word }},
            { content: { contains: word }},
        ]
    }))

    return await prisma.post.findMany({
        where: {
            AND: filters // filtersに該当するもの（タイトルと内容にwordを含むもの）を複数、AND条件でつなげていく
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy :{
            createdAt: 'desc' //新しい順で指定
        }
    })
}