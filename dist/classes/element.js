export class Element {
    constructor({ blockName }) {
        this._blockName = blockName;
        this._element = document.querySelector(`.${this._blockName}`);
    }
    get blockName() {
        return this._blockName;
    }
    get element() {
        return this._element;
    }
}
