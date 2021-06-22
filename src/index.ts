import * as THREE from 'three';
import { WebXRController } from 'three';
import * as BA from './threejs-wrappers/threejs-wrappers';
import { MouseButton } from './threejs-wrappers/threejs-wrappers';


window.addEventListener('DOMContentLoaded', () => {
    const app = new Application(true);
    BA.animate(app);
});

enum MovableObject {
    MainCube,
    Camera
}


class Application extends BA.BaseApplication {
    mainCube: MainCube;
    animatedCubes: Array<AnimatedCube>;
    movableObject: MovableObject = MovableObject.MainCube;

    previousMousePosition: BA.MousePosition;
    currentMousePosition: BA.MousePosition;

    init() {
        this.addGround();
        this.addAnimatedCubes();
        this.addMainCube();
    }

    onKeypress(keyName: string) {
        console.log(keyName+ " pressed");
        switch (keyName) {
            case 'm':
                this.movableObject = MovableObject.MainCube;
                this.camera.setFollowedObject(this.mainCube.actualObject);
                break;
            case 'r':
                switch (this.movableObject) {
                    case MovableObject.Camera:
                        console.log("move cube");
                        this.movableObject = MovableObject.MainCube;
                        break;
                    case MovableObject.MainCube:
                        console.log("move camera");
                        this.movableObject = MovableObject.Camera;
                        break;
                }
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

        switch (this.movableObject) {
            case MovableObject.MainCube:
                this.mainCube.logObjectState();
                break;
            case MovableObject.Camera:
                this.camera.logCameraState();
                break;
        }
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
        const acceleration = this.keyboardInput.includes('Shift') ? 2 : 1;

        switch (this.movableObject) {
            case MovableObject.MainCube:
                if (this.keyboardInput.includes('w')) {
                    this.mainCube.moveForward(acceleration);
                }
        
                if (this.keyboardInput.includes('s')) {
                    this.mainCube.moveBackward(acceleration * 0.5);
                }
        
                if (this.keyboardInput.includes('a')) {
                    this.mainCube.rotateLeft(2);
                }
        
                if (this.keyboardInput.includes('d')) {
                    this.mainCube.rotateRight(2);
                }
                break;
            case MovableObject.Camera:
                if (this.keyboardInput.includes('w')) {
                    this.camera.move(BA.MoveDirection.Forward, acceleration);
                }
                
                if (this.keyboardInput.includes('s')) {
                    this.camera.move(BA.MoveDirection.Backward, acceleration);
                }

                if (this.keyboardInput.includes('a')) {
                    this.camera.move(BA.MoveDirection.Left, acceleration);
                }
                
                if (this.keyboardInput.includes('d')) {
                    this.camera.move(BA.MoveDirection.Right, acceleration);
                }
                break;
        }
    }

    mouseInputHandler() {
        if (this.mouseInput.includes(MouseButton.Main)) {
            if (this.previousMousePosition === undefined) {
                this.previousMousePosition = this.mouseInput.mousePosition;
            } else {
                this.currentMousePosition = this.mouseInput.mousePosition;
                
                const delta_y = this.currentMousePosition.y - this.previousMousePosition.y;
                const delta_x = this.currentMousePosition.x - this.previousMousePosition.x;

                this.camera.rotate(delta_y / window.innerHeight * Math.PI, delta_x / window.innerWidth * Math.PI);

                this.previousMousePosition = this.currentMousePosition;
            }
        } else {
            delete this.previousMousePosition;
            delete this.currentMousePosition;
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
        object.rotation.order = 'YXZ';
        object.castShadow = true;
        object.receiveShadow = true;

        super(object);
    }

    moveForward(speed=1) {
        this.actualObject.translateZ(speed);
    }

    moveBackward(speed=1) {
        this.actualObject.translateZ(-speed);
    }

    rotateLeft(speed=1) {
        this.actualObject.rotateY(THREE.MathUtils.degToRad(1) * speed);
    }

    rotateRight(speed=1) {
        this.actualObject.rotateY(THREE.MathUtils.degToRad(-1) * speed);
    }
}
