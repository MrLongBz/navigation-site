import { NextResponse } from "next/server"
import { websiteQueries, initDatabase } from "@/lib/database"

// 初始化数据库
initDatabase()

export async function GET() {
  try {
    const recommendedWebsites = websiteQueries.getRecommended.all()
    return NextResponse.json(recommendedWebsites)
  } catch (error) {
    console.error("获取推荐网站错误:", error)
    return NextResponse.json({ error: "获取推荐网站失败" }, { status: 500 })
  }
}
