export interface MousePosition {
    x: number;
    y: number
}

export enum MouseButton {
    Main,
    Auxiliary,
    Secondary,
    Back,
    Forward
}

export class MouseInputContoller {
    activeButtons: Array<MouseButton>;
    mousePosition: MousePosition;

    constructor() {
        this.activeButtons = [];

        document.addEventListener('mousedown', (e) => this.onMouseDown(e.button), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e.button), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e.clientX, e.clientY), false);
    }

    includes(button: number) {
        return this.activeButtons.includes(button);
    }

    onMouseDown(button: number) {
        if (!this.activeButtons.includes(button)) {
            this.activeButtons.push(button);
        }
    }

    onMouseUp(button: number) {
        if (this.activeButtons.includes(button)) {
            this.activeButtons.splice(this.activeButtons.indexOf(button), 1);
        }
    }

    onMouseMove(x: number, y: number) {
        this.mousePosition = {x: x, y: y};
    }
}
