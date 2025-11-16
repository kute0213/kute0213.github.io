// 高级交互式组件和动画效果

// DOM元素加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    initMouseTrail();
    initScrollEffects();
    initInteractiveElements();
    initCountUpAnimations();
});

// 鼠标轨迹效果
function initMouseTrail() {
    const trailLength = 10;
    let trailElements = [];
    let lastMousePos = { x: 0, y: 0 };
    
    // 创建轨迹元素
    for (let i = 0; i < trailLength; i++) {
        const trailEl = document.createElement('div');
        trailEl.className = 'mouse-trail';
        trailEl.style.position = 'fixed';
        trailEl.style.width = `${10 - i * 0.8}px`;
        trailEl.style.height = `${10 - i * 0.8}px`;
        trailEl.style.borderRadius = '50%';
        trailEl.style.background = `rgba(0, 191, 255, ${1 - i * 0.1})`;
        trailEl.style.pointerEvents = 'none';
        trailEl.style.zIndex = '9999';
        trailEl.style.transform = 'translate(-50%, -50%)';
        trailEl.style.opacity = '0';
        document.body.appendChild(trailEl);
        trailElements.push(trailEl);
    }
    
    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        // 更新最后位置
        const newPos = { x: e.clientX, y: e.clientY };
        
        // 更新轨迹元素
        for (let i = trailElements.length - 1; i > 0; i--) {
            const prevPos = getElementPosition(trailElements[i - 1]);
            setElementPosition(trailElements[i], prevPos.x, prevPos.y);
            trailElements[i].style.opacity = '1';
        }
        
        // 更新第一个轨迹元素到鼠标位置
        setElementPosition(trailElements[0], newPos.x, newPos.y);
        trailElements[0].style.opacity = '1';
        
        lastMousePos = newPos;
    });
    
    // 获取元素位置
    function getElementPosition(el) {
        return {
            x: parseFloat(el.style.left) || 0,
            y: parseFloat(el.style.top) || 0
        };
    }
    
    // 设置元素位置
    function setElementPosition(el, x, y) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    }
    
    // 鼠标静止时淡出轨迹
    let mouseTimeout;
    document.addEventListener('mousemove', function() {
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(function() {
            trailElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '0';
                }, index * 50);
            });
        }, 1000);
    });
}

// 滚动触发效果
function initScrollEffects() {
    // 元素随滚动渐入
    const fadeElements = document.querySelectorAll('.fade-in-section');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
    
    // 视差滚动效果
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || 0.5);
            const yPos = -(scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 交互式元素初始化
function initInteractiveElements() {
    // 悬停效果增强
    enhanceHoverEffects();
    
    // 滚动进度条
    initScrollProgress();
    
    // 技能卡片展开效果
    initSkillCardExpand();
    
    // 项目过滤交互
    initProjectFilter();
}

// 增强悬停效果
function enhanceHoverEffects() {
    const interactiveElements = document.querySelectorAll('a, button, .card, .nav-link');
    
    interactiveElements.forEach(element => {
        // 为没有特定悬停类的元素添加基本效果
        if (!element.classList.contains('no-hover-effect')) {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
                
                // 轻微缩放
                this.style.transform = 'scale(1.03)';
                
                // 轻微提升
                this.style.boxShadow = '0 10px 20px rgba(0, 191, 255, 0.2)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        }
    });
}

// 滚动进度条
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, var(--neon-primary), var(--neon-secondary))';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.boxShadow = '0 0 10px var(--neon-primary)';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 技能卡片展开效果
function initSkillCardExpand() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const originalHeight = card.offsetHeight;
        
        // 添加展开内容容器（如果不存在）
        if (!card.querySelector('.skill-details')) {
            const details = document.createElement('div');
            details.className = 'skill-details';
            details.style.maxHeight = '0';
            details.style.overflow = 'hidden';
            details.style.transition = 'max-height 0.5s ease';
            
            // 添加一些默认内容
            const skillName = card.querySelector('.skill-title')?.textContent || '技能';
            details.innerHTML = `<p>这是关于${skillName}的详细信息。点击卡片可展开或收起。</p>`;
            card.appendChild(details);
        }
        
        // 添加点击事件
        card.addEventListener('click', function() {
            const details = this.querySelector('.skill-details');
            if (details.style.maxHeight === '0px' || !details.style.maxHeight) {
                details.style.maxHeight = details.scrollHeight + 'px';
            } else {
                details.style.maxHeight = '0';
            }
        });
    });
}

// 项目过滤交互增强
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.project-filter button');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活跃状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的活跃状态
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // 过滤项目
            projectCards.forEach(card => {
                // 添加动画效果
                card.style.transition = 'all 0.3s ease';
                
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.display = 'block';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    // 使用setTimeout确保动画完成后再隐藏
                    setTimeout(() => {
                        if (!card.classList.contains('active')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// 数字增长动画
function initCountUpAnimations() {
    const countElements = document.querySelectorAll('.count-up');
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target') || 100);
                const duration = parseInt(element.getAttribute('data-duration') || 2000);
                const start = 0;
                const increment = target / (duration / 16); // 60fps
                let current = start;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 16);
                
                // 添加额外文本（如果有）
                const suffix = element.getAttribute('data-suffix');
                if (suffix) {
                    element.textContent += suffix;
                }
                
                countObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    
    countElements.forEach(element => {
        countObserver.observe(element);
    });
}

// 页面加载动画
function initPageLoadAnimation() {
    // 创建加载覆盖层
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.background = 'var(--dark-color)';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.zIndex = '9999';
    loader.style.transition = 'opacity 0.5s ease';
    
    // 创建加载指示器
    const spinner = document.createElement('div');
    spinner.className = 'loader-spinner';
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '3px solid rgba(0, 191, 255, 0.3)';
    spinner.style.borderTop = '3px solid var(--neon-primary)';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // 添加加载文字
    const loaderText = document.createElement('div');
    loaderText.className = 'loader-text';
    loaderText.style.marginTop = '20px';
    loaderText.style.color = 'var(--neon-primary)';
    loaderText.style.fontSize = '16px';
    loaderText.textContent = '加载中...';
    
    // 组合元素
    const loaderContainer = document.createElement('div');
    loaderContainer.appendChild(spinner);
    loaderContainer.appendChild(loaderText);
    loader.appendChild(loaderContainer);
    
    // 添加到页面
    document.body.appendChild(loader);
    
    // 添加旋转动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // 页面加载完成后隐藏加载器
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 800);
    });
}

// 添加代码高亮效果
function initCodeHighlight() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 简单的代码高亮实现
        const code = block.textContent;
        
        // 定义一些简单的模式用于高亮
        const patterns = [
            { regex: /\b(function|return|const|let|var|if|else|for|while|true|false|null)\b/g, className: 'keyword' },
            { regex: /\"([^\"]*)\"/g, className: 'string' },
            { regex: /\/\/.*$/gm, className: 'comment' },
            { regex: /\b\d+\b/g, className: 'number' }
        ];
        
        let highlightedCode = code;
        
        // 应用高亮
        patterns.forEach((pattern, index) => {
            highlightedCode = highlightedCode.replace(pattern.regex, (match) => {
                return `<span class="${pattern.className}">${match}</span>`;
            });
        });
        
        // 更新内容
        block.innerHTML = highlightedCode;
        
        // 添加复制按钮
        addCopyButton(block);
    });
    
    // 添加复制按钮函数
    function addCopyButton(codeBlock) {
        const pre = codeBlock.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '5px 10px';
        button.style.background = 'var(--primary-color)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        
        // 设置pre为相对定位
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        // 复制功能
        button.addEventListener('click', function() {
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                this.textContent = '已复制!';
                setTimeout(() => {
                    this.textContent = '复制';
                }, 2000);
            });
        });
    }
}

// 初始化页面加载动画
initPageLoadAnimation();

// 如果页面有代码块，初始化代码高亮
if (document.querySelectorAll('pre code').length > 0) {
    initCodeHighlight();
}