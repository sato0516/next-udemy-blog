//import { PrismaClient } from '@/generated/prisma'
//↑の前の設定：import { PrismaClient } from '@prisma/client' →50のnpx prisma db seedでエラーのため書き換えてみる。
import { PrismaClient } from "@prisma/client"; //本番環境のエラー回避のため修正

//グローバルスコープでPrismaインスタンスを保持できる場所を作る
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}
//Prismaインスタンスがあればつかう
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
//開発環境でのみ使用
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma