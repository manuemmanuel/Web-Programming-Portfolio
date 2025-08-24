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
            ...options
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.mixer = null;
        this.clock = null;
        this.animations = [];
        
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
            this.model.scale.setScalar(50.0); // Back to original scale
            this.model.position.set(0, -5, 0); // Back to original position
            
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
        
        window.addEventListener('scroll', () => {
            targetScrollY = window.pageYOffset;
        });
        
        // Smooth scroll animation
        const updateScroll = () => {
            scrollY += (targetScrollY - scrollY) * 0.1;
            
            if (this.model) {
                // Rotate model based on scroll
                this.model.rotation.y = scrollY * this.options.scrollRotationMultiplier;
                
                // Add some vertical movement (based on base position)
                const baseY = -115; // Match the initial Y position
                this.model.position.y = baseY + Math.sin(scrollY * 0.001) * 0.5;
                
                // Scale effect on scroll (based on base scale)
                const baseScale = 80.0; // Match the initial scale
                const scale = baseScale + Math.sin(scrollY * 0.002) * 2.0;
                this.model.scale.setScalar(scale);
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
        
        // Auto-rotate if enabled
        if (this.model && this.options.autoRotate) {
            this.model.rotation.y += this.options.rotationSpeed * delta;
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
}
