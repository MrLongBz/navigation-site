"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  Save,
  X,
  MousePointerClick
} from "lucide-react"
import { WebsiteIcon } from "@/components/WebsiteIcon"
import type { Website, Category, IconType, Theme } from "@/types"

interface WebsiteCardProps {
  website: Website
  categories: Category[]
  onEdit: (website: Website) => Promise<void>
  onDelete: (websiteId: number) => Promise<void>
  onToggleRecommended: (website: Website) => Promise<void>
  onClick: (website: Website) => void
  themeClasses: any
  theme: Theme
  isLoggedIn: boolean
  isRecommended?: boolean
}

export function WebsiteCard({
  website,
  categories,
  onEdit,
  onDelete,
  onToggleRecommended,
  onClick,
  themeClasses,
  theme,
  isLoggedIn,
  isRecommended = false
}: WebsiteCardProps) {
  // 调试自定义图标
  React.useEffect(() => {
    if (website.icon_type === "custom") {
      console.log("WebsiteCard 传递给WebsiteIcon的自定义图标数据:", {
        name: website.name,
        icon_type: website.icon_type,
        icon_value: website.icon_value?.substring(0, 50) + "...",
        hasIconValue: !!website.icon_value
      })
    }
  }, [website.icon_type, website.icon_value, website.name])
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editForm, setEditForm] = useState({
    name: website.name,
    url: website.url,
    description: website.description || "",
    category: website.category,
    icon_type: website.icon_type as IconType,
    icon_value: website.icon_value
  })

  const handleSave = async () => {
    try {
      await onEdit({ ...website, ...editForm })
      setIsEditing(false)
    } catch (error) {
      console.error("保存失败:", error)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: website.name,
      url: website.url,
      description: website.description || "",
      category: website.category,
      icon_type: website.icon_type as IconType,
      icon_value: website.icon_value
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm("确定要删除这个网站吗？")) {
      setIsDeleting(true)
      try {
        await onDelete(website.id)
      } catch (error) {
        console.error("删除失败:", error)
        setIsDeleting(false)
      }
    }
  }

  const handleToggleRecommended = async () => {
    try {
      await onToggleRecommended(website)
    } catch (error) {
      console.error("切换推荐状态失败:", error)
    }
  }

  const categoryName = website.category || "未分类"

  if (isEditing) {
    return (
      <Card className={`${isRecommended ? themeClasses.recommendedCard : themeClasses.websiteCard} border transition-all duration-300`}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${themeClasses.text}`}>编辑网站</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className={themeClasses.saveButton}
              >
                <Save size={14} />
                保存
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className={themeClasses.cancelButton}
              >
                <X size={14} />
                取消
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                网站名称
              </label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                placeholder="输入网站名称"
              />
            </div>

            <div>
              <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                网站链接
              </label>
              <Input
                value={editForm.url}
                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                描述
              </label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className={`${themeClasses.textareaBackground} ${themeClasses.textareaBorder} ${themeClasses.textareaText} resize-none`}
                placeholder="网站描述（可选）"
                rows={2}
              />
            </div>

            <div>
              <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                分类
              </label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className={`${themeClasses.selectBackground} ${themeClasses.selectBorder} ${themeClasses.selectText}`}>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent className={`${themeClasses.dropdownBackground} ${themeClasses.dropdownBorder}`}>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.name}
                      className={`${themeClasses.dropdownText} ${themeClasses.dropdownItemHover}`}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                图标类型
              </label>
              <Select
                value={editForm.icon_type}
                onValueChange={(value) => setEditForm({ 
                  ...editForm, 
                  icon_type: value as IconType,
                  icon_value: value === "lucide" ? "globe" : ""
                })}
              >
                <SelectTrigger className={`${themeClasses.selectBackground} ${themeClasses.selectBorder} ${themeClasses.selectText}`}>
                  <SelectValue placeholder="选择图标类型" />
                </SelectTrigger>
                <SelectContent className={`${themeClasses.dropdownBackground} ${themeClasses.dropdownBorder}`}>
                  <SelectItem value="lucide" className={`${themeClasses.dropdownText} ${themeClasses.dropdownItemHover}`}>
                    Lucide 图标
                  </SelectItem>
                  <SelectItem value="favicon" className={`${themeClasses.dropdownText} ${themeClasses.dropdownItemHover}`}>
                    网站图标
                  </SelectItem>
                  <SelectItem value="custom" className={`${themeClasses.dropdownText} ${themeClasses.dropdownItemHover}`}>
                    自定义图标
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editForm.icon_type === "lucide" && (
              <div>
                <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                  Lucide 图标名
                </label>
                <Input
                  value={editForm.icon_value}
                  onChange={(e) => setEditForm({ ...editForm, icon_value: e.target.value })}
                  className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                  placeholder="例如：globe, star, heart"
                />
              </div>
            )}

            {editForm.icon_type === "custom" && (
              <div>
                <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                  图标 URL
                </label>
                <Input
                  value={editForm.icon_value}
                  onChange={(e) => setEditForm({ ...editForm, icon_value: e.target.value })}
                  className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                  placeholder="https://example.com/icon.png"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={`
        ${isRecommended ? themeClasses.recommendedCard : themeClasses.websiteCard} 
        ${isRecommended ? themeClasses.recommendedCardBorder : themeClasses.websiteCardBorder}
        ${isRecommended ? "" : themeClasses.websiteCardHover}
        border transition-all duration-300 cursor-pointer group relative
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
      `}
      onClick={() => !isLoggedIn && onClick(website)}
    >
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className={`${themeClasses.recommendedBadge} ${themeClasses.recommendedBadgeText} px-2 py-1`}>
            <Star size={12} fill="currentColor" />
            推荐
          </Badge>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <WebsiteIcon
              website={website}
              size={isRecommended ? "h-12 w-12" : "h-10 w-10"}
              theme={theme}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${themeClasses.text} truncate group-hover:${themeClasses.accent} transition-colors`}>
                  {website.name}
                </h3>
                {/* 临时调试信息 */}
                <div className="text-xs text-red-500 font-mono">
                  图标: {website.icon_type} | 长度: {website.icon_value?.length || 0} | 
                  类型: {website.icon_value?.startsWith('data:image/') ? 'base64' : '其他'}
                </div>
                <div className="text-xs text-blue-500 font-mono">
                  完整数据: {JSON.stringify({
                    id: website.id,
                    name: website.name,
                    icon_type: website.icon_type,
                    icon_value_length: website.icon_value?.length,
                    icon_value_start: website.icon_value?.substring(0, 30)
                  })}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`${themeClasses.badge} ${themeClasses.badgeText} text-xs`}
                  >
                    {categoryName}
                  </Badge>
                  
                  {website.clicks > 0 && (
                    <Badge 
                      variant="outline" 
                      className={`${themeClasses.badge} ${themeClasses.badgeText} text-xs`}
                    >
                      <MousePointerClick size={10} className="mr-1" />
                      {website.clicks}
                    </Badge>
                  )}
                </div>

                {website.description && (
                  <p className={`${themeClasses.secondaryText} text-sm mt-2 line-clamp-2`}>
                    {website.description}
                  </p>
                )}
              </div>

              {!isLoggedIn && (
                <ExternalLink 
                  size={16} 
                  className={`${themeClasses.muted} group-hover:${themeClasses.accent} transition-colors flex-shrink-0 ml-2`} 
                />
              )}
            </div>

            {isLoggedIn && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick(website)
                  }}
                  className={`${themeClasses.button} text-xs`}
                >
                  <ExternalLink size={12} />
                  访问
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  className={`${themeClasses.editButton} text-xs`}
                >
                  <Edit2 size={12} />
                  编辑
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleRecommended()
                  }}
                  className={`text-xs ${website.is_recommended ? themeClasses.toggleButton : themeClasses.button}`}
                >
                  <Star size={12} fill={website.is_recommended ? "currentColor" : "none"} />
                  {website.is_recommended ? "取消推荐" : "推荐"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className={`${themeClasses.deleteButton} text-xs`}
                  disabled={isDeleting}
                >
                  <Trash2 size={12} />
                  {isDeleting ? "删除中..." : "删除"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 