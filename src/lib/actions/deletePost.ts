'use server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type ActionState = {
    success: boolean,
    errors: Record<string, string[]> //Record<K,V>という型：キーは文字列、値は文字列の配列とまとめて指示
}

export async function deletePost(postId: string)
: Promise<ActionState>{
    await prisma.post.delete({
        where: {id: postId}
    })

    redirect('/dashboard')
}