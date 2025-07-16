// 测试推荐功能的简单脚本
// 在浏览器控制台中运行

async function testToggleRecommend(websiteId) {
  try {
    console.log(`测试切换网站 ${websiteId} 的推荐状态...`);
    
    // 先获取当前网站信息
    console.log('1. 获取当前网站信息...');
    const getResponse = await fetch(`/api/websites`);
    if (!getResponse.ok) {
      throw new Error(`获取网站列表失败: ${getResponse.status}`);
    }
    const websites = await getResponse.json();
    const website = websites.find(w => w.id == websiteId);
    if (!website) {
      throw new Error(`找不到 ID 为 ${websiteId} 的网站`);
    }
    console.log('当前网站信息:', website);
    
    // 尝试 PATCH 方法
    console.log('2. 尝试 PATCH 方法...');
    let response = await fetch(`/api/websites/${websiteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle-recommend" })
    });

    console.log(`PATCH 响应: ${response.status} ${response.statusText}`);

    // 如果 PATCH 失败，尝试 PUT
    if (!response.ok) {
      console.log('3. PATCH 失败，尝试 PUT 方法...');
      response = await fetch(`/api/websites/${websiteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...website,
          is_recommended: !website.is_recommended
        })
      });
      console.log(`PUT 响应: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('推荐状态切换成功:', result);
    return result;
  } catch (error) {
    console.error('推荐状态切换失败:', error);
    throw error;
  }
}

async function testBasicAPI() {
  try {
    console.log('测试基础 API...');
    
    // 测试获取网站列表
    const response = await fetch('/api/websites');
    console.log(`GET /api/websites: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const websites = await response.json();
      console.log(`成功获取 ${websites.length} 个网站`);
      console.log('前3个网站:', websites.slice(0, 3));
      return websites;
    } else {
      const errorText = await response.text();
      console.error('API 错误:', errorText);
    }
  } catch (error) {
    console.error('API 测试失败:', error);
  }
}

// 使用示例：
// testBasicAPI(); // 测试基础 API
// testToggleRecommend(1); // 切换 ID 为 1 的网站的推荐状态

console.log('推荐功能测试脚本已加载');
console.log('使用 testBasicAPI() 测试基础 API');
console.log('使用 testToggleRecommend(1) 测试推荐功能');