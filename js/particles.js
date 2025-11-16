// 科技感粒子背景效果

class ParticleBackground {
    constructor(containerId = 'particle-container') {
        this.containerId = containerId;
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.config = {
            particleCount: 50,
            particleSpeed: 0.5,
            particleRadius: 2,
            lineDistance: 150,
            lineColor: 'rgba(0, 191, 255, 0.5)',
            particleColor: 'rgba(0, 191, 255, 0.8)',
            backgroundColor: 'transparent'
        };
        
        this.init();
    }
    
    init() {
        // 检查容器是否存在
        let container = document.getElementById(this.containerId);
        
        if (!container) {
            // 如果容器不存在，创建一个全屏容器
            container = document.createElement('div');
            container.id = this.containerId;
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '-1';
            document.body.appendChild(container);
        }
        
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // 设置canvas尺寸
        this.resizeCanvas();
        
        // 创建粒子
        this.createParticles();
        
        // 添加事件监听
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 开始动画
        this.animate();
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    createParticles() {
        this.particles = [];
        const rect = this.canvas.parentElement.getBoundingClientRect();
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = {
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                dx: (Math.random() - 0.5) * this.config.particleSpeed,
                dy: (Math.random() - 0.5) * this.config.particleSpeed,
                radius: Math.random() * this.config.particleRadius + 0.5,
                color: this.config.particleColor
            };
            
            this.particles.push(particle);
        }
    }
    
    animate() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        
        // 清除画布
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.dx;
            particle.y += particle.dy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > rect.width) {
                particle.dx = -particle.dx;
            }
            
            if (particle.y < 0 || particle.y > rect.height) {
                particle.dy = -particle.dy;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        
        // 绘制连线
        this.drawConnections();
        
        // 继续动画
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.lineDistance) {
                    // 根据距离调整连线透明度
                    const opacity = 1 - (distance / this.config.lineDistance);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.config.lineColor.replace('0.5', opacity.toString());
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    }
    
    // 销毁粒子背景
    destroy() {
        const container = document.getElementById(this.containerId);
        if (container && this.canvas) {
            container.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}

// 动态网格背景
class GridBackground {
    constructor(containerId = 'grid-container') {
        this.containerId = containerId;
        this.canvas = null;
        this.ctx = null;
        this.config = {
            gridSize: 40,
            gridColor: 'rgba(0, 191, 255, 0.1)',
            gridLineWidth: 1,
            backgroundColor: 'transparent'
        };
        
        this.init();
    }
    
    init() {
        // 检查容器是否存在
        let container = document.getElementById(this.containerId);
        
        if (!container) {
            // 如果容器不存在，创建一个全屏容器
            container = document.createElement('div');
            container.id = this.containerId;
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '-2';
            document.body.appendChild(container);
        }
        
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // 设置canvas尺寸
        this.resizeCanvas();
        
        // 绘制网格
        this.drawGrid();
        
        // 添加事件监听
        window.addEventListener('resize', () => this.resizeAndRedraw());
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resizeAndRedraw() {
        this.resizeCanvas();
        this.drawGrid();
    }
    
    drawGrid() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        
        // 清除画布
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        // 设置网格样式
        this.ctx.strokeStyle = this.config.gridColor;
        this.ctx.lineWidth = this.config.gridLineWidth;
        
        // 绘制垂直网格线
        for (let x = 0; x <= rect.width; x += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, rect.height);
            this.ctx.stroke();
        }
        
        // 绘制水平网格线
        for (let y = 0; y <= rect.height; y += this.config.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(rect.width, y);
            this.ctx.stroke();
        }
    }
    
    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.drawGrid();
    }
    
    // 销毁网格背景
    destroy() {
        const container = document.getElementById(this.containerId);
        if (container && this.canvas) {
            container.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resizeAndRedraw());
    }
}

// 初始化函数
function initParticleBackground() {
    // 创建网格背景
    const gridBackground = new GridBackground();
    
    // 创建粒子背景
    const particleBackground = new ParticleBackground();
    
    // 将实例存储在window对象上，以便外部访问
    window.particleEffects = {
        gridBackground,
        particleBackground
    };
    
    return { gridBackground, particleBackground };
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleBackground);
} else {
    // 如果DOM已经加载完成，直接初始化
    initParticleBackground();
}