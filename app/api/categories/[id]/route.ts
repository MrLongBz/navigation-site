import { type NextRequest, NextResponse } from "next/server"
import { categoryQueries } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "分类名称不能为空" }, { status: 400 })
    }

    categoryQueries.update.run(name.trim(), id)
    const updatedCategory = categoryQueries.getById.get(id)

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("更新分类错误:", error)
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    categoryQueries.delete.run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除分类错误:", error)
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 })
  }
}
