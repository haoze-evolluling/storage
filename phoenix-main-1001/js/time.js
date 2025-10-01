// 时间显示功能模块

// 获取全局设置变量
function getShowSeconds() {
    return window.newTabCore ? window.newTabCore.showSeconds : true;
}

function getUse12HourFormat() {
    return window.newTabCore ? window.newTabCore.use12HourFormat : false;
}

// 初始化时间显示
function initializeTime() {
    updateTime();
    updateShowSecondsCheckbox();
    updateTimeFormatSelector();
    
    // 添加时间点击交互
    addTimeInteraction();
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // 格式化时间
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(getShowSeconds() && { second: '2-digit' }),
        hour12: getUse12HourFormat()
    };
    
    const timeString = now.toLocaleTimeString('zh-CN', timeOptions);
    
    // 格式化日期
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    const dateString = now.toLocaleDateString('zh-CN', dateOptions);
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    
    // 更新页面标题显示时间
    updatePageTitle(timeString);
}

// 启动时间实时更新
function startTimeUpdate() {
    // 立即更新一次
    updateTime();
    
    // 设置定时器，根据是否显示秒数来决定更新频率
    const updateInterval = getShowSeconds() ? 1000 : 60000; // 显示秒数时每秒更新，否则每分钟更新
    
    // 使用setInterval实现实时更新
    setInterval(() => {
        updateTime();
    }, updateInterval);
    
    console.log('时间实时更新已启动，更新间隔：' + (getShowSeconds() ? '1秒' : '1分钟'));
}

// 更新显示秒数复选框状态
function updateShowSecondsCheckbox() {
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.checked = getShowSeconds();
    }
}

// 时间交互效果已禁用
function addTimeInteraction() {
    console.log('时间交互效果已禁用');
}

// 切换时间格式
function toggleTimeFormat() {
    const newFormat = !getUse12HourFormat();
    
    // 更新全局变量
    if (window.newTabCore) {
        window.newTabCore.use12HourFormat = newFormat;
    }
    
    localStorage.setItem('use12HourFormat', newFormat);
    updateTime();
    updateTimeFormatSelector();
    
    showMessage(`已切换到${newFormat ? '12' : '24'}小时制`, 'info');
}

// 更新时间格式选择器状态
function updateTimeFormatSelector() {
    const timeFormatSelector = document.querySelector('.time-format-selector');
    if (timeFormatSelector) {
        timeFormatSelector.value = getUse12HourFormat() ? '12' : '24';
    }
}



// 复制时间到剪贴板
function copyTimeToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`已复制: ${text}`, 'success');
    }).catch(() => {
        showMessage('复制失败', 'error');
    });
}

// 获取年内第几周
function getWeekOfYear(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// 获取年内第几天
function getDayOfYear(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((date - firstDayOfYear) / 86400000) + 1;
}

// 更新页面标题
function updatePageTitle(timeString) {
    if (document.visibilityState === 'hidden') {
        document.title = `${timeString} - 新标签页`;
    } else {
        document.title = '新标签页';
    }
}

// 添加时间主题功能
function addTimeTheme() {
    const now = new Date();
    const hour = now.getHours();
    const timeDisplay = document.querySelector('.time-display');
    
    if (timeDisplay) {
        // 移除之前的时间主题类
        timeDisplay.classList.remove('morning', 'afternoon', 'evening', 'night');
        
        // 根据时间添加主题
        if (hour >= 6 && hour < 12) {
            timeDisplay.classList.add('morning');
        } else if (hour >= 12 && hour < 18) {
            timeDisplay.classList.add('afternoon');
        } else if (hour >= 18 && hour < 22) {
            timeDisplay.classList.add('evening');
        } else {
            timeDisplay.classList.add('night');
        }
    }
}

// 倒计时功能
function startCountdown(targetDate, message = '目标时间到达！') {
    const target = new Date(targetDate);
    
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const difference = target - now;
        
        if (difference <= 0) {
            clearInterval(countdownInterval);
            showMessage(message, 'success');
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        console.log(`倒计时: ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`);
    }, 1000);
    
    return countdownInterval;
}

// 导出时间相关功能
if (typeof window !== 'undefined') {
    window.newTabTime = {
        initializeTime,
        updateTime,
        startTimeUpdate,
        updateShowSecondsCheckbox,
        updateTimeFormatSelector,
        toggleTimeFormat,
        addTimeInteraction,
        copyTimeToClipboard,
        addTimeTheme,
        startCountdown
    };
}
