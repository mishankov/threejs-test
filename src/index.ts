import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Stats from 'three/examples/jsm/libs/stats.module';

window.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.animatedCube();
    animate(app);
});

function animate(app: Application) {
    requestAnimationFrame(function() {
        animate(app);
    });

    app.render();
    app.stats.update();
}

class Application {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: TrackballControls;
    stats: Stats;

    mainCube: SimpleCubeMesh;


    constructor() {
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.scene.add(new THREE.AxesHelper(100));
        
        this.initCamera()
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.initLight();

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);

        this.addGround();
        this.addMainCube();

        window.addEventListener('resize', () => {
            this.onResize();
        }, false);

        window.addEventListener('keypress', (event) => {
            console.log(event.key + " pressed");
            switch (event.key) {
                case 'w':
                    this.mainCube.position.x += Math.cos(this.mainCube.rotation.y);
                    this.mainCube.position.z += -Math.sin(this.mainCube.rotation.y);
                    break;
                case 's':
                    this.mainCube.position.x += -Math.cos(this.mainCube.rotation.y);
                    this.mainCube.position.z += Math.sin(this.mainCube.rotation.y);
                    break;
                case 'a':
                    const quaternion = new THREE.Quaternion();
                    quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.mainCube.rotation.y + THREE.MathUtils.degToRad(15));
                    this.mainCube.quaternion.copy(quaternion);
                    break;
                case 'd':
                    this.mainCube.rotateY(-15*Math.PI/180);
                    break;
                case '1':
                    this.camera.lookAt(0, 0, 0);
                    break;
                case '0':
                    this.camera.lookAt(this.camera.position);
            }
            this.mainCube.logState();
        });
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-25, 50, -25);
        this.camera.lookAt(0, 0, 0);
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

    render() {
        this.stats.begin();
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);  
    }

    logCamera() {
        console.log(this.camera.position);
        console.log('x: ' + THREE.MathUtils.radToDeg(this.camera.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.camera.rotation.y)+ '; z: ' + THREE.MathUtils.radToDeg(this.camera.rotation.z));
    }

    addGround() {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xcccccc,
              }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);       
    }
    
    addMainCube() {
        this.mainCube = new SimpleCubeMesh(0xffff00, 10, 10, 10);
        this.mainCube.position.set(0, 10, 0);
        this.mainCube.rotation.order = 'YXZ';
        this.scene.add(this.mainCube);
    }

    animatedCube() {
        const cube = new SimpleCubeMesh(0x00ff00);
        
        this.scene.add(cube);
        this.renderer.render(this.scene, this.camera);
        
        function animate(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
            requestAnimationFrame(function() {
                animate(renderer, scene, camera);
            });
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.rotation.z += 0.01;
            renderer.render(scene, camera);
        }
        
        animate(this.renderer, this.scene, this.camera);
    }
}

class SimpleCubeMesh extends THREE.Mesh {
    constructor(color=0x000000, width?: number, height?: number, depth?: number) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({color: color});
        super(geometry, material);

        this.castShadow = true;
        this.receiveShadow = true;
    }

    logState() {
        console.log(this.position);
        console.log('x: ' + THREE.MathUtils.radToDeg(this.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.rotation.y) + '; z: ' + THREE.MathUtils.radToDeg(this.rotation.z));
    }
}