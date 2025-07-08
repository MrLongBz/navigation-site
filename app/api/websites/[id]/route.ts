import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const {
      name,
      url,
      category,
      description = '',
      icon_type = 'favicon',
      icon_value = '',
      is_recommended = false,
      clicks
    } = data

    const updateData: any = {}
    const fields = []
    const values = []

    if (name !== undefined) {
      fields.push('name = ?')
      values.push(name)
    }
    if (url !== undefined) {
      fields.push('url = ?')
      values.push(url)
    }
    if (category !== undefined) {
      fields.push('category = ?')
      values.push(category)
    }
    if (description !== undefined) {
      fields.push('description = ?')
      values.push(description)
    }
    if (icon_type !== undefined) {
      fields.push('icon_type = ?')
      values.push(icon_type)
    }
    if (icon_value !== undefined) {
      fields.push('icon_value = ?')
      values.push(icon_value)
    }
    if (is_recommended !== undefined) {
      fields.push('is_recommended = ?')
      values.push(is_recommended ? 1 : 0)
    }
    if (clicks !== undefined) {
      fields.push('clicks = ?')
      values.push(clicks)
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const sql = `UPDATE websites SET ${fields.join(', ')} WHERE id = ?`
    db.prepare(sql).run(...values)

    const updatedWebsite = db.prepare('SELECT * FROM websites WHERE id = ?').get(id)

    return NextResponse.json(updatedWebsite)
  } catch (error) {
    console.error('更新网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    db.prepare('DELETE FROM websites WHERE id = ?').run(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除网站失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 