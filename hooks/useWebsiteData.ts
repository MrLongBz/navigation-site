import { useState, useCallback } from "react"
import type { Website, Category } from "@/types"

export function useWebsiteData() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendedWebsites, setRecommendedWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载所有数据
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [websitesRes, categoriesRes, recommendedRes] = await Promise.all([
        fetch("/api/websites"),
        fetch("/api/categories"),
        fetch("/api/websites/recommended")
      ])

      if (!websitesRes.ok || !categoriesRes.ok || !recommendedRes.ok) {
        throw new Error("加载数据失败")
      }

      const websitesData = await websitesRes.json()
      const categoriesData = await categoriesRes.json()
      const recommendedData = await recommendedRes.json()

      setWebsites(websitesData)
      setCategories(categoriesData)
      setRecommendedWebsites(recommendedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败")
      console.error("加载数据失败:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 更新网站状态
  const updateWebsiteInState = useCallback((updatedWebsite: Website) => {
    console.log("更新本地状态:", {
      id: updatedWebsite.id,
      name: updatedWebsite.name,
      icon_type: updatedWebsite.icon_type,
      icon_value: updatedWebsite.icon_value?.substring(0, 50) + "...",
      hasIconValue: !!updatedWebsite.icon_value
    })
    
    setWebsites(prev => prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w))
    
    // 同时更新推荐列表
    if (updatedWebsite.is_recommended) {
      setRecommendedWebsites(prev => {
        const existing = prev.find(w => w.id === updatedWebsite.id)
        return existing 
          ? prev.map(w => w.id === updatedWebsite.id ? updatedWebsite : w)
          : [...prev, updatedWebsite]
      })
    } else {
      setRecommendedWebsites(prev => prev.filter(w => w.id !== updatedWebsite.id))
    }
  }, [])

  // 添加网站到状态
  const addWebsiteToState = useCallback((newWebsite: Website) => {
    console.log("=== addWebsiteToState 调试 ===")
    console.log("添加到状态的网站数据:", {
      id: newWebsite.id,
      name: newWebsite.name,
      icon_type: newWebsite.icon_type,
      icon_value_length: newWebsite.icon_value?.length || 0,
      icon_value_preview: newWebsite.icon_value?.substring(0, 50) + "...",
      is_recommended: newWebsite.is_recommended
    })
    console.log("=== addWebsiteToState 调试结束 ===")
    
    setWebsites(prev => [...prev, newWebsite])
    if (newWebsite.is_recommended) {
      setRecommendedWebsites(prev => [...prev, newWebsite])
    }
  }, [])

  // 从状态中删除网站
  const removeWebsiteFromState = useCallback((websiteId: number) => {
    setWebsites(prev => prev.filter(w => w.id !== websiteId))
    setRecommendedWebsites(prev => prev.filter(w => w.id !== websiteId))
  }, [])

  // 更新分类状态
  const updateCategoryInState = useCallback((updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c))
  }, [])

  // 添加分类到状态
  const addCategoryToState = useCallback((newCategory: Category) => {
    setCategories(prev => [...prev, newCategory])
  }, [])

  // 从状态中删除分类
  const removeCategoryFromState = useCallback((categoryId: number) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId))
  }, [])

  // 点击网站（增加点击数）
  const handleWebsiteClick = useCallback(async (website: Website) => {
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "click" })
      })

      if (response.ok) {
        const updatedWebsite = await response.json()
        updateWebsiteInState(updatedWebsite)
      }

      // 打开网站链接
      window.open(website.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("更新点击数失败:", error)
      // 即使更新失败也要打开链接
      window.open(website.url, "_blank", "noopener,noreferrer")
    }
  }, [updateWebsiteInState])

  // 切换推荐状态
  const toggleRecommended = useCallback(async (website: Website) => {
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-recommend" })
      })

      if (!response.ok) {
        throw new Error("切换推荐状态失败")
      }

      const updatedWebsite = await response.json()
      updateWebsiteInState(updatedWebsite)
      
      return updatedWebsite
    } catch (error) {
      console.error("切换推荐状态失败:", error)
      throw error
    }
  }, [updateWebsiteInState])

  // 创建新网站
  const createWebsite = useCallback(async (websiteData: Omit<Website, 'id' | 'clicks' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websiteData)
      })

      if (!response.ok) {
        throw new Error("创建网站失败")
      }

      const newWebsite = await response.json()
      addWebsiteToState(newWebsite)
      
      return newWebsite
    } catch (error) {
      console.error("创建网站失败:", error)
      throw error
    }
  }, [addWebsiteToState])

  // 更新网站
  const updateWebsite = useCallback(async (websiteId: number, websiteData: Partial<Website>) => {
    try {
      console.log("发送更新请求:", { websiteId, websiteData })
      
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websiteData)
      })

      if (!response.ok) {
        throw new Error("更新网站失败")
      }

      const updatedWebsite = await response.json()
      console.log("API返回的更新数据:", updatedWebsite)
      console.log("检查图标数据:", {
        icon_type: updatedWebsite.icon_type,
        icon_value: updatedWebsite.icon_value?.substring(0, 50) + "...",
        hasIconValue: !!updatedWebsite.icon_value
      })
      
      updateWebsiteInState(updatedWebsite)
      
      return updatedWebsite
    } catch (error) {
      console.error("更新网站失败:", error)
      throw error
    }
  }, [updateWebsiteInState])

  // 删除网站
  const deleteWebsite = useCallback(async (websiteId: number) => {
    try {
      const response = await fetch(`/api/websites/${websiteId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("删除网站失败")
      }

      removeWebsiteFromState(websiteId)
    } catch (error) {
      console.error("删除网站失败:", error)
      throw error
    }
  }, [removeWebsiteFromState])

  // 批量删除网站
  const deleteMultipleWebsites = useCallback(async (websiteIds: number[]) => {
    try {
      const deletePromises = websiteIds.map(id => 
        fetch(`/api/websites/${id}`, { method: "DELETE" })
      )

      const responses = await Promise.all(deletePromises)
      const failedDeletes = responses.filter(res => !res.ok)
      
      if (failedDeletes.length > 0) {
        throw new Error(`删除失败: ${failedDeletes.length} 个网站`)
      }

      // 从状态中移除所有删除的网站
      websiteIds.forEach(id => removeWebsiteFromState(id))
    } catch (error) {
      console.error("批量删除网站失败:", error)
      throw error
    }
  }, [removeWebsiteFromState])

  // 创建新分类
  const createCategory = useCallback(async (categoryName: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      })

      if (!response.ok) {
        throw new Error("创建分类失败")
      }

      const newCategory = await response.json()
      addCategoryToState(newCategory)
      
      return newCategory
    } catch (error) {
      console.error("创建分类失败:", error)
      throw error
    }
  }, [addCategoryToState])

  // 更新分类
  const updateCategory = useCallback(async (categoryId: number, newName: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      })

      if (!response.ok) {
        throw new Error("更新分类失败")
      }

      const updatedCategory = await response.json()
      updateCategoryInState(updatedCategory)
      
      return updatedCategory
    } catch (error) {
      console.error("更新分类失败:", error)
      throw error
    }
  }, [updateCategoryInState])

  // 删除分类
  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("删除分类失败")
      }

      removeCategoryFromState(categoryId)
    } catch (error) {
      console.error("删除分类失败:", error)
      throw error
    }
  }, [removeCategoryFromState])

  return {
    // 状态
    websites,
    categories,
    recommendedWebsites,
    loading,
    error,
    
    // 数据加载
    loadData,
    
    // 网站操作
    handleWebsiteClick,
    toggleRecommended,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    deleteMultipleWebsites,
    
    // 分类操作
    createCategory,
    updateCategory,
    deleteCategory,
    
    // 状态更新（用于外部直接更新状态）
    updateWebsiteInState,
    addWebsiteToState,
    removeWebsiteFromState,
    updateCategoryInState,
    addCategoryToState,
    removeCategoryFromState,
    
    // 状态设置器（用于重置或设置状态）
    setWebsites,
    setCategories,
    setRecommendedWebsites,
    setError
  }
} 