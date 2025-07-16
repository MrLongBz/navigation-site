// 测试推荐功能的简单脚本
// 在浏览器控制台中运行

async function testToggleRecommend(websiteId) {
  try {
    console.log(`测试切换网站 ${websiteId} 的推荐状态...`);
    
    const response = await fetch(`/api/websites/${websiteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-recommend" })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('推荐状态切换成功:', result);
    return result;
  } catch (error) {
    console.error('推荐状态切换失败:', error);
    throw error;
  }
}

// 使用示例：
// testToggleRecommend(1); // 切换 ID 为 1 的网站的推荐状态