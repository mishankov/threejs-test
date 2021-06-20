import * as THREE from 'three';
import * as BA from './BaseApplication'

window.addEventListener('DOMContentLoaded', () => {
    const app = new Application(true);
    BA.animate(app);
});


class Application extends BA.BaseApplication {
    mainCube: SimpleCubeMesh;
    animatedCubes: Array<SimpleCubeMesh>;

    init() {
        this.addGround();
        this.addAnimatedCubes();
        this.addMainCube();
    }

    onKeypress(keyName: string) {
        console.log(keyName+ " pressed");
        switch (keyName) {
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
            case 'm':
                this.camera.setFollowedObject(this.mainCube);
                break;
            case '1':
                this.camera.setFollowedObject(this.animatedCubes[0]);
                break;
            case '2':
                this.camera.setFollowedObject(this.animatedCubes[1]);
                break;
            case '3':
                this.camera.setFollowedObject(this.animatedCubes[2]);
                break;
            case '0':
                this.camera.deletefollowedObject();
                this.initCamera();
                break;
        }
        this.mainCube.logState();
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
        this.mainCube = new SimpleCubeMesh(0xff00ff, 10, 10, 10);
        this.mainCube.position.set(0, 10, 0);
        this.mainCube.rotation.order = 'YXZ';
        this.scene.add(this.mainCube);
    }

    addAnimatedCubes() {
        this.animatedCubes = [
            new SimpleCubeMesh(0x00ff00),
            new SimpleCubeMesh(0xffff00, undefined, undefined, undefined, new THREE.Vector3(0, 5, 0)),
            new SimpleCubeMesh(0xff0000, undefined, undefined, undefined, new THREE.Vector3(0, 10, 0))
        ];

        for (let index = 0; index < this.animatedCubes.length; index++) {
            const animatedCube = this.animatedCubes[index];
            this.scene.add(animatedCube);

            this.animatedObjects.push({
                object: animatedCube,
                animation: this.animateCube
            })
        }
        
    }

    animateCube(cube: SimpleCubeMesh) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;
    }
}

class SimpleCubeMesh extends THREE.Mesh {
    constructor(color=0x000000, width?: number, height?: number, depth?: number, position?: THREE.Vector3) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({color: color});
        super(geometry, material);

        this.castShadow = true;
        this.receiveShadow = true;

        if (position !== undefined) {
            this.position.set(position.x, position.y, position.z);
        }
    }

    logState() {
        console.log("SimpleCubeMesh state");
        console.log('POSITION x: ' + this.position.x + '; y: ' + this.position.y + '; z: ' + this.position.z);
        console.log('ROTATION x: ' + THREE.MathUtils.radToDeg(this.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.rotation.y) + '; z: ' + THREE.MathUtils.radToDeg(this.rotation.z));
    }
}
