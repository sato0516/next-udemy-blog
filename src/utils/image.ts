//import { writeFile } from "fs/promises"
//import path from "path"
import { put } from '@vercel/blob';

export async function saveImage(file: File): Promise<string | null>{
    try{
    //const buffer = Buffer.from(await file.arrayBuffer()) //フォームからわたってくるFileオブジェクト（arrayBuffer形式）をNode.jsのBufferに変換
    const fileName = `post_${Date.now()}_${file.name}`; //重複しないファイル名とする
    //const uploadDir = path.join(process.cwd(),'public/images')
    
    const blob = await put(fileName, file, {
        access: 'public',
    });

// ここで blob.url が「https://〜.public.blob.vercel-storage.com/...」になる
return blob.url;
    } catch (error) {
    console.error('Blob upload error:', error);
    return null;
    }
}
    //try{
        //const filePath = path.join(uploadDir,fileName)
        //await writeFile(filePath,buffer) //メソッドwriteFileでbufferをファイルに書き込む
        //return `/images/${fileName}`//返り値は文字情報→DB保存
    //} catch(error){
        //console.error("画像保存エラー",error)
        //return null
    //}