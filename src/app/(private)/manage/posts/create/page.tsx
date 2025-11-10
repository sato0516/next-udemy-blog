'use client'
import { useState,useActionState } from "react"
//import createPost from "@/lib/actions/createPost"
import RactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import TextareaAutosize from "react-textarea-autosize"
import "highlight.js/styles/github.css"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CreatePage(){
    const {content, setContent} = useState("")
    const {contentLength, setContentLength} =useState("")
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setContent(value) //テキストエリアの内容を入力値で更新
        setContentLength(value.length) //JSの機能で文字数計算
        }

    return(
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">新規記事投稿（Markdown対応）</h1>
            <form className="space-y-4">
                <div>
                    <Label htmlFor="title">タイトル</Label>
                    <Input type="text" id="title" name="title" placeholder="タイトルを入力してください"/>
                </div>
                <div>
                    <Label htmlFor="content">内容（Markdown）</Label>
                    <TextareaAutosize id="content" name="content" className="w-full border p-2" placeholder="Markdown形式で入力してください"
                    minRows={8} value={content} onChange={handleContentChange}/>
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                    文字数： {contentLength}
                </div>
            </form>
        </div>
    )
}