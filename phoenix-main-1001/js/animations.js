// 动画效果管理模块

// 动画管理器
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isProcessingQueue = false;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupPageTransitions();
        this.setupHoverEffects();
        this.setupTimeAnimations();
        this.setupSearchAnimations();
        this.setupParticleEffects();
        this.setupBackgroundAnimations();
        this.setupRippleEffects();
    }

    // 滚动动画设置
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // 添加延迟动画
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        }, observerOptions);

        // 观察所有需要滚动动画的元素
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    // 页面切换动画
    setupPageTransitions() {
        const sections = document.querySelectorAll('.section');
        const navButtons = document.querySelectorAll('.nav-btn');

        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetSection = button.dataset.section;
                const currentSection = document.querySelector('.section.active');
                const targetElement = document.getElementById(targetSection);

                if (currentSection && targetElement && currentSection !== targetElement) {
                    this.animatePageTransition(currentSection, targetElement);
                }
            });
        });
    }

    // 执行页面切换动画
    animatePageTransition(currentSection, targetSection) {
        // 添加过渡类
        currentSection.classList.add('page-transition-out');
        targetSection.classList.add('page-transition-in');

        // 延迟切换
        setTimeout(() => {
            currentSection.classList.remove('active', 'page-transition-out');
            targetSection.classList.add('active');
            targetSection.classList.remove('page-transition-in');

            // 触发新页面的滚动动画
            this.triggerScrollAnimations(targetSection);
        }, 300);
    }

    // 触发滚动动画
    triggerScrollAnimations(container) {
        const elements = container.querySelectorAll('.scroll-reveal');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, index * 100);
        });
    }

    // 悬停效果设置
    setupHoverEffects() {
        // 为卡片添加悬停效果
        document.querySelectorAll('.tool-card').forEach(card => {
            this.addHoverEffect(card);
        });

        // 为按钮添加悬停效果
        document.querySelectorAll('.nav-btn, .search-submit-btn, .search-clear-btn').forEach(btn => {
            this.addButtonHoverEffect(btn);
        });
    }

    // 添加悬停效果
    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-4px)';
            element.style.boxShadow = 'var(--shadow-xl)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = 'var(--shadow-lg)';
        });
    }

    // 添加按钮悬停效果
    addButtonHoverEffect(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.05)';
        });
    }

    // 时间动画设置
    setupTimeAnimations() {
        const timeElement = document.getElementById('current-time');
        if (!timeElement) return;

        let lastTime = '';
        
        // 监听时间更新
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childNodes' && mutation.target.textContent !== lastTime) {
                    this.animateTimeChange(timeElement, lastTime, mutation.target.textContent);
                    lastTime = mutation.target.textContent;
                }
            });
        });

        observer.observe(timeElement, { childList: true, subtree: true });
    }

    // 时间变化动画
    animateTimeChange(element, oldTime, newTime) {
        if (!oldTime || oldTime === newTime) return;

        // 添加数字翻转动画
        element.classList.add('number-flip');
        
        setTimeout(() => {
            element.classList.remove('number-flip');
        }, 300);
    }

    // 搜索框动画设置
    setupSearchAnimations() {
        const searchInput = document.getElementById('modern-search-input');
        const searchBox = document.querySelector('.modern-search-box');
        const searchIcon = document.querySelector('.search-icon-wrapper i');

        if (!searchInput || !searchBox || !searchIcon) return;

        // 聚焦动画
        searchInput.addEventListener('focus', () => {
            searchBox.classList.add('search-focus');
            searchIcon.classList.add('search-icon-spin');
        });

        searchInput.addEventListener('blur', () => {
            searchBox.classList.remove('search-focus');
            searchIcon.classList.remove('search-icon-spin');
        });

        // 输入动画
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                searchBox.style.transform = 'scale(1.02)';
            } else {
                searchBox.style.transform = 'scale(1)';
            }
        });
    }

    // 粒子效果设置
    setupParticleEffects() {
        // 只在桌面端启用粒子效果
        if (window.innerWidth > 768) {
            this.createParticles();
        }
    }

    // 创建粒子效果
    createParticles() {
        const container = document.querySelector('.container');
        if (!container) return;

        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            
            container.appendChild(particle);
        }
    }

    // 背景动画设置
    setupBackgroundAnimations() {
        const body = document.body;
        
        // 添加渐变流动效果
        body.classList.add('gradient-flow');
        
        // 鼠标移动视差效果
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            // 轻微的背景移动效果
            body.style.backgroundPosition = `${x * 2}% ${y * 2}%`;
        });
    }

    // 添加波纹效果
    addRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 为所有可点击元素添加波纹效果
    setupRippleEffects() {
        const clickableElements = document.querySelectorAll('.nav-btn, .tool-card, .search-submit-btn, .search-clear-btn');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.addRippleEffect(element, e);
            });
        });
    }


    // 脉冲动画
    addPulseAnimation(element) {
        element.classList.add('pulse');
    }

    removePulseAnimation(element) {
        element.classList.remove('pulse');
    }

    // 成功动画
    showSuccessAnimation(element) {
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 600);
    }

    // 错误动画
    showErrorAnimation(element) {
        element.classList.add('error-animation');
        setTimeout(() => {
            element.classList.remove('error-animation');
        }, 500);
    }

    // 打字机效果
    typewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        element.classList.add('typewriter');
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i > text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.classList.remove('typewriter');
                }, 1000);
            }
        }, speed);
    }

    // 弹跳进入效果
    bounceIn(element) {
        element.classList.add('bounce-in');
        setTimeout(() => {
            element.classList.remove('bounce-in');
        }, 600);
    }

    // 滑入效果
    slideInUp(element) {
        element.classList.add('slide-in-up');
        setTimeout(() => {
            element.classList.remove('slide-in-up');
        }, 500);
    }

    // 旋转进入效果
    rotateIn(element) {
        element.classList.add('rotate-in');
        setTimeout(() => {
            element.classList.remove('rotate-in');
        }, 600);
    }

    // 缩放进入效果
    zoomIn(element) {
        element.classList.add('zoom-in');
        setTimeout(() => {
            element.classList.remove('zoom-in');
        }, 400);
    }

    // 淡入淡出切换
    fadeInOut(element) {
        element.classList.add('fade-in-out');
    }

    stopFadeInOut(element) {
        element.classList.remove('fade-in-out');
    }

    // 销毁动画管理器
    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        // 清理粒子
        document.querySelectorAll('.particle').forEach(particle => {
            particle.remove();
        });
    }
}

// 初始化动画管理器
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AnimationManager();
});

// 窗口大小变化时重新初始化
window.addEventListener('resize', () => {
    if (animationManager) {
        animationManager.destroy();
        animationManager = new AnimationManager();
    }
});

// 导出动画管理器
if (typeof window !== 'undefined') {
    window.AnimationManager = AnimationManager;
    window.animationManager = animationManager;
}
