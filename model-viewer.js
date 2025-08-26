// 3D Model Viewer with Scroll Animations
class ModelViewer {
    constructor(container, modelPath, options = {}) {
        this.container = container;
        this.modelPath = modelPath;
        this.options = {
            cameraDistance: 5,
            rotationSpeed: 0.5,
            scrollRotationMultiplier: 0.01,
            autoRotate: true,
            modelY: -5,
            modelScale: 80.0,
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.clock = null;
        this.animations = [];
        this.scrollAngle = 0; // angle derived from scroll position
        this.autoRotateAngle = 0; // accumulated auto-rotate angle
        
        this.init();
    }
    
    async init() {
        // Load Three.js and GLTFLoader from CDN
        await this.loadDependencies();
        this.setupScene();
        await this.loadModel();
        this.animate();
        this.handleResize();
    }
    
    loadDependencies() {
        return new Promise((resolve) => {
            // Load Three.js
            if (typeof THREE === 'undefined') {
                const threeScript = document.createElement('script');
                threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
                threeScript.onload = () => {
                    // Load GLTFLoader
                    const gltfScript = document.createElement('script');
                    gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
                    gltfScript.onload = resolve;
                    document.head.appendChild(gltfScript);
                };
                document.head.appendChild(threeScript);
            } else {
                resolve();
            }
        });
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.offsetWidth / this.container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.z = this.options.cameraDistance;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
        
        // Lighting
        this.setupLighting();
        
        // Clock for animations
        this.clock = new THREE.Clock();
        
        // Scroll event listener
        this.setupScrollListener();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0xff4444, 0.5, 10);
        pointLight.position.set(-3, 2, 3);
        this.scene.add(pointLight);
        
        // Additional point light
        const pointLight2 = new THREE.PointLight(0x4444ff, 0.3, 8);
        pointLight2.position.set(3, -2, -3);
        this.scene.add(pointLight2);
    }
    
    async loadModel() {
        const loader = new THREE.GLTFLoader();
        
        try {
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    this.modelPath,
                    resolve,
                    undefined,
                    reject
                );
            });
            
            this.model = gltf.scene;
            this.model.scale.setScalar(this.options.modelScale); // Configurable initial scale
            this.model.position.set(0, this.options.modelY, 0); // Configurable initial Y
            
            // Enable shadows for all meshes
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Improve material quality
                    if (child.material) {
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            this.scene.add(this.model);
            
            // Setup animations if available
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.model);
                this.animations = gltf.animations;
                
                // Play first animation if available
                if (this.animations.length > 0) {
                    const action = this.mixer.clipAction(this.animations[0]);
                    action.play();
                }
            }
            
            console.log('Model loaded successfully:', this.modelPath);
            
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }
    
    setupScrollListener() {
        let scrollY = 0;
        let targetScrollY = 0;
        const epsilon = 0.01;
        
        window.addEventListener('scroll', () => {
            targetScrollY = window.pageYOffset;
        });
        
        // Smooth scroll animation
        const updateScroll = () => {
            const deltaToTarget = targetScrollY - scrollY;
            if (Math.abs(deltaToTarget) > epsilon) {
                scrollY += deltaToTarget * 0.1;
            } else {
                scrollY = targetScrollY;
            }
            
            if (this.model) {
                // Compute scroll-derived angle only; apply in animate()
                this.scrollAngle = scrollY * this.options.scrollRotationMultiplier;
                // Keep Y position and scale unchanged
            }
            
            requestAnimationFrame(updateScroll);
        };
        
        updateScroll();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Unified rotation: combine scroll-driven and auto-rotate
        if (this.model) {
            if (this.options.autoRotate) {
                this.autoRotateAngle += this.options.rotationSpeed * delta;
            }
            this.model.rotation.y = this.scrollAngle + this.autoRotateAngle;
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
            this.camera.updateProjectionMatrix();
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

    // Public API: update Y at runtime
    setY(y) {
        if (typeof y === 'number') {
            this.options.modelY = y;
            if (this.model) {
                this.model.position.y = y;
            }
        }
    }

    // Public API: update uniform scale at runtime
    setScale(scale) {
        if (typeof scale === 'number') {
            this.options.modelScale = scale;
            if (this.model) {
                this.model.scale.setScalar(scale);
            }
        }
    }
}
