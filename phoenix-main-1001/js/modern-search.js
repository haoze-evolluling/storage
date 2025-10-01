// 现代化搜索功能模块

// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google'
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: '百度'
    },
    bing: {
        name: '必应',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        icon: 'fas fa-duck'
    }
};

// 当前搜索引擎
let currentSearchEngine = 'google';

// 初始化搜索引擎设置
function initializeSearchEngineSettings() {
    // 从设置缓存中读取搜索引擎设置
    if (window.SettingsCache) {
        const settings = window.SettingsCache.getAllSettings();
        currentSearchEngine = settings.searchEngine || 'google';
    } else {
        // 回退到localStorage
        currentSearchEngine = localStorage.getItem('searchEngine') || 'google';
    }
}

// 搜索状态
let searchTimeout = null;

// 初始化现代化搜索功能
function initializeModernSearch() {
    // 初始化搜索引擎设置
    initializeSearchEngineSettings();
    
    const searchInput = document.getElementById('modern-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const submitBtn = document.getElementById('search-submit-btn');
    
    if (!searchInput) return;
    
    // 搜索输入事件
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // 按钮事件
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', performSearch);
    }
    
    // 自动聚焦搜索框
    setTimeout(() => {
        searchInput.focus();
    }, 500);
}

// 处理搜索输入
function handleSearchInput(e) {
    const query = e.target.value.trim();
    const clearBtn = document.getElementById('search-clear-btn');
    
    // 显示/隐藏清除按钮
    if (clearBtn) {
        clearBtn.style.display = query ? 'flex' : 'none';
    }
}

// 处理键盘事件
function handleSearchKeydown(e) {
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            performSearch();
            break;
            
        case 'Escape':
            clearSearch();
            break;
    }
}

// 清除搜索
function clearSearch() {
    const searchInput = document.getElementById('modern-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('modern-search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    // 判断是URL还是搜索
    if (isValidURL(query)) {
        performURLSearch(query);
    } else {
        performTextSearch(query);
    }
}

// 执行文本搜索
function performTextSearch(query) {
    const engine = searchEngines[currentSearchEngine];
    const searchURL = engine.url + encodeURIComponent(query);
    window.open(searchURL, '_blank');
    showMessage(`使用${engine.name}搜索：${query}`, 'info');
    
    // 清空搜索框
    clearSearch();
}

// 执行URL搜索
function performURLSearch(query) {
    const url = query.startsWith('http') ? query : 'https://' + query;
    window.open(url, '_blank');
    showMessage(`正在打开：${url}`, 'info');
    
    // 清空搜索框
    clearSearch();
}

// URL验证函数
function isValidURL(string) {
    try {
        // 检查是否包含协议
        if (string.startsWith('http://') || string.startsWith('https://')) {
            new URL(string);
            return true;
        }
        
        // 检查是否像域名（包含点号且不包含空格）
        if (string.includes('.') && !string.includes(' ')) {
            // 简单的域名格式检查
            const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
            return domainPattern.test(string);
        }
        
        return false;
    } catch (_) {
        return false;
    }
}

// 切换搜索引擎
function switchSearchEngine(engine) {
    if (searchEngines[engine]) {
        currentSearchEngine = engine;
        
        // 更新设置缓存
        if (window.SettingsCache) {
            window.SettingsCache.updateSetting('searchEngine', engine);
        } else {
            // 回退到localStorage
            localStorage.setItem('searchEngine', engine);
        }
        
        showMessage(`已切换到${searchEngines[engine].name}搜索`, 'info');
    }
}

// 获取当前搜索引擎
function getCurrentSearchEngine() {
    return currentSearchEngine;
}

// 获取所有搜索引擎
function getAllSearchEngines() {
    return searchEngines;
}

// 导出搜索功能
if (typeof window !== 'undefined') {
    window.modernSearch = {
        initializeModernSearch,
        initializeSearchEngineSettings,
        performSearch,
        switchSearchEngine,
        getCurrentSearchEngine,
        getAllSearchEngines,
        searchEngines,
        currentSearchEngine
    };
}
