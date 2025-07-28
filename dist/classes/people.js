import { useClass, useElement } from "../utils/index.js";
import { Element } from "./element.js";
import { Observable } from "./observable.js";
export class People extends Element {
    constructor() {
        super({ blockName: "people" });
        this._value = 0;
        this._obs = useClass(Observable);
        this.input = useElement(this.element.querySelector(`.${this.blockName}__input`));
        this.errorLabel = useElement((this.element.querySelector(`.${this.blockName}__label-error`)));
    }
    get value() {
        return this._value;
    }
    set value(_value) {
        this._value = _value;
    }
    get obs() {
        return this._obs;
    }
    defaultState() {
        this.value = 0;
    }
    // --------------------------- Event handler start ---------------------------
    processInputValue(event) {
        const inputValue = Number(event.target.value);
        this.value = Number(inputValue);
        this.obs.notifyError();
        this.obs.notifyCalculate();
        this.obs.notifyUI();
    }
    attachEvent() {
        this.input
            .setEventHandler("input", this.processInputValue.bind(this))
            .setEventHandler("change", this.processInputValue.bind(this))
            .done();
    }
    // --------------------------- Event handler end ---------------------------
    // --------------------------- UI handler start ---------------------------
    errorUI({ isError, errMsg }) {
        this.errorLabel.setInnerText(errMsg);
        this.input
            .toggleClass(`${this.blockName}__input--error`, isError)
            .setAttribute({ "aria-invalid": `${isError}` })
            .done();
    }
    defaultUI() {
        this.errorLabel.setInnerText("");
        const inputField = this.input
            .removeClass(`${this.blockName}__input--error`)
            .setAttribute({ "aria-invalid": "false" })
            .done();
        inputField.value = "";
    }
}
