// 粒子效果Web Worker

let particles = [];
let canvasWidth = 800;
let canvasHeight = 600;
let animationId = null;

/**
 * 初始化粒子
 */
function initParticles() {
    particles = [];
    const particleCount = Math.floor(canvasWidth * canvasHeight / 10000); // 动态计算粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(100, 150, 255, ${Math.random() * 0.5 + 0.2})`
        });
    }
}

/**
 * 更新粒子位置
 */
function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 更新位置
        p.x += p.speedX;
        p.y += p.speedY;
        
        // 边界检测
        if (p.x < 0 || p.x > canvasWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > canvasHeight) p.speedY *= -1;
    }
    
    // 发送更新后的粒子数据到主线程
    self.postMessage({
        type: 'particles',
        data: particles
    });
    
    // 继续动画循环
    animationId = requestAnimationFrame(updateParticles);
}

/**
 * 处理来自主线程的消息
 */
self.addEventListener('message', (e) => {
    const { action, width, height } = e.data;
    
    switch (action) {
        case 'initialize':
            canvasWidth = width;
            canvasHeight = height;
            initParticles();
            updateParticles();
            break;
            
        case 'resize':
            canvasWidth = width;
            canvasHeight = height;
            // 根据新尺寸重新初始化粒子
            initParticles();
            break;
            
        case 'stop':
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            break;
            
        case 'start':
            if (!animationId) {
                updateParticles();
            }
            break;
    }
});

/**
 * 处理Worker终止
 */
self.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
