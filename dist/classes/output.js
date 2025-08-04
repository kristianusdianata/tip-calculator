import { Element } from "./element.js";
import { useClass, useElement } from "../utils/index.js";
import { Observable } from "./observable.js";
export class Output extends Element {
    constructor() {
        super({ blockName: "output" });
        this._totalTipPerPeople = 0;
        this._totalBillPerPeople = 0;
        this._obs = useClass(Observable);
        this.totalTipLabel = useElement(this.element.querySelector(`output#tip-output`));
        this.totalBillLabel = useElement(this.element.querySelector(`output#bill-output`));
        this.resetButton = useElement((this.element.querySelector(`button.${this.blockName}__button[type="reset"]`)));
    }
    get totalTipPerPeople() {
        return this._totalTipPerPeople;
    }
    set totalTipPerPeople(val) {
        this._totalTipPerPeople = val;
    }
    get totalBillPerPeople() {
        return this._totalBillPerPeople;
    }
    set totalBillPerPeople(val) {
        this._totalBillPerPeople = val;
    }
    get obs() {
        return this._obs;
    }
    defaultState() {
        this.totalBillPerPeople = 0;
        this.totalTipPerPeople = 0;
    }
    // --------------------------- Event handler start ---------------------------
    reset() {
        this.obs.notifyReset(); // reset bill, tip, people & error state
        this.obs.notifyUI();
    }
    attachEvent() {
        this.resetButton.setEventHandler("click", this.reset.bind(this));
    }
    // --------------------------- Event handler end ---------------------------
    // --------------------------- UI Handler start ---------------------------
    updateOutputLabel({ billPerPerson, tipPerPerson, }) {
        const _billPerPerson = billPerPerson <= 0 ? `$0.00` : `$${billPerPerson}`;
        const _tipPerPeople = tipPerPerson <= 0 ? `$0.00` : `$${tipPerPerson}`;
        this.totalBillLabel.setInnerText(_billPerPerson).done();
        this.totalTipLabel.setInnerText(_tipPerPeople).done();
    }
    disableButton({ isDisabled }) {
        const resetBtn = this.resetButton
            .toggleClass(`${this.blockName}__button--active`, !isDisabled)
            .done();
        resetBtn.disabled = isDisabled;
    }
}
