'use client'
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SearchBox() {
    const [ search, setSearch ] = useState("")
    const [ debouncedSearch, setDebouncedSearch ] = useState("")
    const router = useRouter() //リダイレクト用

    //デバウンス
    useEffect(()=>{
        const timer = setTimeout( ()=> {//JSの機能setTimeoutを使用
            setDebouncedSearch(search)
        },500)

        return () => clearTimeout(timer)//～したらタイマーが切れる

    }, [search])//引数に監視対象を設定[search]が変わったら実行を指定

    //debouncedSearchが更新されたら実行
    useEffect(()=>{
        if(debouncedSearch.trim()){ //条件：debouncedSearchが存在すれば※並行してtrimで不要なスペースを削除
            router.push(`/?search=${debouncedSearch.trim()}`)//リダイレクトをかける
        } else { //debouncedSearchが存在しなければ
            router.push("/")
        }
    },[debouncedSearch, router])

    return(
        <>
        <Input 
            placeholder="記事を検索…"
            className="w-[200px] lg:w-[300px] bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)} //文字が入力されたタイミングでsearchの値（検索ワード）を更新
        />
        </>
    )
}