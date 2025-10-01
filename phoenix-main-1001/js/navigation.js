// 导航功能模块

// 初始化导航功能
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetSection = button.dataset.section;
            
            // 更新按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 修复点击后焦点问题 - 移除焦点到容器
            setTimeout(() => {
                button.blur();
            }, 50);
            
            // 切换页面内容
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // 记录导航事件
            console.log(`切换到页面：${targetSection}`);
        });
        
        // 添加键盘导航支持
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // 添加触摸支持
    addTouchSupport(navButtons);
}

// 触摸支持已禁用
function addTouchSupport(buttons) {
    console.log('触摸支持已禁用');
}

// 添加面包屑导航（可选功能）
function addBreadcrumbNavigation() {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb-nav';
    breadcrumb.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        border: 1px solid rgba(255, 102, 102, 0.2);
        box-shadow: var(--shadow-lg);
        font-size: 14px;
        color: var(--text-secondary);
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
    `;
    
    document.body.appendChild(breadcrumb);
    
    // 监听页面切换，更新面包屑
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const sectionName = e.target.dataset.section;
            const sectionNames = {
                'home': '主页',
                'tools': '工具',
                'settings': '设置'
            };
            
            breadcrumb.textContent = `当前页面: ${sectionNames[sectionName]}`;
            breadcrumb.style.opacity = '1';
            
            setTimeout(() => {
                breadcrumb.style.opacity = '0';
            }, 2000);
        }
    });
}

// 添加页面历史记录功能
function addPageHistory() {
    const pageHistory = [];
    const maxHistoryLength = 10;
    
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const sectionName = e.target.dataset.section;
            
            // 添加到历史记录
            pageHistory.push({
                section: sectionName,
                timestamp: Date.now()
            });
            
            // 限制历史记录长度
            if (pageHistory.length > maxHistoryLength) {
                pageHistory.shift();
            }
            
            console.log('页面历史:', pageHistory);
        }
    });
    
    // 添加返回功能（Alt + Left）
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'ArrowLeft' && pageHistory.length > 1) {
            e.preventDefault();
            
            // 移除当前页面
            pageHistory.pop();
            
            // 获取上一页面
            const prevPage = pageHistory[pageHistory.length - 1];
            if (prevPage) {
                const targetButton = document.querySelector(`[data-section="${prevPage.section}"]`);
                if (targetButton) {
                    targetButton.click();
                }
            }
        }
    });
}

// 初始化扩展导航功能
document.addEventListener('DOMContentLoaded', () => {
    // 可选功能，根据需要启用
    // addBreadcrumbNavigation();
    // addPageHistory();
});

// 导出导航相关功能
if (typeof window !== 'undefined') {
    window.newTabNavigation = {
        initializeNavigation,
        addTouchSupport,
        addBreadcrumbNavigation,
        addPageHistory
    };
}