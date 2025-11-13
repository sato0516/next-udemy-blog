'use client' //クライアントコンポーネント※RSCとRCCは一つのファイルで扱えないため分離

import { useState,useActionState,useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import TextareaAutosize from "react-textarea-autosize"
import "highlight.js/styles/github.css"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createPost } from "@/lib/actions/createPost"
import Image from "next/image"

//propsで受け取る（型指定）
type EditPostFormProps = {
    post: {
        id: string
        title: string
        content: string
        topImage: string | null
        published: boolean
    }
}

export default function EditPostForm({post}: EditPostFormProps) {
    //各項目useStateで変更できるように※初期値はpost(props)がもつ値等を指定
    const [content, setContent] = useState(post.content)
    const [contentLength, setContentLength] = useState<number>(0)
    const [preview,setPreview] = useState(false)
    const [title,setTitle] = useState(post.title)
    const [published,setPublished] = useState(post.published)
    const [imagePreview,setImagePreview] =useState(post.topImage)

    const [state,formAction] = useActionState(createPost,{
        success: false, errors: {}
    })

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setContent(value) //テキストエリアの内容を入力値で更新
        setContentLength(value.length) //JSの機能で文字数計算
        }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; //複数ある可能性有、配列形式で
        if(file){
            const previewUrl = URL.createObjectURL(file) //プレビュー用のURLを生成
            setImagePreview(previewUrl)
        }
    }

    useEffect (()=>{
        return() => {
            if(imagePreview && imagePreview !== post.topImage){//DBに入っている画像URLと変更があったら、
                URL.revokeObjectURL(imagePreview) //プレビューURLを削除
            }
        }
    },[imagePreview, post.topImage])//第二引数で監視対象を設定…これらが変わったら、この処理が動く

    return(
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">新規記事投稿（Markdown対応）</h1>
            <form action={formAction} className="space-y-4">
                <div>
                    <Label htmlFor="title">タイトル</Label>
                    <Input type="text" id="title" name="title" placeholder="タイトルを入力してください" 
                    value={title} onChange={(e)=> setTitle(e.target.value)}//valueはDB初期値を入力欄に表示する役割、e.target.valueは「入力欄に今入っている値」を指す
                    />
                    {state.errors.title && (
                        <p className='text-red-500 text-sm mt-1'>{state.errors.title.join(',')}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="topImage">トップ画像</Label>
                    <Input
                        type="file"
                        id="topImage"
                        accept="image/*"
                        name="topImage"
                        onChange={handleImageChange}
                    />
                    {imagePreview &&( //imagePreviewがあったら、
                        <div className='mt-2'>
                            <Image
                                src={imagePreview}
                                alt={post.title}
                                width={0}
                                height={0}
                                sizes="200px"
                                className="w-[200px]"
                                priority
                            />
                        </div>
                    )}
                    {state.errors.topImage && (
                        <p className='text-red-500 text-sm mt-1'>{state.errors.topImage.join(',')}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="content">内容（Markdown）</Label>
                    <TextareaAutosize id="content" name="content" className="w-full border p-2" placeholder="Markdown形式で入力してください"
                    minRows={8} value={content} onChange={handleContentChange}/>
                    {state.errors.content && (
                        <p className='text-red-500 text-sm mt-1'>{state.errors.content.join(',')}</p>
                    )}
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                    文字数： {contentLength}
                </div>
                <div>
                    <Button type="button" onClick={()=> setPreview(!preview)}> {/*previewのtrue（表示） false（閉じている）を逆にする*/}
                        {preview ? "プレビューを閉じる" : "プレビューを表示"}  {/*状態によってボタンの表示を変える*/}
                    </Button>
                </div>
                {preview && (
                    <div className="border p-4 bg-gray-50">
                        <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        skipHtml={false}//HTMLスキップを無効化
                        unwrapDisallowed={true} //Markdownの改行を解釈
                        className="prose max-w-none"
                        >{content}</ReactMarkdown>
                    </div>
                )}
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">更新する</Button>
                <Input type="hidden" name="postId" value={post.id} />
                <Input type="hidden" name="oldImageUrl" value={post.topImage || ''} /> {/*混同しないようにoldImageとする*/}
            </form>
        </div>
    )
}