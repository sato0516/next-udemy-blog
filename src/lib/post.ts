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
