// Silk Background Effect for Intro Section
class SilkBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            speed: options.speed || 5,
            scale: options.scale || 1,
            color: options.color || "#7B7481",
            noiseIntensity: options.noiseIntensity || 1.5,
            rotation: options.rotation || 0,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.uniforms = null;
        this.clock = null;
        
        this.init();
    }
    
    async init() {
        await this.loadThreeJS();
        this.setupScene();
        this.createSilkMaterial();
        this.animate();
        this.handleResize();
    }
    
    loadThreeJS() {
        return new Promise((resolve) => {
            if (typeof THREE === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            } else {
                resolve();
            }
        });
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        this.camera.position.z = 1;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.container.appendChild(this.renderer.domElement);
        
        // Clock for animations
        this.clock = new THREE.Clock();
    }
    
    hexToNormalizedRGB(hex) {
        hex = hex.replace("#", "");
        return [
            parseInt(hex.slice(0, 2), 16) / 255,
            parseInt(hex.slice(2, 4), 16) / 255,
            parseInt(hex.slice(4, 6), 16) / 255,
        ];
    }
    
    createSilkMaterial() {
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uSpeed;
            uniform float uScale;
            uniform float uRotation;
            uniform float uNoiseIntensity;
            
            const float e = 2.71828182845904523536;
            
            float noise(vec2 texCoord) {
                float G = e;
                vec2 r = (G * sin(G * texCoord));
                return fract(r.x * r.y * (1.0 + texCoord.x));
            }
            
            vec2 rotateUvs(vec2 uv, float angle) {
                float c = cos(angle);
                float s = sin(angle);
                mat2 rot = mat2(c, -s, s, c);
                return rot * uv;
            }
            
            void main() {
                float rnd = noise(gl_FragCoord.xy);
                vec2 uv = rotateUvs(vUv * uScale, uRotation);
                vec2 tex = uv * uScale;
                float tOffset = uSpeed * uTime;
                
                tex.y += 0.08 * sin(12.0 * tex.x - tOffset);
                tex.x += 0.05 * cos(8.0 * tex.y + tOffset * 0.5);
                
                float pattern = 0.6 +
                    0.4 * sin(8.0 * (tex.x + tex.y +
                        cos(4.0 * tex.x + 6.0 * tex.y) +
                        0.03 * tOffset) +
                    sin(25.0 * (tex.x + tex.y - 0.15 * tOffset)));
                
                vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 12.0 * uNoiseIntensity;
                col.a = 0.4; // Slightly more visible
                gl_FragColor = col;
            }
        `;
        
        this.uniforms = {
            uSpeed: { value: this.options.speed },
            uScale: { value: this.options.scale },
            uNoiseIntensity: { value: this.options.noiseIntensity },
            uColor: { value: new THREE.Color(...this.hexToNormalizedRGB(this.options.color)) },
            uRotation: { value: this.options.rotation },
            uTime: { value: 0 }
        };
        
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.uniforms.uTime.value += 0.2 * delta;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        });
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}
