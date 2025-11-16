// 动画效果JavaScript文件

// DOM元素加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initHoverAnimations();
    initTypingAnimation();
    initSkillBarAnimations();
});

// 滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about, .skills, .projects, .contact, .skill-card, .project-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 悬停动画
function initHoverAnimations() {
    // 为卡片元素添加悬停效果
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 191, 255, 0.2)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // 为按钮添加脉动效果
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        // 创建脉动元素
        const pulse = document.createElement('span');
        pulse.classList.add('pulse');
        button.appendChild(pulse);
        
        button.addEventListener('mouseenter', function() {
            pulse.style.animation = 'pulseEffect 1.5s infinite';
        });
        
        button.addEventListener('mouseleave', function() {
            pulse.style.animation = 'none';
        });
    });
    
    // 添加脉动效果样式
    addPulseStyle();
}

// 添加脉动效果CSS
function addPulseStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            border-radius: var(--border-radius);
            transform: scale(0);
            animation: none;
            pointer-events: none;
            z-index: -1;
        }
        
        @keyframes pulseEffect {
            0% {
                transform: scale(0);
                opacity: 0.8;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 打字动画效果
function initTypingAnimation() {
    // 如果页面中有打字动画元素，初始化它们
    const typingElements = document.querySelectorAll('.typing-animation');
    
    if (typingElements.length === 0) {
        // 如果没有现成的打字元素，在hero区域添加一个
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const originalText = heroSubtitle.textContent;
            heroSubtitle.innerHTML = '';
            heroSubtitle.classList.add('typing-animation');
            
            typeText(heroSubtitle, originalText, 50);
        }
    } else {
        typingElements.forEach(element => {
            const text = element.getAttribute('data-text') || element.textContent;
            element.innerHTML = '';
            typeText(element, text, 100);
        });
    }
}

// 打字效果函数
function typeText(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    // 添加光标
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);
    
    function type() {
        if (i < text.length) {
            // 在光标前插入文本
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
            setTimeout(type, speed);
        } else {
            // 打字完成后闪烁光标
            cursor.style.animation = 'blink 1s infinite';
        }
    }
    
    // 添加光标样式
    addCursorStyle();
    
    // 开始打字
    setTimeout(type, 500);
}

// 添加光标CSS
function addCursorStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .typing-cursor {
            color: var(--primary-color);
            font-weight: bold;
            animation: none;
        }
        
        @keyframes blink {
            0%, 50% {
                opacity: 1;
            }
            51%, 100% {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 技能条动画
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                const percentage = progressFill.style.width;
                
                // 重置宽度为0
                progressFill.style.width = '0';
                
                // 使用requestAnimationFrame确保动画流畅
                requestAnimationFrame(() => {
                    // 延迟一下开始动画
                    setTimeout(() => {
                        progressFill.style.transition = 'width 1.5s ease';
                        progressFill.style.width = percentage;
                    }, 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// 页面元素进入视口时的动画
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 获取元素上的动画类名
                const animationClass = entry.target.getAttribute('data-animation') || 'fadeInUp';
                
                entry.target.classList.add('animate__animated', `animate__${animationClass}`);
                
                // 如果有延迟属性
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.animationDelay = delay;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// 波浪动画效果
function initWaveAnimation() {
    const waveContainer = document.querySelector('.wave-container');
    
    if (waveContainer) {
        // 已经有波浪容器时的处理
        createWaves(waveContainer);
    } else {
        // 在hero区域底部添加波浪
        const hero = document.querySelector('.hero');
        if (hero) {
            const waveContainer = document.createElement('div');
            waveContainer.className = 'wave-container';
            waveContainer.style.position = 'absolute';
            bottom: 0;
            left: 0;
            width: '100%';
            height: '100px';
            overflow: 'hidden';
            z-index: '1';
            
            hero.appendChild(waveContainer);
            createWaves(waveContainer);
        }
    }
}

// 创建波浪
function createWaves(container) {
    const wave1 = document.createElement('div');
    const wave2 = document.createElement('div');
    
    wave1.className = 'wave wave-1';
    wave2.className = 'wave wave-2';
    
    container.appendChild(wave1);
    container.appendChild(wave2);
    
    // 添加波浪样式
    addWaveStyles();
}

// 添加波浪CSS
function addWaveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .wave {
            position: absolute;
            width: 200%;
            height: 100px;
            bottom: 0;
            left: 0;
            background: repeating-linear-gradient(
                90deg,
                rgba(0, 191, 255, 0.1) 0px,
                rgba(0, 191, 255, 0.1) 50px,
                rgba(0, 191, 255, 0.05) 50px,
                rgba(0, 191, 255, 0.05) 100px
            );
            animation: wave 15s linear infinite;
        }
        
        .wave-2 {
            opacity: 0.5;
            animation: wave 20s linear infinite reverse;
        }
        
        @keyframes wave {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加页面加载完成后的动画初始化
window.addEventListener('load', function() {
    animateOnScroll();
    initWaveAnimation();
});

// 动态背景效果
function initDynamicBackground() {
    const body = document.body;
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // 创建渐变背景
        const gradient = `radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%, 
            rgba(0, 191, 255, 0.15), 
            rgba(0, 191, 255, 0) 60%)`;
        
        // 应用渐变背景（可以添加到特定元素）
        document.documentElement.style.setProperty('--dynamic-gradient', gradient);
    });
    
    // 初始化渐变样式
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --dynamic-gradient: radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.15), rgba(0, 191, 255, 0) 60%);
        }
        
        .hero::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dynamic-gradient);
            transition: background 0.5s ease;
            z-index: 0;
        }
    `;
    document.head.appendChild(style);
}

// 初始化动态背景
initDynamicBackground();