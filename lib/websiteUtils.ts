// 获取favicon的多种方式
export const getFaviconUrl = (websiteUrl: string): string[] => {
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

// 验证URL格式
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 格式化URL，确保包含协议
export const formatUrl = (url: string): string => {
  if (!url) return ""
  
  // 如果URL不包含协议，添加https://
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`
  }
  
  return url
}

// 提取域名
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ""
  }
}

// 自动获取网站信息
export const fetchWebsiteInfo = async (url: string): Promise<{ 
  title: string; 
  description: string; 
  icon?: string 
} | null> => {
  try {
    const formattedUrl = formatUrl(url)
    if (!isValidUrl(formattedUrl)) {
      return null
    }

    // 使用一个公共的API来获取网站信息
    // 这里使用一个简化的实现，实际项目中可能需要后端支持
    const response = await fetch(`/api/website-info?url=${encodeURIComponent(formattedUrl)}`)
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return {
      title: data.title || extractDomain(formattedUrl),
      description: data.description || "",
      icon: data.icon
    }
  } catch (error) {
    console.error("获取网站信息失败:", error)
    return null
  }
}

// 检查图片URL是否有效
export const isValidImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

// 获取网站的第一个有效favicon
export const getFirstValidFavicon = async (websiteUrl: string): Promise<string | null> => {
  const faviconUrls = getFaviconUrl(websiteUrl)
  
  for (const url of faviconUrls) {
    const isValid = await isValidImageUrl(url)
    if (isValid) {
      return url
    }
  }
  
  return null
}

// 清理和验证网站数据
export const validateWebsiteData = (data: {
  name: string;
  url: string;
  category: string;
  description?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("网站名称不能为空")
  }

  if (!data.url?.trim()) {
    errors.push("网站URL不能为空")
  } else if (!isValidUrl(formatUrl(data.url))) {
    errors.push("请输入有效的URL格式")
  }

  if (!data.category?.trim()) {
    errors.push("请选择分类")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
} 