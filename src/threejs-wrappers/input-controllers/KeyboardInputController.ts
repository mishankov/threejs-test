export class KeyboardInputController {
    activeKeys: Array<string>;

    constructor() {
        this.activeKeys = [];

        document.addEventListener('keydown', (e) => this.onKeyDown(e.key), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e.key), false);
    }

    onKeyDown(key: string) {
        if (!this.activeKeys.includes(key)) {
            this.activeKeys.push(key);
        }
    }

    onKeyUp(key: string) {
        if (this.activeKeys.includes(key)) {
            this.activeKeys.splice(this.activeKeys.indexOf(key), 1);
        }
    }
}
