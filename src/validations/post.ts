import { z } from "zod"

export const postSchema = z.object({
    title:z.string()
    .min(3,{message:"タイトルは3文字以上で入力してください"})
    .max(255,{message:"タイトルは255文字以内で入力してください"}),

    content:z.string()
    .min(10,{message:"内容は10文字以上で入力してください"}),

    //topImage:z.instanceof(File).nullable().optional()
    topImage: z
    .any()
    .optional()
    .refine(
        (file) => {
        if (!file) return true // 未設定はOK
        // size プロパティを持っていて、5MB以内ならOK という判定
        const size = (file as any).size
        return typeof size === 'number' && size <= 5 * 1024 * 1024
        },
        { message: '画像は5MB以下のファイルを選択してください' }
    ),
})