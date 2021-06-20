import { debug } from 'console';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface AnimatedObject {
    object: THREE.Mesh;
    animation: Function;
}


export function animate(app: BaseApplication) {
    requestAnimationFrame(function() {
        animate(app);
    });

    for (let index = 0; index < app.animatedObjects.length; index++) {
        const element = app.animatedObjects[index];
        
        element.animation(element.object);
    }

    if (app.objectAttachedToCamera !== undefined) {
        app.camera.position.set(
            app.objectAttachedToCamera.position.x - Math.cos(app.objectAttachedToCamera.rotation.y) * 30,
            app.objectAttachedToCamera.position.y + 20,
            app.objectAttachedToCamera.position.z + Math.sin(app.objectAttachedToCamera.rotation.y) * 30
        );
    
        app.camera.lookAt(app.objectAttachedToCamera.position);
    }

    app.render();
}

export class BaseApplication {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stats: Stats;

    animatedObjects: Array<AnimatedObject>;

    DEBUG: boolean;
    objectAttachedToCamera: THREE.Mesh;

    constructor(debug=false) {
        this._init(debug);
        this.init();
    }

    _init(debug = false) {
        this.DEBUG = debug;
        this.animatedObjects = new Array();

        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLight();

        window.addEventListener('resize', () => {
            this.onResize();
        }, false);

        window.addEventListener('keypress', (event) => {
            this.onKeypress(event.key);
        });

        this.initDebug();
        
    }

    init() {}

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-25, 50, -25);
        this.camera.lookAt(0, 0, 0);
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    initLight() {
        let dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        dirLight.position.set(-100, 100, 100);
        dirLight.target.position.set(0, 0, 0);
        dirLight.castShadow = true;
        dirLight.shadow.bias = -0.001;
        dirLight.shadow.mapSize.width = 4096;
        dirLight.shadow.mapSize.height = 4096;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 500.0;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 500.0;
        dirLight.shadow.camera.left = 50;
        dirLight.shadow.camera.right = -50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        this.scene.add(dirLight);
    
        let ambLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
        this.scene.add(ambLight);        
    }

    initDebug() {
        if (this.DEBUG) {
            this.scene.add(new THREE.AxesHelper(100));
            
            // FPS display
            this.stats = Stats();
            document.body.appendChild(this.stats.dom);
        }
    }

    render() {
        if (this.DEBUG) {
            this.stats.begin();
        }

        this.renderer.render(this.scene, this.camera);
        
        if (this.DEBUG) {
            this.stats.end();
            this.stats.update();
        }
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);  
    }

    onKeypress(keyName: string) {}

    attachCameraToObject(object: THREE.Mesh) {
        this.objectAttachedToCamera = object;
    }

    logCamera() {
        console.log('POSITION x: ' + this.camera.position.x + '; y: ' + this.camera.position.y + '; z: ' + this.camera.position.z);
        console.log('ROTATION x: ' + THREE.MathUtils.radToDeg(this.camera.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.camera.rotation.y) + '; z: ' + THREE.MathUtils.radToDeg(this.camera.rotation.z));
    }
};
