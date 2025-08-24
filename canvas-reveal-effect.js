// Canvas Reveal Effect for Projects Section
class CanvasRevealEffect {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            animationSpeed: options.animationSpeed || 0.4,
            opacities: options.opacities || [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
            colors: options.colors || [[0, 255, 255]],
            dotSize: options.dotSize || 3,
            showGradient: options.showGradient !== false,
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.time = 0;
        this.dots = [];
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.generateDots();
        this.animate();
        this.handleResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    generateDots() {
        const rect = this.container.getBoundingClientRect();
        const totalSize = 4;
        const cols = Math.ceil(rect.width / totalSize);
        const rows = Math.ceil(rect.height / totalSize);
        
        this.dots = [];
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * totalSize;
                const y = j * totalSize;
                const distance = Math.sqrt(
                    Math.pow(x - rect.width / 2, 2) + 
                    Math.pow(y - rect.height / 2, 2)
                );
                
                const dot = {
                    x: x,
                    y: y,
                    size: this.options.dotSize,
                    distance: distance,
                    randomOffset: Math.random(),
                    colorIndex: Math.floor(Math.random() * this.options.colors.length),
                    opacityIndex: Math.floor(Math.random() * this.options.opacities.length)
                };
                
                this.dots.push(dot);
            }
        }
    }
    
    animate() {
        this.time += this.options.animationSpeed * 0.016; // 60fps
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.dots.forEach(dot => {
            const introOffset = dot.distance * 0.01 + (dot.randomOffset * 0.15);
            const shouldShow = this.time > introOffset;
            const fadeOut = Math.max(0, 1 - (this.time - introOffset - 0.1) * 1.25);
            
            if (shouldShow && fadeOut > 0) {
                const color = this.options.colors[dot.colorIndex];
                const opacity = this.options.opacities[dot.opacityIndex] * fadeOut;
                
                this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.generateDots();
        });
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.container) {
            this.container.removeChild(this.canvas);
        }
    }
}

// Project Card with Canvas Reveal Effect
class ProjectCard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            title: options.title || 'Project Title',
            description: options.description || 'Project description',
            category: options.category || 'Category',
            colors: options.colors || [[0, 255, 255]],
            animationSpeed: options.animationSpeed || 0.4,
            ...options
        };
        
        this.isHovered = false;
        this.canvasEffect = null;
        
        this.init();
    }
    
    init() {
        this.createCard();
        this.setupEventListeners();
    }
    
    createCard() {
        this.container.innerHTML = `
            <div class="project-card-inner">
                <div class="project-card-content">
                    <div class="project-icon">
                        <svg width="66" height="65" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696" 
                                  stroke="currentColor" stroke-width="15" stroke-miterlimit="3.86874" stroke-linecap="round" 
                                  style="mix-blend-mode: darken"/>
                        </svg>
                    </div>
                    <h3 class="project-title">${this.options.title}</h3>
                    <p class="project-description">${this.options.description}</p>
                    <span class="project-category">${this.options.category}</span>
                </div>
                <div class="project-card-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                </div>
                <div class="canvas-container"></div>
            </div>
        `;
        
        this.canvasContainer = this.container.querySelector('.canvas-container');
        this.canvasEffect = new CanvasRevealEffect(this.canvasContainer, {
            colors: this.options.colors,
            animationSpeed: this.options.animationSpeed
        });
    }
    
    setupEventListeners() {
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.container.classList.add('hovered');
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.container.classList.remove('hovered');
        });
    }
    
    dispose() {
        if (this.canvasEffect) {
            this.canvasEffect.dispose();
        }
    }
}
