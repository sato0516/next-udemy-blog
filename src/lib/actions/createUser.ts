'use server'
import { registerSchema } from '@/validations/user'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { signIn } from '@/auth';
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'

type ActionState = {
    success: boolean,
    errors: Record<string, string[]> //Record<K,V>という型：キーは文字列、値は文字列の配列とまとめて指示
}

//バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
    const {fieldErrors,formErrors} = error.flatten();

    const castedFieldErrors = fieldErrors as Record<string, string[]>; //型エラー回避のためにfieldErrorsにundefinedが入らないように指定

    if(formErrors.length > 0) {
        return{ success: false,errors: {...fieldErrors,confirmPassword: formErrors}}
    }
    return {success: false, errors: castedFieldErrors}; //型をundefinedが入らないようキャストしたcastedFieldErrorsへ変更してエラー回避
}

//カスタムエラー処理
function handleError(customErrors: Record<string, string[]>):ActionState {
    return {success: false, errors: customErrors};
}

export async function createUser(
    prevState: ActionState,
    formData: FormData
    ): Promise<ActionState>
{
    //フォームからわたってきた情報を取得※コンタクトフォームではformData.getで1つずつ取得したところ。今回は異なる書き方。
    const rawFormData = Object.fromEntries(
        ["name","email","password","confirmPassword"].map(field =>[
            field,
            formData.get(field) as string
        ])
    ) as  Record<string, string>

    //バリデーション
    const validationResult = registerSchema.safeParse(rawFormData)
    if (!validationResult.success){
        return handleValidationError(validationResult.error)
    }

    //DBにメールアドレスが存在しているかの確認
    const existingUser = await prisma.user.findUnique({
        where: {email: rawFormData.email}
    })
    if(existingUser){
        return handleError({email: ["このメールアドレスはすでに登録されています。"]})
    }

    //DBに登録
    const hashdPassword = await bcryptjs.hash(rawFormData.password,12) //暗号化

    await prisma.user.create({
        data: {
            name: rawFormData.name,
            email: rawFormData.email,
            password: hashdPassword //暗号化したもので登録
        }
    })

    //dashboardにリダイレクト（そのためにサインインが必要）
    await signIn('credentials', {
        ...Object.fromEntries(formData), //オブジェクトに変換
        redirect: false //自動的なリダイレクトを停止※手動で動かすため
    });
    
    redirect('/dashboard')//手動リダイレクト

}