import { type NextRequest, NextResponse } from "next/server"
import { websiteQueries, initDatabase } from "@/lib/database"

// 初始化数据库
initDatabase()

export async function GET() {
  try {
    const websites = websiteQueries.getAll.all()
    return NextResponse.json(websites)
  } catch (error) {
    console.error("获取网站列表错误:", error)
    return NextResponse.json({ error: "获取网站列表失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API收到的数据:", body)
    
    // 处理字段名映射 (前端发送的是 iconType/iconValue/isRecommended)
    const { 
      name, 
      url, 
      category, 
      description, 
      iconType, 
      iconValue, 
      isRecommended,
      // 也支持原来的字段名
      icon_type = iconType,
      icon_value = iconValue,
      is_recommended = isRecommended
    } = body

    console.log("映射后的图标数据:", {
      iconType,
      iconValue: iconValue?.substring(0, 50) + "...",
      icon_type,
      icon_value: icon_value?.substring(0, 50) + "..."
    })

    if (!name || !url || !category) {
      return NextResponse.json({ error: "网站名称、URL和分类不能为空" }, { status: 400 })
    }

    const result = websiteQueries.create.run(
      name,
      url,
      category,
      description || "",
      icon_type || "favicon",
      icon_value || "",
      0,
      is_recommended ? 1 : 0,
    )

    const newWebsite = websiteQueries.getById.get(result.lastInsertRowid) as any
    console.log("API 返回给前端的数据:", {
      id: newWebsite.id,
      name: newWebsite.name,
      icon_type: newWebsite.icon_type,
      icon_value_length: newWebsite.icon_value?.length || 0,
      icon_value_preview: newWebsite.icon_value?.substring(0, 50) + "..."
    })

    return NextResponse.json(newWebsite, { status: 201 })
  } catch (error) {
    console.error("创建网站错误:", error)
    return NextResponse.json({ error: "创建网站失败" }, { status: 500 })
  }
}
