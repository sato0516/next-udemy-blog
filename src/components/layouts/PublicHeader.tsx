import Link from "next/link"
import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"  検索ボックスを別コンポーネントに分離したため不要に。※SearchBoxコンポーネント
import SearchBox from "@/components/post/SearchBox"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export default function PublicHeader() {
    return (
        <div>
            <header className="border-b bg-blue-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/dashboard" className="font-bold text-xl">Blog</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                        {/* 右側：検索 + ボタン（SPでは縦に、PCでは横に） */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 sm:min-w-[320px]">
                        {/* 検索ボックス：SPは横幅いっぱい、PCは固定幅 */}
                        <div className="w-full sm:w-64">
                            <SearchBox />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/login">ログイン</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">登録</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}