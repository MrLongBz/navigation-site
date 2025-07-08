import { useState, useEffect } from "react"
import type { PageMode } from "@/types"

export interface AuthUser {
  id: number
  username: string
  isAdmin: boolean
}

const AUTH_STORAGE_KEY = "navigation_site_auth"

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [pageMode, setPageMode] = useState<PageMode>("user")

  // 计算isAdmin
  const isAdmin = user?.isAdmin || false

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // 页面模式切换逻辑
  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      setPageMode("admin")
    } else {
      setPageMode("user")
    }
  }, [isLoggedIn, isAdmin])

  const checkAuthStatus = async () => {
    try {
      // 从localStorage检查认证状态
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (savedAuth) {
        const userData = JSON.parse(savedAuth)
        setIsLoggedIn(true)
        setUser(userData)
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error("检查登录状态失败:", error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    setLoginError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const responseData = await response.json()
        const userData = responseData.user
        
        // 保存到localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
        
        setIsLoggedIn(true)
        setUser(userData)
        return { success: true }
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || "登录失败"
        setLoginError(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = "网络错误，请重试"
      setLoginError(errorMessage)
      console.error("登录错误:", error)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include"
      })
    } catch (error) {
      console.error("登出请求失败:", error)
    } finally {
      // 清除localStorage和本地状态
      localStorage.removeItem(AUTH_STORAGE_KEY)
      setIsLoggedIn(false)
      setUser(null)
      setLoginError(null)
    }
  }

  const clearError = () => {
    setLoginError(null)
  }

  return {
    isLoggedIn,
    user,
    isLoading,
    loginError,
    isAdmin,
    pageMode,
    setPageMode,
    login,
    logout,
    checkAuthStatus,
    clearError
  }
} 