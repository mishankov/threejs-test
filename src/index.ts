import * as THREE from 'three';
import * as BA from './threejs-wrappers/threejs-wrappers';

window.addEventListener('DOMContentLoaded', () => {
    const app = new Application(true);
    BA.animate(app);
});


class Application extends BA.BaseApplication {
    mainCube: MainCube;
    animatedCubes: Array<AnimatedCube>;

    init() {
        this.addGround();
        this.addAnimatedCubes();
        this.addMainCube();
    }

    onKeypress(keyName: string) {
        console.log(keyName+ " pressed");
        switch (keyName) {
            case 'm':
                this.camera.setFollowedObject(this.mainCube.actualObject);
                break;
            case '1':
                this.camera.setFollowedObject(this.animatedCubes[0].actualObject);
                break;
            case '2':
                this.camera.setFollowedObject(this.animatedCubes[1].actualObject);
                break;
            case '3':
                this.camera.setFollowedObject(this.animatedCubes[2].actualObject);
                break;
            case '0':
                this.camera.deleteFollowedObject();
                this.initCamera();
                break;
        }
        this.mainCube.logObjectState();
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
        this.mainCube = new MainCube();
        this.scene.add(this.mainCube.actualObject);
    }

    addAnimatedCubes() {
        this.animatedCubes = [
            new AnimatedCube(0x00ff00),
            new AnimatedCube(0xffff00, undefined, undefined, undefined, new THREE.Vector3(0, 5, 0)),
            new AnimatedCube(0xff0000, undefined, undefined, undefined, new THREE.Vector3(0, 10, 0))
        ];

        for (let index = 0; index < this.animatedCubes.length; index++) {
            const animatedCube = this.animatedCubes[index];

            this.scene.add(animatedCube.actualObject);
            this.animatedObjects.push(animatedCube);
        }
    }

    keyboardInputHandler() {
        const acceleration = this.keyboardInput.activeKeys.includes('Shift') ? 2 : 1;

        if (this.keyboardInput.activeKeys.includes('w')) {
            this.mainCube.moveForward(acceleration);
        }

        if (this.keyboardInput.activeKeys.includes('s')) {
            this.mainCube.moveBackward(acceleration * 0.5);
        }

        if (this.keyboardInput.activeKeys.includes('a')) {
            this.mainCube.rotateLeft(2);
        }

        if (this.keyboardInput.activeKeys.includes('d')) {
            this.mainCube.rotateRight(2);
        }
    }
}

class AnimatedCube extends BA.ObjectWrapper {
    constructor(color=0x000000, width?: number, height?: number, depth?: number, position?: THREE.Vector3) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({color: color});
        
        const object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        object.receiveShadow = true;
        if (position !== undefined) {
            object.position.set(position.x, position.y, position.z);
        }

        super(object);
    }

    animation() {
        this.actualObject.rotation.x += 0.01;
        this.actualObject.rotation.y += 0.01;
        this.actualObject.rotation.z += 0.01;
    }
}

class MainCube extends BA.ObjectWrapper {
    constructor() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshStandardMaterial({color: 0xff00ff});
        
        const object = new THREE.Mesh(geometry, material);
        object.position.set(0, 5, 0);
        object.rotation.order = 'YXZ'
        object.castShadow = true;
        object.receiveShadow = true;

        super(object);
    }

    moveForward(speed=1) {
        this.actualObject.position.x += Math.cos(this.actualObject.rotation.y) * speed;
        this.actualObject.position.z += -Math.sin(this.actualObject.rotation.y) * speed;
    }

    moveBackward(speed=1) {
        this.actualObject.position.x += -Math.cos(this.actualObject.rotation.y) * speed;
        this.actualObject.position.z += Math.sin(this.actualObject.rotation.y) * speed;
    }

    rotateLeft(speed=1) {
        this.actualObject.rotateY(THREE.MathUtils.degToRad(1) * speed);
    }

    rotateRight(speed=1) {
        this.actualObject.rotateY(THREE.MathUtils.degToRad(-1) * speed);
    }
}
