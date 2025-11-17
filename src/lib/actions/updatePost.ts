'use server'
import { postSchema } from '@/validations/post'
import { saveImage } from '@/utils/image'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

type ActionState = {
    success: boolean,
    errors: Record<string, string[]> //Record<K,V>という型：キーは文字列、値は文字列の配列とまとめて指示
}

export async function updatePost(
    prevState: ActionState,
    formData: FormData
    ): Promise<ActionState>{

    //フォームの情報を取得
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const topImageInput = formData.get('topImage') //ただ取得ではなく、画像があるかどうかの確認をする（ための一旦の取得がtopImageInput）
    const topImage = topImageInput instanceof File ? topImageInput : null //Fileなら＝画像ありならtopImageInputをかえす（topImageは存在することになる）、画像なしならnullをかえす
    const postId = formData.get('postId') as string
    const published = formData.get('published') === 'true'
    const oldImageUrl = formData.get('oldImageUrl') as string
    
    //バリデーション
    const validationResult = postSchema.safeParse({ title,content,topImage})
    if (!validationResult.success){
        return { success: false, errors: validationResult.error.flatten().fieldErrors}
    }

    //画像保存
    let imageUrl = oldImageUrl
    if(topImage instanceof File && topImage.size > 0 && topImage.name !== 'undefined'){//画像が存在しない場合を弾くための条件
        const newImageUrl = await saveImage(topImage)  //3つの条件がそろう場合のみ、画像保存とURL取得を行う
        if (!newImageUrl){
            return {success: false, errors: { image: ['画像の保存に失敗しました']}}
        }//newImageUrlにエラーがある場合、エラーを返す
        imageUrl = newImageUrl //画像の差し替えがされたら、imageUrlが新しく切り替わる
    }

    //DB登録　※ログインしているユーザーの情報を取得したうえで処理する
    await prisma.post.update({
        where: {id: postId},
        data: {
            title,
            content,
            published,
            topImage: imageUrl,
        }
    })

    redirect('/dashboard')
}