import { type NextRequest, NextResponse } from "next/server"
import { websiteQueries } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    console.log("API PUT 收到的数据:", body)
    
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

    console.log("PUT 映射后的图标数据:", {
      iconType,
      iconValue: iconValue?.substring(0, 50) + "...",
      icon_type,
      icon_value: icon_value?.substring(0, 50) + "..."
    })

    if (!name || !url || !category) {
      return NextResponse.json({ error: "网站名称、URL和分类不能为空" }, { status: 400 })
    }

    websiteQueries.update.run(
      name,
      url,
      category,
      description || "",
      icon_type || "favicon",
      icon_value || "",
      is_recommended ? 1 : 0,
      id,
    )

    const updatedWebsite = websiteQueries.getById.get(id)

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    console.error("更新网站错误:", error)
    return NextResponse.json({ error: "更新网站失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    
    // 检查网站是否存在
    const website = websiteQueries.getById.get(id)
    if (!website) {
      return NextResponse.json({ error: "网站不存在" }, { status: 404 })
    }

    // 执行删除
    const result = websiteQueries.delete.run(id)
    
    // 检查是否实际删除了行
    if (result.changes === 0) {
      return NextResponse.json({ error: "删除失败，网站可能已不存在" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "删除成功" })
  } catch (error) {
    console.error("删除网站错误:", error)
    return NextResponse.json({ error: "删除网站失败" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body: { action?: string } = await request.json()
    const { action } = body

    if (action === "click") {
      websiteQueries.updateClicks.run(id)
      const website = websiteQueries.getById.get(id)
      return NextResponse.json(website)
    }

    if (action === "toggle-recommend") {
      const website = websiteQueries.getById.get(id) as any
      if (!website) {
        return NextResponse.json({ error: "网站不存在" }, { status: 404 })
      }

      // 确保正确处理布尔值转换
      const currentRecommendedStatus = website.is_recommended
      const newRecommendedStatus = currentRecommendedStatus ? 0 : 1
      
      websiteQueries.toggleRecommended.run(newRecommendedStatus, id)
      const updatedWebsite = websiteQueries.getById.get(id)
      return NextResponse.json(updatedWebsite)
    }

    return NextResponse.json({ error: "无效的操作" }, { status: 400 })
  } catch (error) {
    console.error("网站操作错误:", error)
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}
