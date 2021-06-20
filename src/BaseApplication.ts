import { debug } from 'console';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';


export class CameraWrapper {
    actualCamera: THREE.PerspectiveCamera;
    folowedObject: THREE.Mesh;

    constructor(camera: THREE.PerspectiveCamera) {
        this.actualCamera = camera
    }

    followObject(object: THREE.Mesh) {
        this.folowedObject = object;
    }

    unfollowObject() {
        delete this.folowedObject;
    }

    logCameraState() {
        console.log('POSITION x: ' + this.actualCamera.position.x + '; y: ' + this.actualCamera.position.y + '; z: ' + this.actualCamera.position.z);
        console.log('ROTATION x: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.y) + '; z: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.z));
    }
}


export interface AnimatedObject {
    object: THREE.Mesh;
    animation: (app: THREE.Mesh, time: number) => void;
}


export function animate(app: BaseApplication, time?: number) {
    requestAnimationFrame(function(time) {
        animate(app, time);
    });

    for (let index = 0; index < app.animatedObjects.length; index++) {
        const element = app.animatedObjects[index];
        
        element.animation(element.object, time);
    }

    if (app.camera.folowedObject !== undefined) {
        app.camera.actualCamera.position.set(
            app.camera.folowedObject.position.x - Math.cos(app.camera.folowedObject.rotation.y) * 30,
            app.camera.folowedObject.position.y + 20,
            app.camera.folowedObject.position.z + Math.sin(app.camera.folowedObject.rotation.y) * 30
        );
    
        app.camera.actualCamera.lookAt(app.camera.folowedObject.position);
    }

    app.render();
}

export class BaseApplication {
    scene: THREE.Scene;
    camera: CameraWrapper;
    renderer: THREE.WebGLRenderer;
    stats: Stats;

    animatedObjects: Array<AnimatedObject>;

    DEBUG: boolean;

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
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-25, 50, -25);
        camera.lookAt(0, 0, 0);

        this.camera = new CameraWrapper(camera);
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

        this.renderer.render(this.scene, this.camera.actualCamera);
        
        if (this.DEBUG) {
            this.stats.end();
            this.stats.update();
        }
    }

    onResize() {
        this.camera.actualCamera.aspect = window.innerWidth / window.innerHeight;
        this.camera.actualCamera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);  
    }

    onKeypress(keyName: string) {}


};
