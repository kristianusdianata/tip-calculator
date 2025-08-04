import { arrayLoopHandler, useClass, useElement } from "../utils/index.js";
import { Element } from "./element.js";
import { Observable } from "./observable.js";
export class Tip extends Element {
    constructor() {
        super({ blockName: "tip" });
        this._value = 0;
        this._obs = useClass(Observable);
        this.activeRadio = null;
        this.input = useElement(this.element.querySelector(`.${this.blockName}__input`));
        this.errorLabel = useElement((this.element.querySelector(`.${this.blockName}__label-error`)));
        this.radios = this.element.querySelectorAll(`input[name="${this.blockName}-radio"][type="radio"]`);
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = Math.floor((value / 100) * 100) / 100;
    }
    get obs() {
        return this._obs;
    }
    defaultState() {
        this.value = 0;
    }
    radiosCallback(func) {
        arrayLoopHandler(Array.from(this.radios), (radio, _index) => {
            func(radio);
        });
    }
    // --------------------------- Event handler start ---------------------------
    processInputValue(event) {
        const inputValue = Number(event.target.value);
        this.value = Number(inputValue);
        this.obs.notifyError();
        this.obs.notifyOutput();
        this.obs.notifyUI();
    }
    inputFocusHandler(_event) {
        const customRadio = (this.element.querySelector(`input#${this.blockName}-custom[name="${this.blockName}-radio"][type="radio"]`));
        customRadio.checked = true;
        this.activeUI({ isActive: false });
        this.activeRadio = customRadio;
    }
    radioChangeHandler(event) {
        if (this.activeRadio) {
            this.activeUI({ isActive: false });
        }
        const radio = event.target;
        if (radio instanceof HTMLInputElement && radio.type === "radio") {
            this.activeRadio = radio;
            this.activeUI({ isActive: true });
            // check radio does not have value attribute (custome input)
            if (!Number.isNaN(radio.value) ||
                radio.value !== undefined ||
                radio.value !== null) {
                this.value = Number(radio.value);
                const input = this.input.done();
                input.value = "";
                this.obs.notifyReset(); // reset error state
                this.obs.notifyOutput();
                this.obs.notifyUI();
            }
            else {
                this.value = 0;
            }
        }
    }
    attachEvent() {
        this.input
            .setEventHandler("input", this.processInputValue.bind(this))
            .setEventHandler("change", this.processInputValue.bind(this))
            .setEventHandler("focus", this.inputFocusHandler.bind(this))
            .done();
        this.radiosCallback((radio) => {
            useElement(radio)
                .setEventHandler("change", this.radioChangeHandler.bind(this))
                .done();
        });
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
        this.errorLabel.setInnerText("").done();
        const inputField = this.input
            .removeClass(`${this.blockName}__input--error`)
            .setAttribute({ "aria-invalid": "false" })
            .done();
        inputField.value = "";
        this.radiosCallback((radio) => {
            if (radio.checked === true) {
                useElement(this.element.querySelector(`label[for=${radio.id}]`))
                    .removeClass(`${this.blockName}__button--active`)
                    .done();
            }
            radio.checked = false;
        });
    }
    activeUI({ isActive }) {
        if (this.activeRadio) {
            useElement((this.element.querySelector(`label[for=${this.activeRadio.id}]`)))
                .toggleClass(`${this.blockName}__button--active`, isActive)
                .done();
        }
    }
}
