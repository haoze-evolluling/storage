// 工具函数模块

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 350px;
        white-space: pre-line;
        box-shadow: var(--shadow-lg);
        border: 1px solid rgba(255, 102, 102, 0.2);
        transform: translateX(400px);
        word-wrap: break-word;
    `;
    
    // 设置背景颜色
    const colors = {
        success: '#FF6666',
        error: '#FF6666',
        warning: '#FF6666',
        info: '#FF6666'
    };
    messageDiv.style.backgroundColor = colors[type] || colors.info;
    
    // 添加图标
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="flex-shrink: 0; font-size: 16px;">${icons[type] || icons.info}</span>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    messageDiv.style.transform = 'translateX(0)';
    
    // 自动隐藏
    const hideTimeout = setTimeout(() => {
        hideMessage(messageDiv);
    }, type === 'error' ? 5000 : 3000);
    
    // 点击隐藏
    messageDiv.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideMessage(messageDiv);
    });
    
    // 悬停暂停自动隐藏
    messageDiv.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
    });
    
    messageDiv.addEventListener('mouseleave', () => {
        setTimeout(() => hideMessage(messageDiv), 1000);
    });
}

// 隐藏消息
function hideMessage(messageDiv) {
    if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
    }
}

// 防抖函数
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 深拷贝函数
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 格式化时间差
function formatTimeDiff(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    if (seconds > 30) return `${seconds}秒前`;
    return '刚刚';
}

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// URL验证函数
function isValidURL(string) {
    try {
        new URL(string.startsWith('http') ? string : 'https://' + string);
        return true;
    } catch (_) {
        // 检查是否像域名
        const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return domainPattern.test(string) || string.includes('.');
    }
}

// 检查元素是否在视口中
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 平滑滚动到元素
function scrollToElement(element, duration = 1000) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// 设备检测
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
        isTablet: /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
        isIOS: /iPad|iPhone|iPod/.test(userAgent),
        isAndroid: /Android/.test(userAgent),
        isWindows: /Windows/.test(platform),
        isMac: /Mac/.test(platform),
        isLinux: /Linux/.test(platform)
    };
}

// 浏览器能力检测
function getBrowserCapabilities() {
    return {
        supportsLocalStorage: typeof(Storage) !== 'undefined',
        supportsServiceWorker: 'serviceWorker' in navigator,
        supportsWebGL: (() => {
            try {
                const canvas = document.createElement('canvas');
                return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
            } catch (e) {
                return false;
            }
        })(),
        supportsWebRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        supportsNotifications: 'Notification' in window,
        supportsGeolocation: 'geolocation' in navigator,
        supportsClipboard: !!(navigator.clipboard && navigator.clipboard.writeText),
        supportsTouchEvents: 'ontouchstart' in window,
        supportsPointerEvents: 'onpointerdown' in window,
        supportsIntersectionObserver: 'IntersectionObserver' in window,
        supportsResizeObserver: 'ResizeObserver' in window
    };
}

// 颜色工具函数
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#FF6666';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

// 随机颜色生成
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// 颜色渐变生成
function generateGradientColors(baseColor, steps = 5) {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [baseColor];
    
    const colors = [];
    for (let i = 0; i < steps; i++) {
        const factor = i / (steps - 1);
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        colors.push(rgbToHex(r, g, b));
    }
    return colors;
}

// 本地存储工具
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('存储失败:', e);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('读取失败:', e);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('删除失败:', e);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('清空失败:', e);
            return false;
        }
    },
    
    size() {
        return localStorage.length;
    },
    
    keys() {
        return Object.keys(localStorage);
    }
};

// 事件总线
class EventBus {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        
        if (callback) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        } else {
            delete this.events[event];
        }
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error('事件回调执行失败:', e);
            }
        });
    }
    
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

// 创建全局事件总线实例
const eventBus = new EventBus();



// 性能监控
const performance = {
    measureTime(name, fn) {
        const start = Date.now();
        const result = fn();
        const end = Date.now();
        console.log(`${name} 耗时: ${end - start}ms`);
        return result;
    },
    
    measureAsyncTime(name, asyncFn) {
        const start = Date.now();
        return asyncFn().then(result => {
            const end = Date.now();
            console.log(`${name} 耗时: ${end - start}ms`);
            return result;
        });
    },
    
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                used: Math.round(window.performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
};

// 错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise拒绝:', e.reason);
    // 可以在这里添加错误上报逻辑
});

// 导出工具函数
if (typeof window !== 'undefined') {
    window.newTabUtils = {
        showMessage,
        hideMessage,
        debounce,
        throttle,
        deepClone,
        formatFileSize,
        formatTimeDiff,
        generateUniqueId,
        isValidURL,
        isElementInViewport,
        scrollToElement,
        getDeviceInfo,
        getBrowserCapabilities,
        hexToRgb,
        rgbToHex,
        getContrastColor,
        generateRandomColor,
        generateGradientColors,
        storage,
        eventBus,
        performance
    };
}
