"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
  Search,
  Plus,
  Trash2,
  Users,
  FolderPlus,
  HardDrive,
  Sun,
  Moon,
  RefreshCw,
  Heart,
  HeartOff,
  Star,
  ExternalLink,
  Globe,
  Edit3,
  X,
  Settings,
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
  Save,
  Upload,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// 导入新创建的模块
import type { Website, Category, IconType, PageMode } from "@/types"
import { useTheme } from "@/hooks/useTheme"
import { useAuth } from "@/hooks/useAuth"
import { useWebsiteData } from "@/hooks/useWebsiteData"
import { WebsiteCard } from "@/components/WebsiteCard"
import { WebsiteIcon } from "@/components/WebsiteIcon"
import { IconCacheManager } from "@/lib/iconCache"
import { validateWebsiteData, formatUrl } from "@/lib/websiteUtils"
import { useToast } from "@/hooks/use-toast"

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

export default function HomePage() {
  // 主题和认证hooks
  const { theme, themeClasses, toggleTheme } = useTheme()
  const { isLoggedIn, user, isLoading: authLoading, loginError, login, logout, clearError } = useAuth()
  const { toast } = useToast()

  // 数据管理hook
  const {
    websites,
    categories,
    recommendedWebsites,
    loading: dataLoading,
    error: dataError,
    loadData,
    handleWebsiteClick,
    toggleRecommended,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    deleteMultipleWebsites,
    createCategory,
    updateCategory,
    deleteCategory,
    addWebsiteToState,
  } = useWebsiteData()

  // 本地UI状态
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [pageMode, setPageMode] = useState<PageMode>("user")
  const [editMode, setEditMode] = useState(false)
  const [selectedWebsites, setSelectedWebsites] = useState<number[]>([])
  const [showAddWebsite, setShowAddWebsite] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCacheDialog, setShowCacheDialog] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null)

  // 表单状态
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    category: "",
    description: "",
    iconType: "favicon" as IconType,
    iconValue: "",
    isRecommended: false,
  })
  const [newCategory, setNewCategory] = useState("")
  const [cacheStats, setCacheStats] = useState(IconCacheManager.getCacheStats())
  const [isLoadingFavicon, setIsLoadingFavicon] = useState(false)

  // 加载数据
  useEffect(() => {
    loadData()
  }, [loadData])

  // 页面模式切换和编辑模式处理
  useEffect(() => {
    if (isLoggedIn) {
      setPageMode("admin")
      setEditMode(false) // 重置编辑模式
    } else {
      setPageMode("user")
      setEditMode(false)
      setSelectedWebsites([])
    }
  }, [isLoggedIn])

  // 分类和过滤逻辑
  const allCategories = ["全部", ...categories.map((c) => c.name)]

  const filteredWebsites = useMemo(() => {
    return websites.filter((website) => {
      const matchesSearch =
        website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "全部" || website.category === selectedCategory
      const isNotRecommendedDuplicate = !(searchTerm === "" && selectedCategory === "全部" && website.is_recommended)
      return matchesSearch && matchesCategory && isNotRecommendedDuplicate
    })
  }, [websites, searchTerm, selectedCategory])

  // 包装函数以匹配WebsiteCard期望的接口
  const handleWebsiteEdit = async (website: Website) => {
    try {
      await updateWebsite(website.id, website)
    } catch (error) {
      console.error("更新网站失败:", error)
    }
  }

  const handleWebsiteDelete = async (websiteId: number) => {
    try {
      await deleteWebsite(websiteId)
    } catch (error) {
      console.error("删除网站失败:", error)
    }
  }

  const handleToggleRecommended = async (website: Website) => {
    try {
      console.log("开始切换推荐状态:", { id: website.id, name: website.name, current: website.is_recommended })
      const result = await toggleRecommended(website)
      console.log("推荐状态切换成功:", result)
      toast({
        title: "操作成功",
        description: `${website.name} ${result.is_recommended ? '已设为推荐' : '已取消推荐'}`,
      })
    } catch (error) {
      console.error("切换推荐状态失败:", error)
      toast({
        variant: "destructive",
        title: "操作失败",
        description: `切换推荐状态失败：${error instanceof Error ? error.message : '未知错误'}`,
      })
    }
  }

  // 原版的handleWebsiteClick处理编辑模式
  const handleOriginalWebsiteClick = (website: Website) => {
    if (editMode) {
      // 在编辑模式下打开编辑对话框，而不是访问网站
      startEditing(website)
    } else {
      handleWebsiteClick(website)
    }
  }

  // 开始编辑网站
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
    setShowAddWebsite(true)
  }

  // 添加网站
  const addWebsite = async () => {
    console.log("开始添加网站，表单数据：", editForm)
    
    if (!editForm.name || !editForm.url || !editForm.category) {
      toast({
        variant: "destructive",
        title: "表单错误",
        description: "请填写完整的网站信息（名称、URL、分类）",
      })
      return
    }

    try {
      setIsLoadingFavicon(true)
      
      // 按照原版的字段名发送数据
      const websiteData = {
        name: editForm.name,
        url: editForm.url,
        category: editForm.category,
        description: editForm.description,
        iconType: editForm.iconType,  // 注意：这里是 iconType，不是 icon_type
        iconValue: editForm.iconValue, // 注意：这里是 iconValue，不是 icon_value
        isRecommended: editForm.isRecommended,
      }
      
      console.log("发送到API的数据：", websiteData)

      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websiteData),
      })

      if (response.ok) {
        const newWebsite = await response.json()
        console.log("添加网站成功：", newWebsite)
        console.log("检查图标数据：", {
          icon_type: newWebsite?.icon_type,
          icon_value: newWebsite?.icon_value?.substring(0, 50) + "...",
          hasIconValue: !!newWebsite?.icon_value
        })
        
        // 使用 hook 方法添加到状态
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
        toast({
          title: "添加成功",
          description: "网站已成功添加到导航站",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "添加失败")
      }
    } catch (error) {
      console.error("添加网站失败:", error)
      toast({
        variant: "destructive",
        title: "添加失败",
        description: `添加网站失败：${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setIsLoadingFavicon(false)
    }
  }

  // 保存编辑
  const saveEdit = async () => {
    if (!editingWebsite || !editForm.name || !editForm.url || !editForm.category) {
      toast({
        variant: "destructive",
        title: "表单错误",
        description: "请填写完整的网站信息",
      })
      return
    }

    try {
      setIsLoadingFavicon(true)
      
      const updatedWebsite = {
        ...editingWebsite,
        name: editForm.name,
        url: editForm.url,
        category: editForm.category,
        description: editForm.description,
        icon_type: editForm.iconType,
        icon_value: editForm.iconValue,
        is_recommended: editForm.isRecommended,
      }

      await updateWebsite(editingWebsite.id, updatedWebsite)
      
      setEditForm({
        name: "",
        url: "",
        category: "",
        description: "",
        iconType: "favicon",
        iconValue: "",
        isRecommended: false,
      })
      setEditingWebsite(null)
      setShowAddWebsite(false)
      toast({
        title: "更新成功",
        description: "网站信息已成功更新",
      })
    } catch (error) {
      console.error("保存编辑失败:", error)
      toast({
        variant: "destructive",
        title: "更新失败",
        description: `保存失败：${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setIsLoadingFavicon(false)
    }
  }

  // 添加分类
  const addCategory = async () => {
    if (!newCategory.trim()) return

    try {
      await createCategory(newCategory.trim())
      setNewCategory("")
      setShowAddCategory(false)
    } catch (error) {
      console.error("添加分类失败:", error)
    }
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

  // 自动检测favicon
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

  // 文件上传处理（按照原版简化版本）
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("选择的文件：", file)
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        console.log("文件读取完成，设置到表单")
        setEditForm((prev) => ({
          ...prev,
          iconType: "custom",
          iconValue: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (authLoading || dataLoading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className={`h-8 w-8 animate-spin mx-auto mb-4 ${themeClasses.loadingSpinner}`} />
          <p className={themeClasses.loadingText}>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} pb-20`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

      <div className="relative z-10">
        {/* 头部导航 - 原版样式 */}
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
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.muted} h-4 w-4`}
                    />
                    <Input
                      placeholder="搜索网站或描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${themeClasses.searchBackground} ${themeClasses.searchBorder} ${themeClasses.searchText} backdrop-blur-sm h-9`}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`${themeClasses.themeButton} transition-all duration-200`}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCacheStats(IconCacheManager.getCacheStats())
                      setShowCacheDialog(true)
                    }}
                    className={`${themeClasses.button} transition-all duration-200`}
                    title="缓存管理"
                  >
                    <HardDrive className="h-4 w-4" />
                  </Button>
                )}

                {isLoggedIn ? (
                  <>
                    <Button
                      variant={pageMode === "admin" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPageMode(pageMode === "admin" ? "user" : "admin")}
                      className={`${
                        pageMode === "admin" ? themeClasses.categoryButtonActive : themeClasses.button
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
                          editMode ? themeClasses.categoryButtonActive : themeClasses.button
                        } transition-all duration-200`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {editMode ? "完成编辑" : "编辑模式"}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout()}
                      className={`${themeClasses.logoutButton} transition-all duration-200`}
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
                    className={`${themeClasses.loginButton} transition-all duration-200`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    管理员登录
                  </Button>
                )}

                {pageMode === "user" && (
                  <div className={`${themeClasses.secondaryText} text-sm`}>共 {websites.length} 个网站</div>
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

              {/* 分类筛选 - 原版样式 */}
              <section className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      className={`${
                        selectedCategory === category ? themeClasses.categoryButtonActive : themeClasses.categoryButton
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

              {/* 站长推荐 - 原版独立区域 */}
              {searchTerm === "" && selectedCategory === "全部" && recommendedWebsites.length > 0 && (
                <section className="mb-8">
                  <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center`}>
                    <Star className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-amber-400" : "text-rose-400"}`} />
                    站长推荐
                    <span className={`${themeClasses.muted} text-sm ml-2 font-normal`}>精选优质网站</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendedWebsites.map((website) => (
                      <Card
                        key={website.id}
                        className={`${themeClasses.card} ${themeClasses.cardHover} transition-all duration-200 group cursor-pointer relative ${
                          editMode ? (theme === "dark" ? "ring-2 ring-amber-500/50" : "ring-2 ring-rose-400/50") : ""
                        }`}
                        onClick={() => handleOriginalWebsiteClick(website)}
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
                              <Edit3 className={`h-4 w-4 ${themeClasses.muted}`} />
                            </div>
                          )}
                          <div className="flex items-start space-x-3 mt-2">
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg} transition-colors flex-shrink-0`}>
                              <WebsiteIcon
                                website={website}
                                size="h-6 w-6"
                                theme={theme}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`${themeClasses.text} font-medium text-sm truncate mb-1`}>
                                {website.name}
                              </h3>
                              <p className={`${themeClasses.muted} text-xs line-clamp-2 mb-2`}>
                                {website.description}
                              </p>
                              <div className="flex items-center">
                                <span className={`${themeClasses.muted} text-xs`}>{website.clicks}</span>
                                <ExternalLink className={`h-3 w-3 ${themeClasses.muted} ml-1`} />
                              </div>
                            </div>
                          </div>
                          {!editMode && (
                            <ExternalLink
                              className={`absolute top-2 right-2 h-3 w-3 ${themeClasses.muted} opacity-0 group-hover:opacity-100 transition-opacity`}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* 网站列表 - 原版5列布局 */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${themeClasses.text}`}>
                    {selectedCategory === "全部" ? "所有网站" : selectedCategory}
                    <span className={`${themeClasses.muted} text-sm ml-2 font-normal`}>
                      ({filteredWebsites.length})
                    </span>
                  </h2>
                </div>

                {filteredWebsites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`${themeClasses.card} border rounded-lg p-8 max-w-md mx-auto`}>
                      <Search className={`h-12 w-12 ${themeClasses.muted} mx-auto mb-4`} />
                      <p className={`${themeClasses.secondaryText} text-lg`}>未找到相关网站</p>
                      <p className={`${themeClasses.muted} text-sm mt-2`}>尝试调整搜索关键词或选择其他分类</p>
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
                        onClick={() => handleOriginalWebsiteClick(website)}
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
                              <Edit3 className={`h-4 w-4 ${themeClasses.muted}`} />
                            </div>
                          )}
                          <div className={`flex items-start space-x-3 ${website.is_recommended ? "mt-2" : ""}`}>
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg} transition-colors flex-shrink-0`}>
                              <WebsiteIcon
                                website={website}
                                size="h-5 w-5"
                                theme={theme}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`${themeClasses.text} font-medium text-sm truncate mb-1`}
                                title={website.name}
                              >
                                {website.name}
                              </h3>
                              <p
                                className={`${themeClasses.muted} text-xs line-clamp-2`}
                                title={website.description}
                              >
                                {website.description}
                              </p>
                            </div>
                          </div>
                          {!editMode && (
                            <ExternalLink
                              className={`absolute top-2 right-2 h-3 w-3 ${themeClasses.muted} opacity-0 group-hover:opacity-100 transition-opacity`}
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
            // 管理后台界面 - 原版Tabs样式
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>管理后台</h2>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowAddWebsite(true)} className={`${themeClasses.addButton}`}>
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
                <TabsList className={`${themeClasses.tabsBackground}`}>
                  <TabsTrigger value="websites" className={themeClasses.tabsText}>
                    网站管理
                  </TabsTrigger>
                  <TabsTrigger value="categories" className={themeClasses.tabsText}>
                    分类管理
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className={themeClasses.tabsText}>
                    推荐管理
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="websites" className="space-y-4">
                  {/* 统计信息 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${themeClasses.card} p-4 rounded-lg`}>
                      <div className="flex items-center space-x-2">
                        <Globe className={`h-5 w-5 ${themeClasses.accent}`} />
                        <div>
                          <div className={`${themeClasses.text} text-lg font-semibold`}>{websites.length}</div>
                          <div className={`${themeClasses.muted} text-sm`}>总网站数</div>
                        </div>
                      </div>
                    </div>
                    <div className={`${themeClasses.card} p-4 rounded-lg`}>
                      <div className="flex items-center space-x-2">
                        <Star className={`h-5 w-5 ${theme === "dark" ? "text-amber-400" : "text-rose-400"}`} />
                        <div>
                          <div className={`${themeClasses.text} text-lg font-semibold`}>{recommendedWebsites.length}</div>
                          <div className={`${themeClasses.muted} text-sm`}>推荐网站</div>
                        </div>
                      </div>
                    </div>
                    <div className={`${themeClasses.card} p-4 rounded-lg`}>
                      <div className="flex items-center space-x-2">
                        <FolderPlus className={`h-5 w-5 ${themeClasses.accent}`} />
                        <div>
                          <div className={`${themeClasses.text} text-lg font-semibold`}>{categories.length}</div>
                          <div className={`${themeClasses.muted} text-sm`}>分类数量</div>
                        </div>
                      </div>
                    </div>
                    <div className={`${themeClasses.card} p-4 rounded-lg`}>
                      <div className="flex items-center space-x-2">
                        <Users className={`h-5 w-5 ${themeClasses.accent}`} />
                        <div>
                          <div className={`${themeClasses.text} text-lg font-semibold`}>
                            {websites.reduce((sum, w) => sum + w.clicks, 0)}
                          </div>
                          <div className={`${themeClasses.muted} text-sm`}>总点击数</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 搜索和筛选工具栏 */}
                  <div className={`${themeClasses.card} p-4 rounded-lg space-y-4`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.muted} h-4 w-4`} />
                          <Input
                            placeholder="搜索网站名称或描述..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 ${themeClasses.input}`}
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className={`w-full sm:w-48 ${themeClasses.selectBackground}`}>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="全部">全部分类</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* 批量操作 */}
                    {selectedWebsites.length > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-opacity-20">
                        <span className={themeClasses.text}>已选择 {selectedWebsites.length} 个网站</span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              // 批量设为推荐
                              selectedWebsites.forEach(id => {
                                const website = websites.find(w => w.id === id)
                                if (website && !website.is_recommended) {
                                  handleToggleRecommended(website)
                                }
                              })
                            }}
                            variant="outline"
                            size="sm"
                            className={themeClasses.button}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            批量推荐
                          </Button>
                          <Button
                            onClick={() => deleteMultipleWebsites(selectedWebsites)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            批量删除
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 网站表格 */}
                  <div className={`${themeClasses.card} rounded-lg overflow-hidden`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={`${themeClasses.tableHeaderBackground} border-b`}>
                          <tr>
                            <th className="w-12 p-3 text-left">
                              <Checkbox
                                checked={selectedWebsites.length === websites.length && websites.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedWebsites(websites.map(w => w.id))
                                  } else {
                                    setSelectedWebsites([])
                                  }
                                }}
                              />
                            </th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-left font-medium`}>网站</th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-left font-medium`}>分类</th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-left font-medium`}>URL</th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-center font-medium`}>点击数</th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-center font-medium`}>推荐</th>
                            <th className={`${themeClasses.tableHeaderText} p-3 text-center font-medium`}>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredWebsites.map((website, index) => (
                            <tr 
                              key={website.id} 
                              className={`${themeClasses.tableRowHover} border-b border-opacity-10 ${
                                index % 2 === 0 ? 'bg-opacity-5' : ''
                              }`}
                            >
                              <td className="p-3">
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
                              </td>
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-1.5 rounded ${themeClasses.iconBg}`}>
                                    <WebsiteIcon
                                      website={website}
                                      size="h-5 w-5"
                                      theme={theme}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className={`${themeClasses.tableRowText} font-medium truncate`}>
                                      {website.name}
                                    </div>
                                    <div className={`${themeClasses.muted} text-sm truncate max-w-xs`}>
                                      {website.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="outline" className={`${themeClasses.badge} text-xs`}>
                                  {website.category}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${themeClasses.linkText} text-sm hover:underline truncate block max-w-xs`}
                                  title={website.url}
                                >
                                  {website.url}
                                </a>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`${themeClasses.tableRowText} text-sm`}>
                                  {website.clicks}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                {website.is_recommended ? (
                                  <Star className={`h-4 w-4 mx-auto ${theme === "dark" ? "text-amber-400" : "text-rose-400"} fill-current`} />
                                ) : (
                                  <span className={`${themeClasses.muted} text-sm`}>-</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button
                                    onClick={() => handleToggleRecommended(website)}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 ${website.is_recommended ? "text-amber-500" : themeClasses.button}`}
                                    title={website.is_recommended ? "取消推荐" : "设为推荐"}
                                  >
                                    {website.is_recommended ? (
                                      <Heart className="h-4 w-4" />
                                    ) : (
                                      <HeartOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => startEditing(website)}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 ${themeClasses.button}`}
                                    title="编辑网站"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleWebsiteDelete(website.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="删除网站"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {filteredWebsites.length === 0 && (
                        <div className="text-center py-12">
                          <div className={`${themeClasses.muted} text-lg`}>
                            {searchTerm || selectedCategory !== "全部" ? "未找到匹配的网站" : "暂无网站数据"}
                          </div>
                          <p className={`${themeClasses.muted} text-sm mt-2`}>
                            {searchTerm || selectedCategory !== "全部" ? "尝试调整搜索条件" : "点击上方按钮添加第一个网站"}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* 表格底部信息 */}
                    {filteredWebsites.length > 0 && (
                      <div className={`${themeClasses.card} p-3 mt-4 rounded-lg`}>
                        <div className="flex items-center justify-between text-sm">
                          <div className={themeClasses.muted}>
                            显示 {filteredWebsites.length} 个网站，共 {websites.length} 个
                          </div>
                          <div className={`${themeClasses.muted} flex items-center space-x-4`}>
                            <span>推荐: {filteredWebsites.filter(w => w.is_recommended).length}</span>
                            <span>总点击: {filteredWebsites.reduce((sum, w) => sum + w.clicks, 0)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
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
                                    onBlur={(e) => {
                                      updateCategory(category.id, e.target.value)
                                      setEditingCategory(null)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        updateCategory(category.id, e.currentTarget.value)
                                        setEditingCategory(null)
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
                              <Button
                                onClick={() => deleteCategory(category.id)}
                                variant="destructive"
                                size="sm"
                              >
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
                  <div className="grid gap-4">
                    {recommendedWebsites.map((website) => (
                      <Card key={website.id} className={`${themeClasses.card}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${themeClasses.iconBg}`}>
                              <WebsiteIcon
                                website={website}
                                size="h-6 w-6"
                                theme={theme}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className={`${themeClasses.text} font-medium`}>{website.name}</h3>
                                <Star
                                  className={`h-4 w-4 ${theme === "dark" ? "text-amber-400" : "text-rose-400"} fill-current`}
                                />
                              </div>
                              <p className={`${themeClasses.muted} text-sm`}>{website.description}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className={`${themeClasses.muted} text-xs`}>分类: {website.category}</span>
                                <span className={`${themeClasses.muted} text-xs`}>点击: {website.clicks}</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleToggleRecommended(website)}
                              variant="outline"
                              size="sm"
                              className={`${themeClasses.button} text-amber-500`}
                              title="取消推荐"
                            >
                              <Heart className="h-4 w-4 fill-current" />
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
      </div>

      {/* 登录对话框 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className={`${themeClasses.dialogBackground} ${themeClasses.dialogBorder}`}>
          <DialogHeader>
            <DialogTitle className={themeClasses.dialogText}>管理员登录</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className={themeClasses.labelText}>用户名</Label>
              <Input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className={`${themeClasses.input} ${themeClasses.inputFocus}`}
              />
            </div>
            <div>
              <Label className={themeClasses.labelText}>密码</Label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className={`${themeClasses.input} ${themeClasses.inputFocus}`}
              />
            </div>
            {loginError && <p className={themeClasses.errorText}>{loginError}</p>}
            <Button
              onClick={async () => {
                const result = await login(loginForm.username, loginForm.password)
                if (result.success) {
                  setShowLoginDialog(false)
                  setLoginForm({ username: "", password: "" })
                }
              }}
              className={`w-full ${themeClasses.addButton}`}
            >
              登录
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加/编辑网站对话框 */}
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
        <DialogContent className={`${themeClasses.dialogBackground} max-w-lg max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle className={themeClasses.dialogText}>
              {editingWebsite ? "编辑网站" : "添加网站"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className={themeClasses.labelText}>网站名称</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="输入网站名称"
                className={themeClasses.input}
              />
            </div>
            
            <div>
              <Label htmlFor="url" className={themeClasses.labelText}>网站地址</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  placeholder="输入网站地址"
                  className={`flex-1 ${themeClasses.input}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFetchWebsiteInfo}
                  disabled={!editForm.url || isLoadingFavicon}
                  className={`${themeClasses.button} whitespace-nowrap`}
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
              <div className={`text-xs ${themeClasses.muted} mt-1`}>
                点击"自动获取"按钮可自动获取网站标题和图标（图标会自动缓存）
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className={themeClasses.labelText}>网站描述</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="简短描述网站功能..."
                rows={2}
                maxLength={50}
                className={`resize-none ${themeClasses.input}`}
              />
              <div className={`text-xs ${themeClasses.muted} mt-1`}>
                {editForm.description.length}/50 字符
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className={themeClasses.labelText}>分类</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className={themeClasses.input}>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent className={themeClasses.dialogBackground}>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.name}
                      className={themeClasses.dialogText}
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
              <Label htmlFor="isRecommended" className={themeClasses.labelText}>
                设为推荐网站
              </Label>
            </div>

            {/* 图标设置 */}
            <div className="space-y-3">
              <Label className={themeClasses.labelText}>图标设置</Label>
              <RadioGroup
                value={editForm.iconType}
                onValueChange={(value: IconType) => {
                  console.log("切换图标类型到:", value)
                  let newIconValue = ""
                  
                  if (value === "favicon" && editForm.url) {
                    newIconValue = editForm.url
                  } else if (value === "lucide") {
                    newIconValue = "Globe" // 默认图标
                  }
                  // custom类型保持空值，等待用户输入或上传
                  
                  setEditForm({ 
                    ...editForm, 
                    iconType: value, 
                    iconValue: newIconValue 
                  })
                }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="favicon" id="favicon" />
                  <Label htmlFor="favicon" className={`flex-1 ${themeClasses.labelText}`}>
                    自动获取网站图标
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoDetectFavicon}
                    disabled={!editForm.url || isLoadingFavicon}
                    className={themeClasses.button}
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
                  <Label htmlFor="lucide" className={themeClasses.labelText}>
                    选择内置图标
                  </Label>
                </div>
                {editForm.iconType === "lucide" && (
                  <Select
                    value={editForm.iconValue}
                    onValueChange={(value) => setEditForm({ ...editForm, iconValue: value })}
                  >
                    <SelectTrigger className={themeClasses.input}>
                      <SelectValue placeholder="选择图标" />
                    </SelectTrigger>
                    <SelectContent className={themeClasses.dialogBackground}>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <SelectItem
                            key={option.name}
                            value={option.name}
                            className={themeClasses.dialogText}
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
                  <Label htmlFor="custom" className={themeClasses.labelText}>
                    自定义图标
                  </Label>
                </div>
                {editForm.iconType === "custom" && (
                  <div>
                    <label className={`text-sm font-medium ${themeClasses.labelText}`}>
                      自定义图标
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                      />
                      {editForm.iconValue && (
                        <div className="mt-2 p-2 border rounded">
                          <p className="text-xs text-gray-600 mb-2">预览:</p>
                          <img
                            src={editForm.iconValue}
                            alt="预览"
                            className="h-12 w-12 rounded object-cover"
                            onLoad={() => console.log("✅ 预览图片加载成功")}
                            onError={() => console.log("❌ 预览图片加载失败")}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            长度: {editForm.iconValue.length} | 
                            类型: {editForm.iconValue.startsWith('data:image/') ? 'base64' : '其他'}
                          </p>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // 添加一个测试base64图片
                          const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                          setEditForm(prev => ({
                            ...prev,
                            iconType: "custom",
                            iconValue: testImage
                          }))
                          console.log("设置测试图片")
                        }}
                        className="text-xs"
                      >
                        测试图片
                      </Button>
                    </div>
                  </div>
                )}
              </RadioGroup>

              {editForm.iconValue && (
                <div className={`flex items-center space-x-2 p-2 ${themeClasses.card} rounded`}>
                  <span className={`text-sm ${themeClasses.muted}`}>预览:</span>
                  <div className={`p-1 ${themeClasses.iconBg} rounded`}>
                    {editForm.iconType === "lucide" ? (
                      (() => {
                        const LucideIcon = iconOptions.find((opt) => opt.name === editForm.iconValue)?.icon || Globe
                        return <LucideIcon className="h-5 w-5 text-white" />
                      })()
                    ) : editForm.iconType === "custom" ? (
                      <img
                        src={editForm.iconValue}
                        alt="预览"
                        className="h-5 w-5 rounded object-cover"
                        onLoad={() => console.log("自定义图片加载成功")}
                        onError={(e) => {
                          console.log("自定义图片加载失败:", editForm.iconValue)
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(editForm.url || 'https://example.com').hostname}&sz=64`}
                        alt="预览"
                        className="h-5 w-5 rounded object-cover"
                        onLoad={() => console.log("favicon加载成功")}
                        onError={(e) => {
                          console.log("favicon加载失败")
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <span className={`text-xs ${themeClasses.muted}`}>
                    类型: {editForm.iconType} | 值: {editForm.iconValue?.substring(0, 30)}...
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button 
                type="button"
                onClick={editingWebsite ? saveEdit : addWebsite} 
                className="flex-1"
                disabled={isLoadingFavicon}
              >
                {isLoadingFavicon ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoadingFavicon ? "处理中..." : (editingWebsite ? "保存" : "添加")}
              </Button>
              <Button
                type="button"
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
                className={`flex-1 ${themeClasses.cancelButton}`}
                disabled={isLoadingFavicon}
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
        <DialogContent className={`${themeClasses.dialogBackground} ${themeClasses.dialogBorder} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={themeClasses.dialogText}>添加分类</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className={themeClasses.labelText}>分类名称</Label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={`${themeClasses.input} ${themeClasses.inputFocus}`}
                placeholder="输入分类名称"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={addCategory} className={`flex-1 ${themeClasses.addButton}`}>
                添加
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategory("")
                }}
                className={`flex-1 ${themeClasses.cancelButton}`}
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 缓存管理对话框 */}
      <Dialog open={showCacheDialog} onOpenChange={setShowCacheDialog}>
        <DialogContent className={`${themeClasses.dialogBackground} ${themeClasses.dialogBorder} max-w-md`}>
          <DialogHeader>
            <DialogTitle className={themeClasses.dialogText}>缓存管理</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`${themeClasses.card} p-4 rounded-lg space-y-2`}>
              <div className="flex justify-between">
                <span className={`${themeClasses.muted} text-sm`}>缓存大小:</span>
                <span className={`${themeClasses.text} text-sm font-medium`}>{cacheStats.size}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.muted} text-sm`}>缓存项目:</span>
                <span className={`${themeClasses.text} text-sm font-medium`}>{cacheStats.count}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.muted} text-sm`}>最后清理:</span>
                <span className={`${themeClasses.text} text-sm font-medium`}>{cacheStats.lastCleanup}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  IconCacheManager.cleanupCache()
                  setCacheStats(IconCacheManager.getCacheStats())
                }}
                variant="outline"
                className={`flex-1 ${themeClasses.refreshButton}`}
              >
                清理过期
              </Button>
              <Button
                onClick={() => {
                  IconCacheManager.clearAllCache()
                  setCacheStats(IconCacheManager.getCacheStats())
                }}
                variant="destructive"
                className={`flex-1 ${themeClasses.clearButton}`}
              >
                清空缓存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 