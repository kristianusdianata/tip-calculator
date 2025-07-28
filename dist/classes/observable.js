import { arrayLoopHandler } from "../utils/index.js";
export class Observable {
    constructor() {
        this.calculateListeners = [];
        this.errorListeners = [];
        this.UIListener = [];
    }
    subcribeCalculate(listener) {
        if (Array.isArray(listener)) {
            this.calculateListeners.push(...listener);
        }
        else {
            this.calculateListeners.push(listener);
        }
    }
    subcribeError(listener) {
        if (Array.isArray(listener)) {
            this.errorListeners.push(...listener);
        }
        else {
            this.errorListeners.push(listener);
        }
    }
    subcribeUI(listener) {
        if (Array.isArray(listener)) {
            this.UIListener.push(...listener);
        }
        else {
            this.UIListener.push(listener);
        }
    }
    unSubcribeCalculate(targetListener) {
        this.calculateListeners = this.calculateListeners.filter((listener) => listener !== targetListener);
    }
    unSubcribeError(targetListener) {
        this.errorListeners = this.errorListeners.filter((listener) => listener !== targetListener);
    }
    unSubcribeUI(targetListener) {
        this.UIListener = this.UIListener.filter((listener) => listener !== targetListener);
    }
    notifyCalculate() {
        arrayLoopHandler(this.calculateListeners, (func, _index) => {
            func();
        });
    }
    notifyError() {
        arrayLoopHandler(this.errorListeners, (func, _index) => {
            func();
        });
    }
    notifyUI() {
        arrayLoopHandler(this.UIListener, (func, _index) => {
            func();
        });
    }
}
