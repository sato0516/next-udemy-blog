//ダミーデータ用に作成したファイル
import { PrismaClient } from '@/generated/prisma' //エラーのため修正
import * as bcypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(){
    //クリーンアップ
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()

    const hashedPassword = await bcypt.hash('password123', 12)

    //ダミー画像
    const dummyImages = [
        'https://picsum.photos/seed/post1/600/400',
        'https://picsum.photos/seed/post2/600/400'
    ]

    //ユーザー作成
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
            posts: {
                create: [
                    {
                        title: 'はじめてのブログ投稿',
                        content: 'これは最初のブログ投稿です。',
                        topImage: dummyImages[0],
                        published: true
                    },{
                        title: '2番目の投稿',
                        content: 'これは2つ目のブログ投稿です。',
                        topImage: dummyImages[1],
                        published: true
                    }
                ]
            }
        }
    })
    console.log({ user })

}

main()
    .catch((e)=> {
        console.error(e) //エラー内容を表示
        process.exit(1) //プロセスを止める
    })
    .finally(async ()=> {
        await prisma.$disconnect() //DBとの接続を切る
    })