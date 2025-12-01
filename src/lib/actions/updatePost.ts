'use server'
import { postSchema } from '@/validations/post'
import { saveImage } from '@/utils/image'
import { prisma } from '@/lib/prisma'

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
    //const topImageInput = formData.get('topImage') //ただ取得ではなく、画像があるかどうかの確認をする（ための一旦の取得がtopImageInput）
    //const topImage = topImageInput instanceof File ? topImageInput : null //Fileなら＝画像ありならtopImageInputをかえす（topImageは存在することになる）、画像なしならnullをかえす
    const rawTopImage = formData.get('topImage')//本番環境でエラー回避
    const postId = formData.get('postId') as string
    const published = formData.get('published') === 'true'
    const oldImageUrl = formData.get('oldImageUrl') as string
    
    // File っぽいものだけを画像として扱う
    let topImage: File | null = null
    if (rawTopImage instanceof File && rawTopImage.size > 0) {
        topImage = rawTopImage
    }

    //バリデーション
    //const validationResult = postSchema.safeParse({ title,content,topImage})
    //if (!validationResult.success){
    //    return { success: false, errors: validationResult.error.flatten().fieldErrors}}

    // --- バリデーション ---
  // 画像は任意扱いにして、title / content を主にチェック
    const dataForValidation: any = { title, content }
    if (topImage) {
        dataForValidation.topImage = topImage
    }

    const validationResult = postSchema.safeParse(dataForValidation)
    if (!validationResult.success) {
        return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        }
    }

    //画像保存
    let imageUrl = oldImageUrl
    //if(topImage && topImage.size > 0){//画像が存在しない場合を弾くための条件
    //    const newImageUrl = await saveImage(topImage)  //3つの条件がそろう場合のみ、画像保存とURL取得を行う
    //    if (!newImageUrl){
    //        return {success: false, errors: { image: ['画像の保存に失敗しました']}}
    //    }//newImageUrlにエラーがある場合、エラーを返す
    //    imageUrl = newImageUrl //画像の差し替えがされたら、imageUrlが新しく切り替わる
    //}
    
    if (topImage) {
        try {
            const newImageUrl = await saveImage(topImage)
            if (!newImageUrl) {
                return {
                    success: false,
                    errors: { topImage: ['画像の保存に失敗しました（URL が空です）'] },
                }
            }
            imageUrl = newImageUrl
        } catch (e) {
            console.error('updatePost: saveImage error', e)
            return {
                success: false,
                errors: { topImage: ['画像の保存中にエラーが発生しました'] },
            }
        }
    }

    //DB登録　※ログインしているユーザーの情報を取得したうえで処理する
    try {
        await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                content,
                published,
                topImage: imageUrl,
            },
        })
    } catch (e) {
        console.error('updatePost error', e)
        return {
            success: false,
            errors: { form: ['記事の更新に失敗しました'] },
        }
    }

    //redirect('/dashboard') 挙動修正のためリダイレクトはクライアント側へ
    return { success: true, errors: {} }
}