"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  ExternalLink,
  Star,
  Globe,
  Code,
  Palette,
  Database,
  Shield,
  Zap,
  BookOpen,
  Monitor,
  Camera,
  Music,
  Video,
  ShoppingCart,
  Gamepad2,
  Briefcase,
  Edit3,
  Save,
  X,
  Settings,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  Plus,
  Trash2,
  Users,
  FolderPlus,
  HardDrive,
  Heart,
  HeartOff,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// 图标缓存管理类
class IconCacheManager {
  private static readonly CACHE_PREFIX = "nav_icon_cache_"
  private static readonly CACHE_INFO_KEY = "nav_icon_cache_info"
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB
  private static readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7天

  // 生成缓存键
  static getCacheKey(url: string): string {
    return this.CACHE_PREFIX + btoa(url).replace(/[^a-zA-Z0-9]/g, "")
  }

  // 获取缓存信息
  static getCacheInfo(): { size: number; count: number; lastCleanup: number } {
    try {
      const info = localStorage.getItem(this.CACHE_INFO_KEY)
      return info ? JSON.parse(info) : { size: 0, count: 0, lastCleanup: Date.now() }
    } catch {
      return { size: 0, count: 0, lastCleanup: Date.now() }
    }
  }

  // 更新缓存信息
  static updateCacheInfo(sizeDelta: number, countDelta: number) {
    const info = this.getCacheInfo()
    info.size += sizeDelta
    info.count += countDelta
    localStorage.setItem(this.CACHE_INFO_KEY, JSON.stringify(info))
  }

  // 获取缓存的图标
  static getCachedIcon(url: string): string | null {
    try {
      const cacheKey = this.getCacheKey(url)
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const data = JSON.parse(cached)
      const now = Date.now()

      // 检查是否过期
      if (now - data.timestamp > this.CACHE_DURATION) {
        this.removeCachedIcon(url)
        return null
      }

      return data.dataUrl
    } catch {
      return null
    }
  }

  // 缓存图标
  static async cacheIcon(url: string, imageUrl: string): Promise<string | null> {
    try {
      // 检查缓存大小
      const info = this.getCacheInfo()
      if (info.size > this.MAX_CACHE_SIZE) {
        this.cleanupCache()
      }

      // 获取图片数据
      const response = await fetch(imageUrl, { mode: "cors" })
      if (!response.ok) return null

      const blob = await response.blob()
      const dataUrl = await this.blobToDataUrl(blob)

      // 存储到缓存
      const cacheKey = this.getCacheKey(url)
      const cacheData = {
        dataUrl,
        timestamp: Date.now(),
        size: dataUrl.length,
      }

      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      this.updateCacheInfo(dataUrl.length, 1)

      return dataUrl
    } catch {
      return null
    }
  }

  // 删除缓存的图标
  static removeCachedIcon(url: string) {
    try {
      const cacheKey = this.getCacheKey(url)
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const data = JSON.parse(cached)
        localStorage.removeItem(cacheKey)
        this.updateCacheInfo(-data.size, -1)
      }
    } catch {
      // 忽略错误
    }
  }

  // 清理过期缓存
  static cleanupCache() {
    try {
      const now = Date.now()
      let totalSizeRemoved = 0
      let totalCountRemoved = 0

      // 遍历所有localStorage项
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.CACHE_PREFIX)) {
          try {
            const cached = localStorage.getItem(key)
            if (cached) {
              const data = JSON.parse(cached)
              if (now - data.timestamp > this.CACHE_DURATION) {
                localStorage.removeItem(key)
                totalSizeRemoved += data.size || 0
                totalCountRemoved += 1
              }
            }
          } catch {
            // 删除损坏的缓存项
            localStorage.removeItem(key)
            totalCountRemoved += 1
          }
        }
      }

      // 更新缓存信息
      if (totalSizeRemoved > 0 || totalCountRemoved > 0) {
        this.updateCacheInfo(-totalSizeRemoved, -totalCountRemoved)
      }

      // 更新最后清理时间
      const info = this.getCacheInfo()
      info.lastCleanup = now
      localStorage.setItem(this.CACHE_INFO_KEY, JSON.stringify(info))
    } catch {
      // 忽略错误
    }
  }

  // 清空所有缓存
  static clearAllCache() {
    try {
      // 删除所有图标缓存
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      }

      // 重置缓存信息
      localStorage.setItem(this.CACHE_INFO_KEY, JSON.stringify({ size: 0, count: 0, lastCleanup: Date.now() }))
    } catch {
      // 忽略错误
    }
  }

  // 获取缓存统计
  static getCacheStats(): { size: string; count: number; lastCleanup: string } {
    const info = this.getCacheInfo()
    return {
      size: this.formatBytes(info.size),
      count: info.count,
      lastCleanup: new Date(info.lastCleanup).toLocaleString(),
    }
  }

  // 格式化字节大小
  static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Blob转DataURL
  static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

// 可选图标列表
const iconOptions = [
  { name: "Code", icon: Code },
  { name: "Palette", icon: Palette },
  { name: "Database", icon: Database },
  { name: "Shield", icon: Shield },
  { name: "Zap", icon: Zap },
  { name: "BookOpen", icon: BookOpen },
  { name: "Monitor", icon: Monitor },
  { name: "Camera", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Video", icon: Video },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Briefcase", icon: Briefcase },
  { name: "Globe", icon: Globe },
]

// 图标类型
type IconType = "lucide" | "favicon" | "custom"

// 主题类型
type Theme = "light" | "dark"

// 页面模式
type PageMode = "user" | "admin"

// 网站数据类型
interface Website {
  id: number
  name: string
  url: string
  category: string
  description: string
  icon_type: IconType
  icon_value: string
  clicks: number
  is_recommended: boolean
  created_at: string
  updated_at: string
}

// 分类数据类型
interface Category {
  id: number
  name: string
  created_at: string
  updated_at: string
}

// 获取favicon的多种方式
const getFaviconUrl = (websiteUrl: string): string[] => {
  try {
    const url = new URL(websiteUrl)
    const domain = url.hostname

    return [
      // Google favicon服务 - 最可靠
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      // Favicon.io 服务
      `https://favicons.githubusercontent.com/${domain}`,
      // DuckDuckGo图标服务
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      // Yandex favicon服务
      `https://favicon.yandex.net/favicon/${domain}`,
      // 网站根目录的favicon
      `${url.origin}/favicon.ico`,
      `${url.origin}/favicon.png`,
      // Apple touch图标
      `${url.origin}/apple-touch-icon.png`,
      `${url.origin}/apple-touch-icon-precomposed.png`,
      // 其他常见路径
      `${url.origin}/assets/favicon.ico`,
      `${url.origin}/static/favicon.ico`,
      `${url.origin}/images/favicon.ico`,
    ]
  } catch {
    return []
  }
}

// 网站图标组件
function WebsiteIcon({ website, size = "h-6 w-6", theme }: { website: Website; size?: string; theme: Theme }) {
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

  if (website.icon_type === "lucide") {
    const LucideIcon = iconOptions.find((opt) => opt.name === website.icon_value)?.icon || Globe
    return <LucideIcon className={`${size} ${theme === "dark" ? "text-stone-200" : "text-white"}`} />
  }

  if (website.icon_type === "custom") {
    return (
      <div className="relative">
        <img
          src={website.icon_value || "/placeholder.svg"}
          alt={website.name}
          className={`${size} rounded object-cover transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
          onLoad={() => {
            setIsLoading(false)
            setImageError(false)
          }}
          onError={() => {
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

  return (
    <div
      className={`${size} flex items-center justify-center rounded ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100"}`}
    >
      <Globe className={`h-3 w-3 ${theme === "dark" ? "text-stone-400" : "text-gray-500"}`} />
    </div>
  )
}

export default function NavigationSite() {
  const [theme, setTheme] = useState<Theme>("light")
  const [pageMode, setPageMode] = useState<PageMode>("user")
  const [websites, setWebsites] = useState<Website[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendedWebsites, setRecommendedWebsites] = useState<Website[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [editMode, setEditMode] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    category: "",
    description: "",
    iconType: "favicon" as IconType,
    iconValue: "",
    isRecommended: false,
  })
  const [isLoadingFavicon, setIsLoadingFavicon] = useState(false)

  // 管理后台状态
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [selectedWebsites, setSelectedWebsites] = useState<number[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // 管理员权限状态
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loginError, setLoginError] = useState("")

  // 缓存管理状态
  const [showCacheDialog, setShowCacheDialog] = useState(false)
  const [cacheStats, setCacheStats] = useState(IconCacheManager.getCacheStats())

  // 加载状态
  const [isLoading, setIsLoading] = useState(true)

  // 从localStorage加载主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // 检查管理员登录状态
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    if (adminStatus === "true") {
      setIsAdmin(true)
    }
  }, [])

  // 加载数据
  useEffect(() => {
    loadData()
  }, [])

  // 定期清理过期缓存
  useEffect(() => {
    const cleanup = () => {
      const info = IconCacheManager.getCacheInfo()
      const now = Date.now()
      // 每24小时清理一次
      if (now - info.lastCleanup > 24 * 60 * 60 * 1000) {
        IconCacheManager.cleanupCache()
        setCacheStats(IconCacheManager.getCacheStats())
      }
    }

    cleanup()
    const interval = setInterval(cleanup, 60 * 60 * 1000) // 每小时检查一次
    return () => clearInterval(interval)
  }, [])

  // 加载数据函数
  const loadData = async () => {
    try {
      setIsLoading(true)
      const [websitesRes, categoriesRes, recommendedRes] = await Promise.all([
        fetch("/api/websites"),
        fetch("/api/categories"),
        fetch("/api/websites/recommended"),
      ])

      if (websitesRes.ok) {
        const websitesData = await websitesRes.json()
        setWebsites(websitesData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (recommendedRes.ok) {
        const recommendedData = await recommendedRes.json()
        setRecommendedWebsites(recommendedData)
      }
    } catch (error) {
      console.error("加载数据失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 细粒度数据更新函数
  const updateWebsiteInState = (updatedWebsite: Website) => {
    setWebsites(prev => prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w))
    // 更新推荐列表
    if (updatedWebsite.is_recommended) {
      setRecommendedWebsites(prev => {
        const exists = prev.find(w => w.id === updatedWebsite.id)
        if (exists) {
          return prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w)
        } else {
          return [...prev, updatedWebsite]
        }
      })
    } else {
      setRecommendedWebsites(prev => prev.filter(w => w.id !== updatedWebsite.id))
    }
  }

  const addWebsiteToState = (newWebsite: Website) => {
    setWebsites(prev => [...prev, newWebsite])
    if (newWebsite.is_recommended) {
      setRecommendedWebsites(prev => [...prev, newWebsite])
    }
  }

  const removeWebsiteFromState = (websiteId: number) => {
    setWebsites(prev => prev.filter(w => w.id !== websiteId))
    setRecommendedWebsites(prev => prev.filter(w => w.id !== websiteId))
  }

  const updateCategoryInState = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c))
  }

  const addCategoryToState = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory])
  }

  const removeCategoryFromState = (categoryId: number) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId))
  }

  // 保存主题设置到localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const allCategories = ["全部", ...categories.map((c) => c.name)]

  const filteredWebsites = useMemo(() => {
    return websites.filter((website) => {
      const matchesSearch =
        website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "全部" || website.category === selectedCategory
      // 在显示"所有网站"时，如果有搜索条件和分类筛选都是默认状态，则不显示推荐网站，避免重复
      const isNotRecommendedDuplicate = !(searchTerm === "" && selectedCategory === "全部" && website.is_recommended)
      return matchesSearch && matchesCategory && isNotRecommendedDuplicate
    })
  }, [websites, searchTerm, selectedCategory])

  const handleWebsiteClick = async (website: Website) => {
    if (editMode) {
      startEditing(website)
    } else {
      // 增加点击数
      try {
        const response = await fetch(`/api/websites/${website.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "click" }),
        })
        
        if (response.ok) {
          const updatedWebsite = await response.json()
          updateWebsiteInState(updatedWebsite)
        }
      } catch (error) {
        console.error("更新点击数失败:", error)
      }
      window.open(website.url, "_blank")
    }
  }

  const startEditing = (website: Website) => {
    setEditingWebsite(website)
    setEditForm({
      name: website.name,
      url: website.url,
      category: website.category,
      description: website.description,
      iconType: website.icon_type,
      iconValue: website.icon_value,
      isRecommended: website.is_recommended,
    })
  }

  // 自动获取网站信息
  const handleAutoFetchWebsiteInfo = async () => {
    if (!editForm.url) return

    setIsLoadingFavicon(true)
    try {
      const url = new URL(editForm.url)
      const domain = url.hostname

      // 尝试获取网站标题（使用公共API）
      let title = editForm.name
      try {
        // 使用 allorigins.win 作为代理来获取网站信息，设置超时
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(editForm.url)}`
        const response = await fetch(proxyUrl, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data.contents) {
            // 解析HTML获取title
            const parser = new DOMParser()
            const doc = parser.parseFromString(data.contents, "text/html")
            const titleElement = doc.querySelector("title")
            if (titleElement && titleElement.textContent) {
              title = titleElement.textContent.trim()
            }
          }
        }
      } catch (error) {
        console.log("获取网站标题超时或失败，使用域名作为标题")
        // 如果无法获取标题，使用域名作为标题
        title = domain.replace("www.", "").split(".")[0]
        title = title.charAt(0).toUpperCase() + title.slice(1)
      }

      // 自动设置获取到的信息
      setEditForm((prev) => ({
        ...prev,
        name: prev.name || title,
        iconType: "favicon",
        iconValue: editForm.url,
      }))
    } catch (error) {
      console.error("Failed to fetch website info:", error)
      // 如果URL无效，至少尝试设置favicon
      setEditForm((prev) => ({
        ...prev,
        iconType: "favicon",
        iconValue: prev.url,
      }))
    } finally {
      setIsLoadingFavicon(false)
    }
  }

  const handleAutoDetectFavicon = async () => {
    if (!editForm.url) return

    setIsLoadingFavicon(true)
    try {
      // 自动设置为favicon模式并使用网站URL
      setEditForm((prev) => ({
        ...prev,
        iconType: "favicon",
        iconValue: prev.url,
      }))
    } catch (error) {
      console.error("Failed to detect favicon:", error)
    } finally {
      setIsLoadingFavicon(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setEditForm((prev) => ({
          ...prev,
          iconType: "custom",
          iconValue: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const saveEdit = async () => {
    if (!editingWebsite) return

    try {
      const response = await fetch(`/api/websites/${editingWebsite.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          url: editForm.url,
          category: editForm.category,
          description: editForm.description,
          iconType: editForm.iconType,
          iconValue: editForm.iconValue,
          isRecommended: editForm.isRecommended,
        }),
      })

      if (response.ok) {
        const updatedWebsite = await response.json()
        updateWebsiteInState(updatedWebsite)
        setEditingWebsite(null)
      }
    } catch (error) {
      console.error("保存网站失败:", error)
    }
  }

  const cancelEdit = () => {
    setEditingWebsite(null)
    setEditForm({
      name: "",
      url: "",
      category: "",
      description: "",
      iconType: "favicon",
      iconValue: "",
      isRecommended: false,
    })
  }

  // 管理后台功能
  const addWebsite = async () => {
    if (!editForm.name || !editForm.url || !editForm.category) return

    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          url: editForm.url,
          category: editForm.category,
          description: editForm.description,
          iconType: editForm.iconType,
          iconValue: editForm.iconValue,
          isRecommended: editForm.isRecommended,
        }),
      })

      if (response.ok) {
        const newWebsite = await response.json()
        addWebsiteToState(newWebsite)
        setEditForm({
          name: "",
          url: "",
          category: "",
          description: "",
          iconType: "favicon",
          iconValue: "",
          isRecommended: false,
        })
        setShowAddWebsite(false)
      }
    } catch (error) {
      console.error("添加网站失败:", error)
    }
  }

  const deleteWebsite = async (id: number) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        removeWebsiteFromState(id)
        // 可以在这里添加成功提示
        console.log("删除成功:", result.message)
      } else {
        console.error("删除网站失败:", result.error)
        // 可以在这里添加错误提示
      }
    } catch (error) {
      console.error("删除网站失败:", error)
    }
  }

  const deleteSelectedWebsites = async () => {
    try {
      await Promise.all(selectedWebsites.map((id) => fetch(`/api/websites/${id}`, { method: "DELETE" })))
      // 从状态中移除所有选中的网站
      selectedWebsites.forEach(id => removeWebsiteFromState(id))
      setSelectedWebsites([])
    } catch (error) {
      console.error("批量删除网站失败:", error)
    }
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      })

      if (response.ok) {
        const newCategoryData = await response.json()
        addCategoryToState(newCategoryData)
        setNewCategory("")
        setShowAddCategory(false)
      }
    } catch (error) {
      console.error("添加分类失败:", error)
    }
  }

  const deleteCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        removeCategoryFromState(category.id)
        // 如果删除的是当前选中的分类，切换到"全部"
        if (selectedCategory === category.name) {
          setSelectedCategory("全部")
        }
      }
    } catch (error) {
      console.error("删除分类失败:", error)
    }
  }

  const updateCategory = async (category: Category, newName: string) => {
    if (!newName.trim()) return

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        updateCategoryInState(updatedCategory)
        // 如果当前选中的是被修改的分类，更新选中状态
        if (selectedCategory === category.name) {
          setSelectedCategory(newName.trim())
        }
        setEditingCategory(null)
      }
    } catch (error) {
      console.error("更新分类失败:", error)
    }
  }

  // 切换推荐状态
  const toggleRecommended = async (website: Website) => {
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-recommend" }),
      })

      if (response.ok) {
        const updatedWebsite = await response.json()
        updateWebsiteInState(updatedWebsite)
      }
    } catch (error) {
      console.error("切换推荐状态失败:", error)
    }
  }

  // 管理员登录
  const handleAdminLogin = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAdmin(true)
        localStorage.setItem("isAdmin", "true")
        setShowLoginDialog(false)
        setLoginForm({ username: "", password: "" })
        setLoginError("")
      } else {
        setLoginError(data.error || "登录失败")
      }
    } catch (error) {
      console.error("登录失败:", error)
      setLoginError("登录失败")
    }
  }

  // 管理员登出
  const handleAdminLogout = () => {
    setIsAdmin(false)
    setPageMode("user")
    setEditMode(false)
    localStorage.removeItem("isAdmin")
  }

  // 缓存管理
  const handleClearCache = () => {
    IconCacheManager.clearAllCache()
    setCacheStats(IconCacheManager.getCacheStats())
  }

  const handleCleanupCache = () => {
    IconCacheManager.cleanupCache()
    setCacheStats(IconCacheManager.getCacheStats())
  }

  const refreshCacheStats = () => {
    setCacheStats(IconCacheManager.getCacheStats())
  }

  // 主题相关的样式类
  const themeClasses = {
    background:
      theme === "dark"
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        : "bg-gradient-to-br from-rose-200 via-blue-200 to-amber-100",
    text: theme === "dark" ? "text-stone-200" : "text-slate-700",
    textSecondary: theme === "dark" ? "text-stone-300" : "text-slate-600",
    textMuted: theme === "dark" ? "text-stone-400" : "text-slate-500",
    textPlaceholder: theme === "dark" ? "placeholder:text-stone-400" : "placeholder:text-slate-500",
    glass:
      theme === "dark"
        ? "backdrop-blur-md bg-slate-800/20 border-slate-600/30"
        : "backdrop-blur-md bg-white/30 border-slate-300/20",
    glassHover: theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-white/40",
    card:
      theme === "dark"
        ? "backdrop-blur-md bg-slate-800/20 border-slate-600/30"
        : "backdrop-blur-md bg-white/25 border-slate-300/20",
    cardHover: theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-white/35",
    input:
      theme === "dark"
        ? "bg-slate-800/30 border-slate-600/40 text-stone-200"
        : "bg-white/40 border-slate-300/30 text-slate-700",
    button:
      theme === "dark"
        ? "text-stone-200 hover:bg-slate-700/30 border-slate-600/40"
        : "text-slate-600 hover:bg-white/30 border-slate-300/30",
    buttonActive:
      theme === "dark"
        ? "bg-stone-200 text-slate-800 hover:bg-stone-100"
        : "bg-slate-600 text-white hover:bg-slate-700",
    badge:
      theme === "dark"
        ? "bg-slate-700/40 text-stone-300 border-slate-600/40"
        : "bg-white/30 text-slate-600 border-slate-300/30",
    iconBg: theme === "dark" ? "bg-slate-700/40 group-hover:bg-slate-600/50" : "bg-white/30 group-hover:bg-white/40",
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className={`h-8 w-8 animate-spin ${themeClasses.text} mx-auto mb-4`} />
          <p className={themeClasses.text}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} pb-20`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

      <div className="relative z-10">
        {/* 头部导航 */}
        <header className={`${themeClasses.glass} border-b sticky top-0 z-50`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className={`h-7 w-7 ${themeClasses.text}`} />
                <h1 className={`text-xl font-bold ${themeClasses.text}`}>
                  导航站 {pageMode === "admin" && "- 管理后台"}
                </h1>
              </div>

              {pageMode === "user" && (
                <div className="flex-1 max-w-md mx-6">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} h-4 w-4`}
                    />
                    <Input
                      placeholder="搜索网站或描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${themeClasses.input} ${themeClasses.textPlaceholder} backdrop-blur-sm h-9`}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`${themeClasses.button} transition-all duration-200`}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      refreshCacheStats()
                      setShowCacheDialog(true)
                    }}
                    className={`${themeClasses.button} transition-all duration-200`}
                    title="缓存管理"
                  >
                    <HardDrive className="h-4 w-4" />
                  </Button>
                )}

                {isAdmin ? (
                  <>
                    <Button
                      variant={pageMode === "admin" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPageMode(pageMode === "admin" ? "user" : "admin")}
                      className={`${
                        pageMode === "admin" ? themeClasses.buttonActive : themeClasses.button
                      } transition-all duration-200`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {pageMode === "admin" ? "用户模式" : "管理后台"}
                    </Button>

                    {pageMode === "user" && (
                      <Button
                        variant={editMode ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                        className={`${
                          editMode ? themeClasses.buttonActive : themeClasses.button
                        } transition-all duration-200`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {editMode ? "完成编辑" : "编辑模式"}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAdminLogout}
                      className={`${themeClasses.button} transition-all duration-200`}
                    >
                      <X className="h-4 w-4 mr-2" />
                      退出管理
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLoginDialog(true)}
                    className={`${themeClasses.button} transition-all duration-200`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    管理员登录
                  </Button>
                )}

                {pageMode === "user" && (
                  <div className={`${themeClasses.textSecondary} text-sm`}>共 {websites.length} 个网站</div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {pageMode === "user" ? (
            // 用户模式界面
            <>
              {/* 编辑提示 */}
              {editMode && (
                <div
                  className={`mb-4 p-3 ${theme === "dark" ? "backdrop-blur-md bg-amber-900/20 border border-amber-700/30" : "backdrop-blur-md bg-rose-100/40 border border-rose-300/30"} rounded-lg`}
                >
                  <p className={`${themeClasses.text} text-sm flex items-center`}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    编辑模式已开启，点击任意网站卡片进行编辑
                  </p>
                </div>
              )}

              {/* 分类筛选 */}
              <section className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      className={`${
                        selectedCategory === category ? themeClasses.buttonActive : themeClasses.button
                      } transition-all duration-200 h-8 px-3 text-sm`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                      <Badge variant="secondary" className={`ml-2 ${themeClasses.badge} text-xs px-1.5 py-0`}>
                        {category === "全部" ? websites.length : websites.filter((w) => w.category === category).length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </section>

              {/* 站长推荐 */}
              {searchTerm === "" && selectedCategory === "全部" && recommendedWebsites.length > 0 && (
                <section className="mb-8">
                  <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <Star className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-amber-400" : "text-rose-400"}`} />
                    站长推荐
                    <span className={`${themeClasses.textMuted} text-sm ml-2 font-normal`}>精选优质网站</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendedWebsites.map((website) => (
                      <Card
                        key={website.id}
                        className={`${themeClasses.card} ${themeClasses.cardHover} transition-all duration-200 group cursor-pointer relative ${
                          editMode ? (theme === "dark" ? "ring-2 ring-amber-500/50" : "ring-2 ring-rose-400/50") : ""
                        }`}
                        onClick={() => handleWebsiteClick(website)}
                      >
                        <CardContent className="p-4 relative">
                          {/* 推荐标识 */}
                          <div className="absolute top-2 left-2">
                            <Star
                              className={`h-3 w-3 ${theme === "dark" ? "text-amber-400" : "text-rose-400"} fill-current`}
                            />
                          </div>

                          {editMode && (
                            <div className="absolute top-2 right-2">
                              <Edit3 className={`h-4 w-4 ${themeClasses.textMuted}`} />
                            </div>
                          )}
                          <div className="flex items-start space-x-3 mt-2">
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg} transition-colors flex-shrink-0`}>
                              <WebsiteIcon website={website} size="h-6 w-6" theme={theme} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`${themeClasses.text} font-medium text-sm truncate mb-1`}>
                                {website.name}
                              </h3>
                              <p className={`${themeClasses.textMuted} text-xs line-clamp-2 mb-2`}>
                                {website.description}
                              </p>
                              <div className="flex items-center">
                                <span className={`${themeClasses.textMuted} text-xs`}>{website.clicks}</span>
                                <ExternalLink className={`h-3 w-3 ${themeClasses.textMuted} ml-1`} />
                              </div>
                            </div>
                          </div>
                          {!editMode && (
                            <ExternalLink
                              className={`absolute top-2 right-2 h-3 w-3 ${themeClasses.textMuted} opacity-0 group-hover:opacity-100 transition-opacity`}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* 网站列表 */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${themeClasses.text}`}>
                    {selectedCategory === "全部" ? "所有网站" : selectedCategory}
                    <span className={`${themeClasses.textMuted} text-sm ml-2 font-normal`}>
                      ({filteredWebsites.length})
                    </span>
                  </h2>
                </div>

                {filteredWebsites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`${themeClasses.card} border rounded-lg p-8 max-w-md mx-auto`}>
                      <Search className={`h-12 w-12 ${themeClasses.textMuted} mx-auto mb-4`} />
                      <p className={`${themeClasses.textSecondary} text-lg`}>未找到相关网站</p>
                      <p className={`${themeClasses.textMuted} text-sm mt-2`}>尝试调整搜索关键词或选择其他分类</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredWebsites.map((website) => (
                      <Card
                        key={website.id}
                        className={`${themeClasses.card} ${themeClasses.cardHover} transition-all duration-200 group cursor-pointer relative ${
                          editMode ? (theme === "dark" ? "ring-2 ring-amber-500/50" : "ring-2 ring-rose-400/50") : ""
                        }`}
                        onClick={() => handleWebsiteClick(website)}
                      >
                        <CardContent className="p-4">
                          {/* 推荐标识 */}
                          {Boolean(website.is_recommended) && (
                            <div className="absolute top-2 left-2">
                              <Star
                                className={`h-3 w-3 ${theme === "dark" ? "text-amber-400" : "text-rose-400"} fill-current`}
                              />
                            </div>
                          )}

                          {editMode && (
                            <div className="absolute top-2 right-2">
                              <Edit3 className={`h-4 w-4 ${themeClasses.textMuted}`} />
                            </div>
                          )}
                          <div className={`flex items-start space-x-3 ${website.is_recommended ? "mt-2" : ""}`}>
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg} transition-colors flex-shrink-0`}>
                              <WebsiteIcon website={website} size="h-5 w-5" theme={theme} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`${themeClasses.text} font-medium text-sm truncate mb-1`}
                                title={website.name}
                              >
                                {website.name}
                              </h3>
                              <p
                                className={`${themeClasses.textMuted} text-xs line-clamp-2`}
                                title={website.description}
                              >
                                {website.description}
                              </p>
                            </div>
                          </div>
                          {!editMode && (
                            <ExternalLink
                              className={`absolute top-2 right-2 h-3 w-3 ${themeClasses.textMuted} opacity-0 group-hover:opacity-100 transition-opacity`}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            // 管理后台界面
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>管理后台</h2>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowAddWebsite(true)} className={`${themeClasses.buttonActive}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加网站
                  </Button>
                  <Button
                    onClick={() => setShowAddCategory(true)}
                    variant="outline"
                    className={`${themeClasses.button}`}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    添加分类
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="websites" className="space-y-4">
                <TabsList className={`${themeClasses.glass}`}>
                  <TabsTrigger value="websites" className={themeClasses.text}>
                    网站管理
                  </TabsTrigger>
                  <TabsTrigger value="categories" className={themeClasses.text}>
                    分类管理
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className={themeClasses.text}>
                    推荐管理
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="websites" className="space-y-4">
                  {/* 批量操作 */}
                  {selectedWebsites.length > 0 && (
                    <div className={`${themeClasses.card} p-4 rounded-lg`}>
                      <div className="flex items-center justify-between">
                        <span className={themeClasses.text}>已选择 {selectedWebsites.length} 个网站</span>
                        <Button onClick={deleteSelectedWebsites} variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          批量删除
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 网站列表 */}
                  <div className="grid gap-4">
                    {websites.map((website) => (
                      <Card key={website.id} className={`${themeClasses.card}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              checked={selectedWebsites.includes(website.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedWebsites((prev) => [...prev, website.id])
                                } else {
                                  setSelectedWebsites((prev) => prev.filter((id) => id !== website.id))
                                }
                              }}
                            />
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg}`}>
                              <WebsiteIcon website={website} size="h-6 w-6" theme={theme} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className={`${themeClasses.text} font-medium`}>{website.name}</h3>
                                {Boolean(website.is_recommended) && (
                                  <Star
                                    className={`h-4 w-4 ${theme === "dark" ? "text-amber-400" : "text-rose-400"} fill-current`}
                                  />
                                )}
                              </div>
                              <p className={`${themeClasses.textMuted} text-sm`}>{website.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className={`${themeClasses.textMuted} text-xs`}>分类: {website.category}</span>
                                <span className={`${themeClasses.textMuted} text-xs`}>点击: {website.clicks}</span>
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${themeClasses.textMuted} text-xs hover:underline`}
                                >
                                  {website.url}
                                </a>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => toggleRecommended(website)}
                                variant="outline"
                                size="sm"
                                className={`${themeClasses.button} ${website.is_recommended ? "text-amber-500" : ""}`}
                                title={website.is_recommended ? "取消推荐" : "设为推荐"}
                              >
                                {website.is_recommended ? (
                                  <Heart className="h-4 w-4 fill-current" />
                                ) : (
                                  <HeartOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                onClick={() => startEditing(website)}
                                variant="outline"
                                size="sm"
                                className={themeClasses.button}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => deleteWebsite(website.id)} variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <div className="grid gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className={`${themeClasses.card}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`${themeClasses.text} font-medium`}>
                                {editingCategory?.id === category.id ? (
                                  <Input
                                    defaultValue={category.name}
                                    onBlur={(e) => updateCategory(category, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        updateCategory(category, e.currentTarget.value)
                                      }
                                      if (e.key === "Escape") {
                                        setEditingCategory(null)
                                      }
                                    }}
                                    className={`${themeClasses.input} w-48`}
                                    autoFocus
                                  />
                                ) : (
                                  <span>{category.name}</span>
                                )}
                              </div>
                              <Badge variant="secondary" className={themeClasses.badge}>
                                {websites.filter((w) => w.category === category.name).length} 个网站
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => setEditingCategory(category)}
                                variant="outline"
                                size="sm"
                                className={themeClasses.button}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => deleteCategory(category)} variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div className="mb-4">
                    <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>推荐网站管理</h3>
                    <p className={`${themeClasses.textMuted} text-sm`}>
                      当前有 {recommendedWebsites.length} 个推荐网站，推荐的网站会在首页"站长推荐"区域显示
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {websites.map((website) => (
                      <Card
                        key={website.id}
                        className={`${themeClasses.card} ${website.is_recommended ? "ring-2 ring-amber-500/30" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg}`}>
                              <WebsiteIcon website={website} size="h-6 w-6" theme={theme} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className={`${themeClasses.text} font-medium`}>{website.name}</h3>
                                {Boolean(website.is_recommended) && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                  >
                                    推荐中
                                  </Badge>
                                )}
                              </div>
                              <p className={`${themeClasses.textMuted} text-sm`}>{website.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className={`${themeClasses.textMuted} text-xs`}>分类: {website.category}</span>
                                <span className={`${themeClasses.textMuted} text-xs`}>点击: {website.clicks}</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => toggleRecommended(website)}
                              variant={website.is_recommended ? "default" : "outline"}
                              size="sm"
                              className={
                                website.is_recommended
                                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                                  : themeClasses.button
                              }
                            >
                              {website.is_recommended ? (
                                <>
                                  <Heart className="h-4 w-4 mr-2 fill-current" />
                                  取消推荐
                                </>
                              ) : (
                                <>
                                  <HeartOff className="h-4 w-4 mr-2" />
                                  设为推荐
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>

        {/* 添加网站对话框 */}
        <Dialog
          open={showAddWebsite || !!editingWebsite}
          onOpenChange={() => {
            setShowAddWebsite(false)
            setEditingWebsite(null)
            setEditForm({
              name: "",
              url: "",
              category: "",
              description: "",
              iconType: "favicon",
              iconValue: "",
              isRecommended: false,
            })
          }}
        >
          <DialogContent
            className={`${theme === "dark" ? "backdrop-blur-md bg-slate-800/95 border-slate-600/30" : "backdrop-blur-md bg-white/95 border-white/20"} max-w-lg max-h-[90vh] overflow-y-auto`}
          >
            <DialogHeader>
              <DialogTitle className={theme === "dark" ? "text-stone-200" : ""}>
                {editingWebsite ? "编辑网站" : "添加网站"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className={theme === "dark" ? "text-stone-200" : ""}>
                  网站名称
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="输入网站名称"
                  className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}
                />
              </div>
              <div>
                <Label htmlFor="url" className={theme === "dark" ? "text-stone-200" : ""}>
                  网站地址
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    value={editForm.url}
                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    placeholder="输入网站地址"
                    className={`flex-1 ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFetchWebsiteInfo}
                    disabled={!editForm.url || isLoadingFavicon}
                    className={`${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"} whitespace-nowrap`}
                  >
                    {isLoadingFavicon ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        自动获取
                      </>
                    )}
                  </Button>
                </div>
                <div className={`text-xs ${theme === "dark" ? "text-stone-400" : "text-gray-500"} mt-1`}>
                  点击"自动获取"按钮可自动获取网站标题和图标（图标会自动缓存）
                </div>
              </div>
              <div>
                <Label htmlFor="description" className={theme === "dark" ? "text-stone-200" : ""}>
                  网站描述
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="简短描述网站功能..."
                  rows={2}
                  maxLength={50}
                  className={`resize-none ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}`}
                />
                <div className={`text-xs ${theme === "dark" ? "text-stone-400" : "text-gray-500"} mt-1`}>
                  {editForm.description.length}/50 字符
                </div>
              </div>
              <div>
                <Label htmlFor="category" className={theme === "dark" ? "text-stone-200" : ""}>
                  分类
                </Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                >
                  <SelectTrigger className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className={theme === "dark" ? "bg-slate-800 border-slate-600" : ""}>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.name}
                        className={theme === "dark" ? "text-stone-200 focus:bg-slate-700" : ""}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 推荐设置 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecommended"
                  checked={editForm.isRecommended}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isRecommended: !!checked })}
                />
                <Label htmlFor="isRecommended" className={theme === "dark" ? "text-stone-200" : ""}>
                  设为推荐网站
                </Label>
              </div>

              {/* 图标设置 */}
              <div className="space-y-3">
                <Label className={theme === "dark" ? "text-stone-200" : ""}>图标设置</Label>
                <RadioGroup
                  value={editForm.iconType}
                  onValueChange={(value: IconType) => setEditForm({ ...editForm, iconType: value })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="favicon" id="favicon" />
                    <Label htmlFor="favicon" className={`flex-1 ${theme === "dark" ? "text-stone-200" : ""}`}>
                      自动获取网站图标
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAutoDetectFavicon}
                      disabled={!editForm.url || isLoadingFavicon}
                      className={`${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
                    >
                      {isLoadingFavicon ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lucide" id="lucide" />
                    <Label htmlFor="lucide" className={theme === "dark" ? "text-stone-200" : ""}>
                      选择内置图标
                    </Label>
                  </div>
                  {editForm.iconType === "lucide" && (
                    <Select
                      value={editForm.iconValue}
                      onValueChange={(value) => setEditForm({ ...editForm, iconValue: value })}
                    >
                      <SelectTrigger
                        className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}
                      >
                        <SelectValue placeholder="选择图标" />
                      </SelectTrigger>
                      <SelectContent className={theme === "dark" ? "bg-slate-800 border-slate-600" : ""}>
                        {iconOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <SelectItem
                              key={option.name}
                              value={option.name}
                              className={theme === "dark" ? "text-stone-200 focus:bg-slate-700" : ""}
                            >
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4" />
                                <span>{option.name}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className={theme === "dark" ? "text-stone-200" : ""}>
                      自定义图标
                    </Label>
                  </div>
                  {editForm.iconType === "custom" && (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="输入图标URL"
                          value={editForm.iconValue}
                          onChange={(e) => setEditForm({ ...editForm, iconValue: e.target.value })}
                          className={`flex-1 ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("icon-upload")?.click()}
                          className={`${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <input
                        id="icon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </RadioGroup>

                {editForm.iconValue && (
                  <div
                    className={`flex items-center space-x-2 p-2 ${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100"} rounded`}
                  >
                    <span className={`text-sm ${theme === "dark" ? "text-stone-300" : "text-gray-600"}`}>预览:</span>
                    <div className={`p-1 ${theme === "dark" ? "bg-slate-600" : "bg-purple-500"} rounded`}>
                      <WebsiteIcon
                        website={{
                          id: 0,
                          name: editForm.name,
                          url: editForm.url,
                          category: editForm.category,
                          description: editForm.description,
                          icon_type: editForm.iconType,
                          icon_value: editForm.iconValue,
                          clicks: 0,
                          is_recommended: editForm.isRecommended,
                          created_at: "",
                          updated_at: "",
                        }}
                        size="h-5 w-5"
                        theme={theme}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button onClick={editingWebsite ? saveEdit : addWebsite} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingWebsite ? "保存" : "添加"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddWebsite(false)
                    setEditingWebsite(null)
                    setEditForm({
                      name: "",
                      url: "",
                      category: "",
                      description: "",
                      iconType: "favicon",
                      iconValue: "",
                      isRecommended: false,
                    })
                  }}
                  className={`flex-1 ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
                >
                  <X className="h-4 w-4 mr-2" />
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 添加分类对话框 */}
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogContent
            className={`${theme === "dark" ? "backdrop-blur-md bg-slate-800/95 border-slate-600/30" : "backdrop-blur-md bg-white/95 border-white/20"} max-w-md`}
          >
            <DialogHeader>
              <DialogTitle className={theme === "dark" ? "text-stone-200" : ""}>添加分类</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newCategory" className={theme === "dark" ? "text-stone-200" : ""}>
                  分类名称
                </Label>
                <Input
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="输入分类名称"
                  className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addCategory} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  添加
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddCategory(false)
                    setNewCategory("")
                  }}
                  className={`flex-1 ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
                >
                  <X className="h-4 w-4 mr-2" />
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 管理员登录对话框 */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent
            className={`${theme === "dark" ? "backdrop-blur-md bg-slate-800/95 border-slate-600/30" : "backdrop-blur-md bg-white/95 border-white/20"} max-w-md`}
          >
            <DialogHeader>
              <DialogTitle className={theme === "dark" ? "text-stone-200" : ""}>管理员登录</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className={theme === "dark" ? "text-stone-200" : ""}>
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="请输入用户名"
                  className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                />
              </div>
              <div>
                <Label htmlFor="password" className={theme === "dark" ? "text-stone-200" : ""}>
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="请输入密码"
                  className={theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200" : ""}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                />
              </div>

              {loginError && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{loginError}</div>
              )}


              <div className="flex space-x-2">
                <Button onClick={handleAdminLogin} className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  登录
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoginDialog(false)
                    setLoginForm({ username: "", password: "" })
                    setLoginError("")
                  }}
                  className={`flex-1 ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
                >
                  <X className="h-4 w-4 mr-2" />
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 缓存管理对话框 */}
        <Dialog open={showCacheDialog} onOpenChange={setShowCacheDialog}>
          <DialogContent
            className={`${theme === "dark" ? "backdrop-blur-md bg-slate-800/95 border-slate-600/30" : "backdrop-blur-md bg-white/95 border-white/20"} max-w-md`}
          >
            <DialogHeader>
              <DialogTitle className={theme === "dark" ? "text-stone-200" : ""}>缓存管理</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className={`${theme === "dark" ? "bg-slate-700/30" : "bg-gray-50"} p-4 rounded-lg space-y-2`}>
                <div className="flex justify-between">
                  <span className={`${theme === "dark" ? "text-stone-300" : "text-gray-600"} text-sm`}>缓存大小:</span>
                  <span className={`${theme === "dark" ? "text-stone-200" : "text-gray-800"} text-sm font-medium`}>
                    {cacheStats.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme === "dark" ? "text-stone-300" : "text-gray-600"} text-sm`}>缓存数量:</span>
                  <span className={`${theme === "dark" ? "text-stone-200" : "text-gray-800"} text-sm font-medium`}>
                    {cacheStats.count} 个图标
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme === "dark" ? "text-stone-300" : "text-gray-600"} text-sm`}>最后清理:</span>
                  <span className={`${theme === "dark" ? "text-stone-200" : "text-gray-800"} text-sm font-medium`}>
                    {cacheStats.lastCleanup}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className={`${theme === "dark" ? "text-stone-300" : "text-gray-600"} text-sm`}>
                  图标缓存可以提高加载速度，避免重复请求。缓存会自动清理过期项目（7天）。
                </p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCleanupCache} variant="outline" className="flex-1 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  清理过期
                </Button>
                <Button onClick={handleClearCache} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  清空缓存
                </Button>
              </div>

              <Button
                onClick={() => setShowCacheDialog(false)}
                variant="outline"
                className={`w-full ${theme === "dark" ? "bg-slate-700/50 border-slate-600 text-stone-200 hover:bg-slate-600/50" : "bg-transparent"}`}
              >
                关闭
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 固定底部 */}
      <footer className={`fixed bottom-0 left-0 right-0 ${themeClasses.glass} border-t z-40`}>
        <div className="container mx-auto px-4 py-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Globe className={`h-4 w-4 ${themeClasses.text}`} />
              <span className={`${themeClasses.text} font-semibold text-sm`}>导航站</span>
            </div>
            <p className={`${themeClasses.textMuted} text-xs`}>收集优质网站和工具，让工作更高效</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
