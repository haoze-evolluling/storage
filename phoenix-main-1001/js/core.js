// 核心功能模块 - 应用初始化和基础功能

// 全局变量 - 将在设置模块中初始化
let showSeconds = true;
let use12HourFormat = false;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 首先初始化设置，确保其他模块能获取到正确的设置值
    initializeSettings();
    
    // 然后初始化其他功能
    initializeTime();
    initializeNavigation();
    initializeModernSearch();

    startTimeUpdate();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    
    console.log('新标签页已加载完成！');
}

// 初始化交互效果 - 已禁用
function initializeInteractiveEffects() {
    console.log('交互效果已禁用');
}

// 改变背景样式
function changeBackgroundStyle(style) {
    const root = document.documentElement;
    
    switch (style) {
        case 'gradient':
            root.style.setProperty('--bg-primary', '#FFAAAA'); // 系统默认背景颜色
            break;
        case 'solid':
            // 使用当前保存的纯色
            const settings = window.SettingsCache ? window.SettingsCache.getAllSettings() : { currentSolidColor: '#FF6666' };
            root.style.setProperty('--bg-primary', settings.currentSolidColor);
            break;
    }
    
    // 更新设置缓存
    if (window.SettingsCache) {
        window.SettingsCache.updateSetting('backgroundStyle', style);
    }
    
    showMessage('背景样式已更改', 'success');
}

// 键盘快捷键处理（已移除快捷访问相关功能）
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K：聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('modern-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape：清空搜索框
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('modern-search-input');
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
    
    // 数字键1-4：切换页面
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const sections = ['home', 'tools', 'settings'];
        const targetSection = sections[parseInt(e.key) - 1];
        const targetButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// 页面可见性变化处理已禁用

// 窗口大小变化处理
window.addEventListener('resize', () => {
    // 可以在这里添加响应式布局调整
    console.log('窗口大小已改变');
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误：', e.error);
});

// 确保页面完全加载
window.addEventListener('load', () => {
    console.log('页面资源加载完成');
    
    // 交互效果已禁用
});

// 恢复保存的设置
function restoreSettings() {
    // 这个函数现在由设置模块的 loadSettingsFromCache 函数处理
    // 保持函数存在以维持向后兼容性
    if (window.SettingsCache) {
        const settings = window.SettingsCache.getAllSettings();
        console.log('设置已从缓存恢复:', settings);
    }
}

// 页面加载完成后恢复设置
document.addEventListener('DOMContentLoaded', function() {
    restoreSettings();
});

// 监听设置变更事件
document.addEventListener('settingsChanged', function(event) {
    const { settingName, newValue } = event.detail;
    console.log(`设置已变更: ${settingName} = ${newValue}`);
    
    // 根据设置名称执行相应的更新
    switch (settingName) {
        case 'showSeconds':
            updateTime();
            break;
        case 'use12HourFormat':
            updateTime();
            break;
        case 'currentSolidColor':
            // 如果当前是纯色背景，立即应用新颜色
            const bgSelector = document.querySelector('.bg-selector');
            if (bgSelector && bgSelector.value === 'solid') {
                const root = document.documentElement;
                root.style.setProperty('--bg-primary', newValue);
            }
            break;
    }
});

// 导出核心功能到全局作用域
if (typeof window !== 'undefined') {
    window.newTabCore = {
        showSeconds,
        initializeApp,
        changeBackgroundStyle,
        restoreSettings
    };
}