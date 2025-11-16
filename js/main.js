// 主JavaScript文件

// DOM元素加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化功能
    initNavbar();
    initSmoothScroll();
    initBackToTop();
    initProjectFilter();
    initContactForm();
    
    // 延迟加载图表以提高初始页面加载性能
    setTimeout(() => {
        // 粒子效果通过performance.js中的Web Worker处理
        if (window.initParticleBackground) {
            window.initParticleBackground();
        }
    }, 500);
    
    initLoadingAnimation();
});

// 导航栏功能初始化
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 更新活动导航项
        updateActiveNavItem();
    });
    
    // 移动端菜单切换
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
        
        // 防止背景滚动
        document.body.classList.toggle('no-scroll');
    });
    
    // 点击导航项关闭菜单
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // 更新活动导航项
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 初始调用一次
    updateActiveNavItem();
}

// 平滑滚动功能
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 项目过滤功能
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // 过滤项目卡片
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    // 显示卡片并添加动画
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // 隐藏卡片
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 联系表单处理
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 模拟表单提交
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // 显示加载状态
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            
            // 模拟API调用延迟
            setTimeout(() => {
                // 重置表单
                contactForm.reset();
                
                // 显示成功消息
                submitButton.innerHTML = '<i class="fas fa-check"></i> 发送成功';
                
                // 恢复按钮状态
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 2000);
            }, 1500);
        });
    }
}

// 初始化雷达图 - 通过动态导入Chart.js以优化性能
function initRadarChart() {
    const ctx = document.getElementById('skillsRadarChart');
    
    if (ctx) {
        // 创建一个函数来初始化图表，供performance.js动态导入后调用
        window.initSkillCharts = function() {
            try {
                // 检查Chart是否已加载
                if (typeof Chart !== 'undefined') {
                    new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: ['前端开发', '后端开发', '数据库', '移动开发', 'DevOps', 'UI设计'],
                            datasets: [{
                                label: '技能水平',
                                data: [90, 85, 80, 75, 70, 65],
                                backgroundColor: 'rgba(0, 191, 255, 0.2)',
                                borderColor: 'rgba(0, 191, 255, 1)',
                                pointBackgroundColor: 'rgba(0, 191, 255, 1)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(0, 191, 255, 1)'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: {
                                duration: 1000,
                                easing: 'easeOutQuart'
                            },
                            scales: {
                                r: {
                                    angleLines: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    },
                                    pointLabels: {
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        font: {
                                            size: 14
                                        }
                                    },
                                    ticks: {
                                        backdropColor: 'transparent',
                                        color: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }
                                }
                            }
                        }
                    });
                } else {
                    console.warn('Chart.js 尚未加载，将等待动态导入完成');
                }
            } catch (error) {
                console.error('雷达图初始化失败:', error);
            }
        };
    }
}

// 加载动画
function initLoadingAnimation() {
    // 创建加载元素
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = '<div class="loading-spinner"></div>';
    document.body.prepend(loadingElement);
    
    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingElement.classList.add('fade-out');
            setTimeout(() => {
                loadingElement.remove();
            }, 500);
        }, 800);
    });
}

// 初始化粒子效果
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    if (!particlesContainer) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // 随机粒子属性
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // 设置粒子样式
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary-color);
            border-radius: 50%;
            top: ${y}%;
            left: ${x}%;
            opacity: ${opacity};
            animation: float ${duration}s linear infinite ${delay}s;
            box-shadow: 0 0 ${size * 3}px var(--primary-color);
            pointer-events: none;
            z-index: 0;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // 添加浮动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10%, 90% {
                opacity: var(--opacity, 0.5);
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 使用防抖优化窗口大小变化事件
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 确保移动菜单在窗口变大时关闭
        if (window.innerWidth > 992) {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle && menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    document.body.classList.remove('no-scroll');
                }
            }
        }
        
        // 通知Web Worker调整粒子大小
        if (window.particleWorker) {
            window.particleWorker.postMessage({
                action: 'resize',
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }, 250); // 250ms防抖延迟，减少性能消耗
});

// 添加鼠标悬停效果到交互元素
function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.btn, .social-link, .filter-btn, .action-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// 页面加载后添加悬停效果
window.addEventListener('load', addHoverEffects);