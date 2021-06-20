import * as THREE from 'three';

export class CameraWrapper {
    actualCamera: THREE.PerspectiveCamera;
    folowedObject: THREE.Mesh;

    constructor(camera: THREE.PerspectiveCamera) {
        this.actualCamera = camera
    }

    setFollowedObject(object: THREE.Mesh) {
        this.folowedObject = object;
    }

    deleteFollowedObject() {
        delete this.folowedObject;
    }

    move() {
        if (this.folowedObject !== undefined) {
            this.actualCamera.position.set(
                this.folowedObject.position.x - Math.cos(this.folowedObject.rotation.y) * 30,
                this.folowedObject.position.y + 20,
                this.folowedObject.position.z + Math.sin(this.folowedObject.rotation.y) * 30
            );
        
            this.actualCamera.lookAt(this.folowedObject.position);
        }       
    }

    logCameraState() {
        console.log('POSITION x: ' + this.actualCamera.position.x + '; y: ' + this.actualCamera.position.y + '; z: ' + this.actualCamera.position.z);
        console.log('ROTATION x: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.x) + '; y: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.y) + '; z: ' + THREE.MathUtils.radToDeg(this.actualCamera.rotation.z));
    }
}