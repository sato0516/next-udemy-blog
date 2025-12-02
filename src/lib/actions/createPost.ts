'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

type ActionState = {
  success: boolean
  errors: Record<string, string[]>
}

export async function createPost(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // ① ここで動いているか確認
  console.log('createPost called', { title, content })

  const session = await auth()
  const userId = session?.user?.id
  if (!session?.user?.email || !userId) {
    console.log('no session or userId')
    throw new Error('不正なリクエストです')
  }

  await prisma.post.create({
    data: {
      title,
      content,
      topImage: null,
      published: true,
      authorId: userId,
    },
  })

  console.log('post created, redirecting')

  redirect('/dashboard')
}