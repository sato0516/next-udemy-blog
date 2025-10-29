'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData), //オブジェクトに変換
            redirect: false //自動的なリダイレクトを停止※手動で動かすため
        });

        redirect('/dashboard')//手動リダイレクト

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'メールアドレスまたはパスワードが正しくありません。';
                default:
                    return 'エラーが発生しました。';
            }
        }
    throw error;
    }
}