// 性能优化相关代码

/**
 * 延迟加载图片
 */
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    image.classList.add('loaded');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => imageObserver.observe(image));
    } else {
        // 回退方案
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
            image.classList.add('loaded');
        });
    }
}

/**
 * 预加载关键资源
 */
function preloadCriticalResources() {
    // 预加载字体
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.href = 'fonts/Roboto-Regular.woff2';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
    
    // 预加载图片
    const criticalImages = [
        'images/avatar.webp',
        'images/hero-bg.webp'
    ];
    
    criticalImages.forEach(imgSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imgSrc;
        document.head.appendChild(link);
    });
}

/**
 * 代码分割和动态导入
 */
function dynamicImportComponents() {
    // 当滚动到指定区域时才加载图表组件
    if ('IntersectionObserver' in window) {
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // 动态加载Chart.js（如果尚未加载）
                    if (typeof Chart === 'undefined') {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js';
                        script.onload = () => {
                            // 初始化图表
                            if (window.initSkillCharts) {
                                window.initSkillCharts();
                            }
                        };
                        document.body.appendChild(script);
                    }
                    observer.disconnect();
                }
            }, { threshold: 0.1 });
            
            observer.observe(skillsSection);
        }
    }
}

/**
 * 减少重排和重绘的优化
 */
function optimizeRendering() {
    // 使用CSS动画代替JavaScript动画
    // 将频繁变化的元素设置为will-change
    const animateElements = document.querySelectorAll('.animate-on-scroll, .hover-effect');
    animateElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });
    
    // 批量DOM操作
    const optimizeDomUpdates = (updates) => {
        const fragment = document.createDocumentFragment();
        updates.forEach(update => {
            const element = document.createElement(update.tag);
            if (update.classes) element.className = update.classes;
            if (update.content) element.textContent = update.content;
            fragment.appendChild(element);
        });
        return fragment;
    };
    
    window.optimizeDomUpdates = optimizeDomUpdates;
}

/**
 * 监控性能指标
 */
function monitorPerformance() {
    if ('performance' in window && 'measure' in window.performance) {
        // 记录首次内容绘制(FCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntriesByName('first-contentful-paint');
            if (entries.length > 0) {
                console.log(`FCP: ${entries[0].startTime.toFixed(2)}ms`);
            }
        }).observe({ type: 'paint', buffered: true });
        
        // 记录最大内容绘制(LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // 记录首次输入延迟(FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            if (entries.length > 0) {
                console.log(`FID: ${entries[0].processingStart - entries[0].startTime}ms`);
            }
        }).observe({ type: 'first-input', buffered: true });
        
        // 记录累积布局偏移(CLS)
        let clsValue = 0;
        let clsEntries = [];
        
        new PerformanceObserver((entryList) => {
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                    console.log(`CLS: ${clsValue.toFixed(4)}`);
                }
            });
        }).observe({ type: 'layout-shift', buffered: true });
    }
}

/**
 * 缓存DOM引用
 */
function cacheDomReferences() {
    window.DOM = {
        body: document.body,
        header: document.querySelector('header'),
        nav: document.querySelector('nav'),
        sections: document.querySelectorAll('section'),
        footer: document.querySelector('footer'),
        backToTop: document.querySelector('.back-to-top')
    };
}

/**
 * 优化字体加载
 */
function optimizeFontLoading() {
    // 添加字体显示策略
    document.documentElement.style.fontDisplay = 'swap';
    
    // 使用CSS字体显示选项
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-display: swap;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 减少主线程阻塞
 */
function reduceMainThreadBlocking() {
    // 将非关键JavaScript移至后台线程
    if ('Worker' in window) {
        // 创建Web Worker进行复杂计算
        // 例如粒子效果、动画计算等
        try {
            const particleWorker = new Worker('js/particle-worker.js');
            window.particleWorker = particleWorker;
            
            particleWorker.postMessage({
                action: 'initialize',
                width: window.innerWidth,
                height: window.innerHeight
            });
            
            particleWorker.onmessage = (e) => {
                // 处理来自Worker的消息
                if (e.data.type === 'particles') {
                    // 更新粒子位置
                }
            };
        } catch (error) {
            console.warn('Web Worker not supported, falling back to main thread');
        }
    }
}

/**
 * 响应式图片处理
 */
function responsiveImages() {
    // 确保所有图片都有适当的srcset和sizes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.srcset) {
            const src = img.src;
            const ext = src.split('.').pop();
            const base = src.replace(`.${ext}`, '');
            
            // 假设我们有不同尺寸的图片版本
            img.srcset = `${base}-400.${ext} 400w, ${base}-800.${ext} 800w, ${base}-1200.${ext} 1200w`;
            img.sizes = '(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px';
        }
    });
}

/**
 * 初始化性能优化
 */
function initPerformanceOptimizations() {
    // 立即执行的优化
    cacheDomReferences();
    optimizeFontLoading();
    preloadCriticalResources();
    
    // DOM内容加载完成后执行
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoadImages();
        optimizeRendering();
        dynamicImportComponents();
        responsiveImages();
    });
    
    // 页面加载完成后执行
    window.addEventListener('load', () => {
        monitorPerformance();
        reduceMainThreadBlocking();
        
        // 通知用户页面已准备就绪
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    });
}

// 导出函数
window.initPerformanceOptimizations = initPerformanceOptimizations;

// 立即初始化
initPerformanceOptimizations();
