import { writeFile } from "fs/promises"
import path from "path"

export async function saveImage(file: File): Promise<string | null>{
    const buffer = Buffer.from(await file.arrayBuffer()) //フォームからわたってくるFileオブジェクト（arrayBuffer形式）をNode.jsのBufferに変換
    const fileName = `${Date.now()}_${file.name}` //重複しないファイル名とする
    const uploadDir = path.join(process.cwd(),'public/images')

    try{
        const filePath = path.join(uploadDir,fileName)
        await writeFile(filePath,buffer) //メソッドwriteFileでbufferをファイルに書き込む
        return `/images/${fileName}`//返り値は文字情報→DB保存
    } catch(error){
        console.error("画像保存エラー",error)
        return null
    }
}