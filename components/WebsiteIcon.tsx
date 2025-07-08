"use client"

import React, { useState, useEffect } from "react"
import { Globe, RefreshCw } from "lucide-react"
import type { Website, Theme } from "@/types"
import { getFaviconUrl } from "@/lib/websiteUtils"
import { IconCacheManager, iconOptions } from "@/lib/iconCache"

interface WebsiteIconProps {
  website: Website
  size?: string
  theme: Theme
}

export function WebsiteIcon({ website, size = "h-6 w-6", theme }: WebsiteIconProps) {
  // 调试：打印接收到的数据
  console.log("🔍 WebsiteIcon 接收到的数据:", {
    id: website.id,
    name: website.name,
    icon_type: website.icon_type,
    icon_value_length: website.icon_value?.length || 0,
    icon_value_start: website.icon_value?.substring(0, 50),
    完整website对象: website
  })
  
  const [imageError, setImageError] = useState(false)
  const [currentFaviconIndex, setCurrentFaviconIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTimeout, setIsTimeout] = useState(false)
  const [cachedImageUrl, setCachedImageUrl] = useState<string | null>(null)

  // 重置状态当网站改变时
  useEffect(() => {
    setImageError(false)
    setCurrentFaviconIndex(0)
    setIsLoading(true)
    setIsTimeout(false)
    setCachedImageUrl(null)

    // 检查缓存
    if (website.icon_type === "favicon") {
      const cached = IconCacheManager.getCachedIcon(website.icon_value)
      if (cached) {
        setCachedImageUrl(cached)
        setIsLoading(false)
        return
      }
    }
  }, [website.icon_value, website.icon_type])

  // 设置超时处理
  useEffect(() => {
    if (website.icon_type === "favicon" && isLoading && !imageError && !cachedImageUrl) {
      const timeoutId = setTimeout(() => {
        setIsTimeout(true)
        setIsLoading(false)
        setImageError(true)
      }, 8000) // 8秒超时

      return () => clearTimeout(timeoutId)
    }
  }, [website.icon_type, isLoading, imageError, currentFaviconIndex, cachedImageUrl])

  // Lucide图标类型
  if (website.icon_type === "lucide") {
    const LucideIcon = iconOptions.find((opt) => opt.name === website.icon_value)?.icon || Globe
    return <LucideIcon className={`${size} ${theme === "dark" ? "text-stone-200" : "text-white"}`} />
  }

  // 自定义图标类型
  if (website.icon_type === "custom") {
    console.log("=== WebsiteIcon 自定义图标调试 ===")
    console.log("网站名称:", website.name)
    console.log("图标类型:", website.icon_type)
    console.log("图标数据长度:", website.icon_value?.length || 0)
    console.log("图标数据开头:", website.icon_value?.substring(0, 100))
    console.log("是否为base64:", website.icon_value?.startsWith('data:image/'))
    console.log("=== WebsiteIcon 调试结束 ===")
    
    return (
      <div className="relative">
        <img
          src={website.icon_value || "/placeholder.svg"}
          alt={website.name}
          className={`${size} rounded object-cover transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
          onLoad={() => {
            console.log("✅ 自定义图标加载成功:", website.name)
            setIsLoading(false)
            setImageError(false)
          }}
          onError={(e) => {
            console.log("❌ 自定义图标加载失败:", website.name)
            console.log("错误事件:", e)
            console.log("图片src:", website.icon_value?.substring(0, 100))
            setImageError(true)
            setIsLoading(false)
          }}
          style={{ display: imageError ? "none" : "block" }}
        />
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center ${size}`}>
            <RefreshCw className={`h-3 w-3 animate-spin ${theme === "dark" ? "text-stone-400" : "text-gray-400"}`} />
          </div>
        )}
        {imageError && (
          <div className={`${size} flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700`}>
            <Globe className={`h-3 w-3 ${theme === "dark" ? "text-stone-400" : "text-gray-400"}`} />
          </div>
        )}
      </div>
    )
  }

  // Favicon图标类型
  if (website.icon_type === "favicon") {
    // 如果有缓存的图片，直接使用
    if (cachedImageUrl) {
      return (
        <img
          src={cachedImageUrl || "/placeholder.svg"}
          alt={website.name}
          className={`${size} rounded object-cover`}
          title="已缓存的图标"
        />
      )
    }

    const faviconUrls = getFaviconUrl(website.icon_value)
    const currentUrl = faviconUrls[currentFaviconIndex]

    const handleImageError = () => {
      if (currentFaviconIndex < faviconUrls.length - 1 && !isTimeout) {
        // 尝试下一个favicon URL
        setCurrentFaviconIndex((prev) => prev + 1)
        setIsLoading(true)
      } else {
        // 所有URL都失败了或者超时了
        setImageError(true)
        setIsLoading(false)
      }
    }

    const handleImageLoad = async (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false)
      setImageError(false)
      setIsTimeout(false)

      // 缓存成功加载的图标
      try {
        const img = event.target as HTMLImageElement
        const cachedUrl = await IconCacheManager.cacheIcon(website.icon_value, img.src)
        if (cachedUrl) {
          setCachedImageUrl(cachedUrl)
        }
      } catch (error) {
        console.log("缓存图标失败:", error)
      }
    }

    if (imageError || isTimeout || !currentUrl) {
      // 显示默认图标，带有超时提示
      return (
        <div
          className={`${size} flex items-center justify-center rounded ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100"}`}
          title={isTimeout ? "图标加载超时，使用默认图标" : "无法加载图标，使用默认图标"}
        >
          <Globe className={`h-3 w-3 ${theme === "dark" ? "text-stone-400" : "text-gray-500"}`} />
        </div>
      )
    }

    return (
      <div className="relative">
        <img
          src={currentUrl || "/placeholder.svg"}
          alt={website.name}
          className={`${size} rounded object-cover transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
          loading="lazy"
        />
        {isLoading && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${size} rounded ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100/50"}`}
          >
            <RefreshCw className={`h-3 w-3 animate-spin ${theme === "dark" ? "text-stone-400" : "text-gray-400"}`} />
          </div>
        )}
      </div>
    )
  }

  // 默认图标
  return (
    <div
      className={`${size} flex items-center justify-center rounded ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100"}`}
    >
      <Globe className={`h-3 w-3 ${theme === "dark" ? "text-stone-400" : "text-gray-500"}`} />
    </div>
  )
} 