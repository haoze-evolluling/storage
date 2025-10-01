// 设置功能模块

// 设置缓存管理
const SettingsCache = {
    // 默认设置
    defaultSettings: {
        showSeconds: true,
        use12HourFormat: false,
        currentSolidColor: '#FFAAAA', // 系统默认背景颜色
        backgroundStyle: 'solid', // 固定为纯色背景
        settingsMenuState: {
            expandedGroups: [],
            activeTab: 'appearance'
        },
        searchEngine: 'google',
        lastUpdated: null
    },
    
    // 获取所有设置
    getAllSettings() {
        const saved = localStorage.getItem('newtabSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                return { ...this.defaultSettings, ...settings };
            } catch (e) {
                console.warn('设置解析失败，使用默认设置:', e);
                return this.defaultSettings;
            }
        }
        return this.defaultSettings;
    },
    
    // 保存设置
    saveSettings(settings) {
        const settingsToSave = {
            ...settings,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('newtabSettings', JSON.stringify(settingsToSave));
    },
    
    // 更新单个设置
    updateSetting(key, value) {
        const currentSettings = this.getAllSettings();
        currentSettings[key] = value;
        this.saveSettings(currentSettings);
        return currentSettings;
    },
    
    // 更新设置菜单状态
    updateMenuState(state) {
        const currentSettings = this.getAllSettings();
        currentSettings.settingsMenuState = { ...currentSettings.settingsMenuState, ...state };
        this.saveSettings(currentSettings);
    },
    
    // 重置所有设置
    resetSettings() {
        localStorage.removeItem('newtabSettings');
        return this.defaultSettings;
    }
};

// 初始化设置功能
function initializeSettings() {
    // 加载保存的设置
    loadSettingsFromCache();
    
    // 显示秒数设置
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.addEventListener('change', (e) => {
            const newShowSeconds = e.target.checked;
            changeShowSeconds(newShowSeconds);
        });
    }
    
    // 时间格式设置
    const timeFormatSelector = document.querySelector('.time-format-selector');
    if (timeFormatSelector) {
        timeFormatSelector.addEventListener('change', (e) => {
            const newFormat = e.target.value === '12';
            changeTimeFormat(newFormat);
        });
    }
    
    // 背景样式和颜色设置已移除，系统使用固定的 #FFAAAA 背景颜色
    
    // 搜索引擎设置
    initializeSearchEngineSelector();
    
    // 工具卡片点击事件
    initializeToolCards();
    
    
    // 添加重置设置功能
    addResetSettings();
    
    // 添加设置菜单状态管理
    initializeSettingsMenuState();
    
    // 添加设置变更监听
    addSettingsChangeListener();
}

// 从缓存加载设置
function loadSettingsFromCache() {
    const settings = SettingsCache.getAllSettings();
    
    // 更新全局变量
    showSeconds = settings.showSeconds;
    use12HourFormat = settings.use12HourFormat;
    currentSolidColor = settings.currentSolidColor;
    
    // 恢复UI状态
    restoreUIState(settings);
    
    // 应用背景样式
    applyBackgroundFromCache(settings);
    
    console.log('设置已从缓存加载:', settings);
}

// 初始化搜索引擎选择器
function initializeSearchEngineSelector() {
    const searchEngineSelector = document.querySelector('.search-engine-selector');
    if (searchEngineSelector) {
        // 从缓存恢复搜索引擎设置
        const settings = SettingsCache.getAllSettings();
        const savedEngine = settings.searchEngine || 'google';
        searchEngineSelector.value = savedEngine;
        
        // 监听搜索引擎变更
        searchEngineSelector.addEventListener('change', (e) => {
            const newEngine = e.target.value;
            changeSearchEngine(newEngine);
        });
    }
}

// 改变搜索引擎设置
function changeSearchEngine(newEngine) {
    SettingsCache.updateSetting('searchEngine', newEngine);
    
    // 更新搜索模块的搜索引擎
    if (window.modernSearch && window.modernSearch.switchSearchEngine) {
        window.modernSearch.switchSearchEngine(newEngine);
    }
    
    // 发送设置变更通知
    notifySettingsChange('searchEngine', newEngine);
    
    showMessage(`搜索引擎已切换到${getSearchEngineName(newEngine)}`, 'success');
}

// 获取搜索引擎名称
function getSearchEngineName(engineKey) {
    const engineNames = {
        google: 'Google',
        baidu: '百度',
        bing: '必应',
        duckduckgo: 'DuckDuckGo'
    };
    return engineNames[engineKey] || engineKey;
}

// 恢复UI状态
function restoreUIState(settings) {
    // 恢复显示秒数复选框
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.checked = settings.showSeconds;
    }
    
    // 恢复时间格式选择器
    const timeFormatSelector = document.querySelector('.time-format-selector');
    if (timeFormatSelector) {
        timeFormatSelector.value = settings.use12HourFormat ? '12' : '24';
    }
    
    // 恢复背景样式选择器
    const bgSelector = document.querySelector('.bg-selector');
    if (bgSelector) {
        bgSelector.value = settings.backgroundStyle;
    }
    
    // 恢复搜索引擎选择器
    const searchEngineSelector = document.querySelector('.search-engine-selector');
    if (searchEngineSelector) {
        searchEngineSelector.value = settings.searchEngine || 'google';
    }
    
    // 恢复颜色预览
    updateColorPreview(settings.currentSolidColor);
    
    // 恢复预设颜色激活状态
    updateActivePresetColor(settings.currentSolidColor);
    
    // 恢复设置菜单状态
    restoreSettingsMenuState(settings.settingsMenuState);
}

// 应用背景样式 - 固定使用 #FFAAAA 背景颜色
function applyBackgroundFromCache(settings) {
    const root = document.documentElement;
    // 系统固定使用 #FFAAAA 背景颜色，不允许用户修改
    root.style.setProperty('--bg-primary', '#FFAAAA');
}

// 恢复设置菜单状态
function restoreSettingsMenuState(menuState) {
    // 所有设置组默认展开，不再从缓存恢复折叠状态
    const settingGroups = document.querySelectorAll('.setting-group');
    settingGroups.forEach(group => {
        group.classList.add('expanded');
    });
    
    // 恢复活动标签
    if (menuState.activeTab) {
        const tab = document.querySelector(`[data-tab="${menuState.activeTab}"]`);
        if (tab) {
            tab.classList.add('active');
        }
    }
}

// 初始化设置菜单状态管理
function initializeSettingsMenuState() {
    // 移除设置组的展开/折叠功能，所有设置项默认展开
    const settingGroups = document.querySelectorAll('.setting-group');
    settingGroups.forEach(group => {
        group.classList.add('expanded'); // 确保所有设置组默认展开
        const header = group.querySelector('h3');
        if (header) {
            // 移除点击事件和指针样式，禁用折叠功能
            header.style.cursor = 'default';
            // 移除任何已存在的事件监听器
            header.replaceWith(header.cloneNode(true));
        }
    });
}

// 更新菜单状态缓存
function updateMenuStateCache() {
    // 由于移除了折叠功能，不再缓存展开状态
    // 保持函数存在但不再执行实际操作
    return;
}

// 添加设置变更监听
function addSettingsChangeListener() {
    // 监听所有设置控件的变更
    const settingControls = document.querySelectorAll(`
        .show-seconds, .time-format-selector, .bg-selector, 
        .color-picker-input, .preset-color, .search-engine-selector
    `);
    
    settingControls.forEach(control => {
        control.addEventListener('change', () => {
            updateSettingsCache();
        });
    });
    
    // 监听预设颜色点击
    const presetColors = document.querySelectorAll('.preset-color');
    presetColors.forEach(color => {
        color.addEventListener('click', () => {
            updateSettingsCache();
        });
    });
}

// 更新设置缓存
function updateSettingsCache() {
    const currentSettings = {
        showSeconds: document.querySelector('.show-seconds')?.checked ?? showSeconds,
        use12HourFormat: document.querySelector('.time-format-selector')?.value === '12',
        currentSolidColor: currentSolidColor,
        backgroundStyle: document.querySelector('.bg-selector')?.value || 'gradient',
        searchEngine: document.querySelector('.search-engine-selector')?.value || 'google'
    };
    
    SettingsCache.saveSettings(currentSettings);
    console.log('设置已更新到缓存:', currentSettings);
    
    // 同步全局变量
    syncGlobalVariables(currentSettings);
}

// 同步全局变量
function syncGlobalVariables(settings) {
    showSeconds = settings.showSeconds;
    use12HourFormat = settings.use12HourFormat;
    currentSolidColor = settings.currentSolidColor;
    
    // 通知其他模块设置已更新
    if (window.newTabCore && window.newTabCore.onSettingsUpdate) {
        window.newTabCore.onSettingsUpdate(settings);
    }
}

// 设置变更通知
function notifySettingsChange(settingName, newValue) {
    const event = new CustomEvent('settingsChanged', {
        detail: { settingName, newValue }
    });
    document.dispatchEvent(event);
}


// 改变显示秒数设置
function changeShowSeconds(newShowSeconds) {
    showSeconds = newShowSeconds;
    SettingsCache.updateSetting('showSeconds', newShowSeconds);
    updateTime();
    
    // 发送设置变更通知
    notifySettingsChange('showSeconds', newShowSeconds);
    
    showMessage(`${showSeconds ? '显示' : '隐藏'}秒数`, 'info');
}

// 改变时间格式设置
function changeTimeFormat(newUse12Hour) {
    use12HourFormat = newUse12Hour;
    SettingsCache.updateSetting('use12HourFormat', newUse12Hour);
    updateTime();
    
    // 发送设置变更通知
    notifySettingsChange('use12HourFormat', newUse12Hour);
    
    showMessage(`时间格式已设置为${use12HourFormat ? '12' : '24'}小时制`, 'success');
}

// 初始化工具卡片
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            const toolName = card.querySelector('h3').textContent;
            handleToolClick(toolName);
        });
        
        // 添加键盘支持
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // 使工具卡片可聚焦
        card.setAttribute('tabindex', '0');
    });
}

// 处理工具点击事件
function handleToolClick(toolName) {
    switch (toolName) {
        case '计算器':
            openCalculator();
            break;
        case '番茄钟':
            openPomodoroTimer();
            break;
        case '取色器':
            openColorPicker();
            break;
        case '二维码生成':
            openQRCodeGenerator();
            break;
        default:
            showMessage(`${toolName}功能待开发`, 'info');
    }
}

// 简单计算器
function openCalculator() {
    const result = prompt('请输入计算表达式（如：2+3*4）：');
    if (result) {
        try {
            // 安全的计算表达式求值
            const sanitized = result.replace(/[^0-9+\-*/.() ]/g, '');
            const calcResult = Function('"use strict"; return (' + sanitized + ')')();
            showMessage(`计算结果：${result} = ${calcResult}`, 'success');
            
            // 复制结果到剪贴板
            navigator.clipboard.writeText(calcResult.toString()).then(() => {
                showMessage('结果已复制到剪贴板', 'info');
            });
        } catch (error) {
            showMessage('无效的计算表达式', 'error');
        }
    }
}

// 番茄钟
function openPomodoroTimer() {
    const minutes = prompt('请输入番茄钟时间（分钟）：', '25');
    if (minutes && !isNaN(minutes) && parseInt(minutes) > 0) {
        startPomodoroTimer(parseInt(minutes));
    } else if (minutes !== null) {
        showMessage('请输入有效的分钟数', 'error');
    }
}

// 启动番茄钟
function startPomodoroTimer(minutes) {
    const totalSeconds = minutes * 60;
    let remainingSeconds = totalSeconds;
    
    // 创建番茄钟显示界面
    const timerDisplay = createTimerDisplay(minutes);
    
    const timerInterval = setInterval(() => {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        
        const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // 更新页面标题
        document.title = `${timeString} - 番茄钟`;
        
        // 更新显示界面
        updateTimerDisplay(timerDisplay, timeString, remainingSeconds, totalSeconds);
        
        remainingSeconds--;
        
        if (remainingSeconds < 0) {
            clearInterval(timerInterval);
            document.title = '新标签页';
            timerDisplay.remove();
            
            showMessage('番茄钟时间到！🍅', 'success');
            
            // 播放提示音
            playNotificationSound();
            
            // 发送浏览器通知
            sendBrowserNotification('番茄钟', '时间到了！休息一下吧。');
        }
    }, 1000);
    
    showMessage(`番茄钟已启动：${minutes}分钟`, 'success');
    
    return timerInterval;
}

// 创建番茄钟显示界面
function createTimerDisplay(minutes) {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'pomodoro-timer';
    timerDisplay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid rgba(255, 102, 102, 0.2);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        min-width: 200px;
        text-align: center;
        color: var(--text-primary);
    `;
    
    timerDisplay.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 10px;">🍅 番茄钟</div>
        <div class="timer-time" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${minutes}:00</div>
        <div class="timer-progress" style="width: 100%; height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden;">
            <div class="timer-progress-bar" style="height: 100%; background: var(--accent-color); width: 100%;"></div>
        </div>
        <button class="timer-cancel" style="margin-top: 10px; padding: 5px 10px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">取消</button>
    `;
    
    // 添加取消功能
    timerDisplay.querySelector('.timer-cancel').addEventListener('click', () => {
        timerDisplay.remove();
        document.title = '新标签页';
        showMessage('番茄钟已取消', 'info');
    });
    
    document.body.appendChild(timerDisplay);
    return timerDisplay;
}

// 更新番茄钟显示
function updateTimerDisplay(display, timeString, remaining, total) {
    const timeElement = display.querySelector('.timer-time');
    const progressBar = display.querySelector('.timer-progress-bar');
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (progressBar) {
        const progress = (remaining / total) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

// 取色器
function openColorPicker() {
    // 创建颜色选择器
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.opacity = '0';
    colorInput.style.position = 'absolute';
    colorInput.style.top = '-9999px';
    
    document.body.appendChild(colorInput);
    
    colorInput.addEventListener('change', (e) => {
        const color = e.target.value;
        const rgb = newTabUtils.hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const colorInfo = `
颜色值：${color}
RGB：rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
HSL：hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        navigator.clipboard.writeText(color).then(() => {
            showMessage(`颜色值已复制到剪贴板\n${colorInfo}`, 'success');
        });
        
        document.body.removeChild(colorInput);
    });
    
    colorInput.click();
}

// 二维码生成器
function openQRCodeGenerator() {
    const text = prompt('请输入要生成二维码的内容：');
    if (text && text.trim()) {
        generateQRCode(text.trim());
    }
}

// 生成二维码
function generateQRCode(text) {
    // 使用免费的二维码API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    
    // 创建模态框显示二维码
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); border-radius: 16px; padding: 30px; text-align: center; max-width: 300px; border: 1px solid rgba(255, 102, 102, 0.2);">
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">二维码生成器</h3>
            <img src="${qrUrl}" alt="二维码" style="border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display: none; color: var(--error-color); margin-bottom: 15px;">生成失败</div>
            <p style="word-break: break-all; font-size: 12px; color: var(--text-secondary); margin-bottom: 20px; max-height: 60px; overflow-y: auto;">${text}</p>
            <button onclick="this.closest('.qr-modal').remove()" style="background: var(--accent-color); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ESC键关闭
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// HSL颜色转换函数
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// 播放通知音
function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIcCEJ+w/LVfSsFJnjH9OGOPwcbWrLt3Z1NEAVcq+O30WCPBC9+yPCvigAlOabz5qpYFAlYvuzKhxIJJWzZ5r91jAKPVZjqqXgqYKzz4pBUEQpDnOCwb7sDEOqWU4Sn7Z5/jQKoM5rrv2wYExkOzAFRHpZqpWwwXLHvxJhNIgxEoeDUNV0/bR5WmNTYkVkT/VkzbXJzZVJtJR');
        audio.play();
    } catch (e) {
        console.log('无法播放提示音');
    }
}

// 发送浏览器通知
function sendBrowserNotification(title, body) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    }
}


// 添加重置设置功能
function addResetSettings() {
    const settingsContainer = document.querySelector('.settings-container');
    if (settingsContainer) {
        const resetGroup = document.createElement('div');
        resetGroup.className = 'setting-group';
        resetGroup.innerHTML = `
            <h3>重置</h3>
            <div class="setting-item">
                <label>恢复默认设置</label>
                <button class="reset-settings-btn" style="padding: 8px 16px; background: var(--error-color); color: white; border: none; border-radius: 8px; cursor: pointer;">重置</button>
            </div>
        `;
        
        settingsContainer.appendChild(resetGroup);
        
        resetGroup.querySelector('.reset-settings-btn').addEventListener('click', resetAllSettings);
    }
}

// 重置所有设置
function resetAllSettings() {
    if (confirm('确定要重置所有设置吗？这将清除所有自定义配置。')) {
        SettingsCache.resetSettings();
        showMessage('设置已重置，页面将刷新', 'info');
        setTimeout(() => location.reload(), 1000);
    }
}

// 调色盘功能 - 已禁用，系统使用固定的 #FFAAAA 背景颜色
let currentSolidColor = '#FFAAAA'; // 系统固定背景颜色

// 初始化调色盘功能
function initializeColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    const colorPreview = document.getElementById('color-preview');
    const presetColors = document.querySelectorAll('.preset-color');
    
    // 从缓存恢复颜色设置
    const settings = SettingsCache.getAllSettings();
    currentSolidColor = settings.currentSolidColor;
    
    // 设置初始颜色
    updateColorPreview(currentSolidColor);
    if (colorPicker) {
        colorPicker.value = currentSolidColor;
    }
    updateActivePresetColor(currentSolidColor);
    
    // 颜色选择器事件
    if (colorPicker) {
        colorPicker.addEventListener('change', (e) => {
            const newColor = e.target.value;
            currentSolidColor = newColor;
            updateColorPreview(newColor);
            updateActivePresetColor(newColor);
            applySolidBackground(newColor);
        });
    }
    
    // 预设颜色点击事件
    presetColors.forEach(presetColor => {
        presetColor.addEventListener('click', (e) => {
            const newColor = e.target.dataset.color;
            currentSolidColor = newColor;
            updateColorPreview(newColor);
            updateActivePresetColor(newColor);
            if (colorPicker) {
                colorPicker.value = newColor;
            }
            applySolidBackground(newColor);
        });
    });
}

// 切换调色盘显示/隐藏
function toggleColorPicker(show) {
    const colorPickerContainer = document.getElementById('color-picker-container');
    if (colorPickerContainer) {
        colorPickerContainer.style.display = show ? 'flex' : 'none';
    }
}

// 更新颜色预览
function updateColorPreview(color) {
    const colorPreview = document.getElementById('color-preview');
    if (colorPreview) {
        colorPreview.style.backgroundColor = color;
    }
}

// 更新激活的预设颜色
function updateActivePresetColor(color) {
    const presetColors = document.querySelectorAll('.preset-color');
    presetColors.forEach(presetColor => {
        if (presetColor.dataset.color === color) {
            presetColor.classList.add('active');
        } else {
            presetColor.classList.remove('active');
        }
    });
}

// 应用纯色背景
function applySolidBackground(color) {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', color);
    currentSolidColor = color;
    SettingsCache.updateSetting('currentSolidColor', color);
    
    // 发送设置变更通知
    notifySettingsChange('currentSolidColor', color);
    
    showMessage('背景颜色已更改', 'success');
}

// 保存设置到本地存储（保持向后兼容）
function saveSettings() {
    const settings = {
        showSeconds: showSeconds,
        use12HourFormat: use12HourFormat,
        currentSolidColor: currentSolidColor,
        backgroundStyle: document.querySelector('.bg-selector')?.value || 'gradient'
    };
    SettingsCache.saveSettings(settings);
}


// 导出设置相关功能
if (typeof window !== 'undefined') {
    window.SettingsCache = SettingsCache;
    window.newTabSettings = {
        initializeSettings,
        changeShowSeconds,
        changeTimeFormat,
        handleToolClick,
        openCalculator,
        openPomodoroTimer,
        openColorPicker,
        openQRCodeGenerator,
        resetAllSettings,
        initializeColorPicker,
        toggleColorPicker,
        applySolidBackground,
        loadSettingsFromCache,
        restoreUIState,
        applyBackgroundFromCache,
        initializeSearchEngineSelector,
        changeSearchEngine,
        getSearchEngineName
    };
}