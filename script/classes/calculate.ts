import { Element } from "./element.js";
import { useClass, useElement } from "../utils/index.js";
import { Observable } from "./observable.js";

import type { ElementAPI } from "../utils/index.js";
import type { ObservableInterface } from "./observable.js";

export interface CalculateInterface {
  get totalTipPerPeople(): number;
  set totalTipPerPeople(val: number);
  get totalBillPerPeople(): number;
  set totalBillPerPeople(val: number);
  get obs(): ObservableInterface;
  updateOutputLabel({
    billPerPerson,
    tipPerPerson,
  }: {
    billPerPerson: number;
    tipPerPerson: number;
  }): void;
  disableButton({ isDisabled }: { isDisabled: boolean }): void;
  attachEvent(): void;
  defaultState(): void;
}

export class Calculate extends Element implements CalculateInterface {
  private _totalTipPerPeople: number;
  private _totalBillPerPeople: number;
  private totalTipLabel: ElementAPI<HTMLOutputElement>;
  private totalBillLabel: ElementAPI<HTMLOutputElement>;
  private resetButton: ElementAPI<HTMLButtonElement>;
  private _obs: ObservableInterface;

  constructor() {
    super({ blockName: "calculation" });
    this._totalTipPerPeople = 0;
    this._totalBillPerPeople = 0;
    this._obs = useClass(Observable);
    this.totalTipLabel = useElement(
      <HTMLOutputElement>this.element.querySelector(`output#tip-output`)
    );
    this.totalBillLabel = useElement(
      <HTMLOutputElement>this.element.querySelector(`output#bill-output`)
    );
    this.resetButton = useElement(
      <HTMLButtonElement>(
        this.element.querySelector(
          `button.${this.blockName}__button[type="reset"]`
        )
      )
    );
  }

  get totalTipPerPeople(): number {
    return this._totalTipPerPeople;
  }

  set totalTipPerPeople(val: number) {
    this._totalTipPerPeople = val;
  }

  get totalBillPerPeople(): number {
    return this._totalBillPerPeople;
  }

  set totalBillPerPeople(val: number) {
    this._totalBillPerPeople = val;
  }

  get obs(): ObservableInterface {
    return this._obs;
  }

  defaultState(): void {
    this.totalBillPerPeople = 0;
    this.totalTipPerPeople = 0;
  }

  // --------------------------- Event handler start ---------------------------
  private reset() {
    this.obs.notifyReset(); // reset bill, tip, people & error state
    this.obs.notifyUI();
  }

  attachEvent(): void {
    this.resetButton.setEventHandler("click", this.reset.bind(this));
  }
  // --------------------------- Event handler end ---------------------------

  // --------------------------- UI Handler start ---------------------------
  updateOutputLabel({
    billPerPerson,
    tipPerPerson,
  }: {
    billPerPerson: number;
    tipPerPerson: number;
  }) {
    const _billPerPerson: string =
      billPerPerson <= 0 ? `$0.00` : `$${billPerPerson}`;
    const _tipPerPeople: string =
      tipPerPerson <= 0 ? `$0.00` : `$${tipPerPerson}`;
    this.totalBillLabel.setInnerText(_billPerPerson).done();
    this.totalTipLabel.setInnerText(_tipPerPeople).done();
  }

  disableButton({ isDisabled }: { isDisabled: boolean }) {
    const resetBtn = this.resetButton
      .toggleClass(`${this.blockName}__button--active`, !isDisabled)
      .done();

    resetBtn.disabled = isDisabled;
  }
  // --------------------------- UI Handler end ---------------------------
}
