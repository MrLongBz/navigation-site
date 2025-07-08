import {
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
  Globe,
  Star,
  Heart,
  Users,
  Settings,
  HardDrive,
  type LucideIcon,
} from "lucide-react"

// 图标缓存管理类
export class IconCacheManager {
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

// 图标选项接口
export interface IconOption {
  name: string
  icon: LucideIcon
}

// 可选图标列表
export const iconOptions: IconOption[] = [
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
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Users", icon: Users },
  { name: "Settings", icon: Settings },
  { name: "HardDrive", icon: HardDrive },
] 