import { useClass, useElement } from "../utils/index.js";
import { Element } from "./element.js";
import { Observable } from "./observable.js";
import type { ObservableInterface } from "./observable.js";
import type { ElementAPI } from "../utils/index.js";

export interface PeopleInterface {
  get value(): number;
  set value(value: number);
  get obs(): ObservableInterface;
  defaultState(): void;
  attachEvent(): void;
  errorUI({ isError, errMsg }: { isError: boolean; errMsg: string }): void;
  defaultUI(): void;
}

export class People extends Element implements PeopleInterface {
  private _value: number;
  private _obs: ObservableInterface;
  private input: ElementAPI<HTMLInputElement>;
  private errorLabel: ElementAPI<HTMLSpanElement>;

  constructor() {
    super({ blockName: "people" });
    this._value = 0;
    this._obs = useClass(Observable);
    this.input = useElement(
      <HTMLInputElement>this.element.querySelector(`.${this.blockName}__input`)
    );
    this.errorLabel = useElement(
      <HTMLLabelElement>(
        this.element.querySelector(`.${this.blockName}__label-error`)
      )
    );
  }

  get value(): number {
    return this._value;
  }

  set value(_value: number) {
    this._value = _value;
  }

  get obs(): ObservableInterface {
    return this._obs;
  }

  defaultState(): void {
    this.value = 0;
  }

  // --------------------------- Event handler start ---------------------------
  private processInputValue<T extends keyof HTMLElementEventMap>(
    event: HTMLElementEventMap[T]
  ): void {
    const inputValue = Number((event.target as HTMLInputElement).value);
    this.value = Number(inputValue);
    this.obs.notifyError();
    this.obs.notifyCalculate();
    this.obs.notifyUI();
  }

  attachEvent(): void {
    this.input
      .setEventHandler("input", this.processInputValue.bind(this))
      .setEventHandler("change", this.processInputValue.bind(this))
      .done();
  }
  // --------------------------- Event handler end ---------------------------

  // --------------------------- UI handler start ---------------------------
  errorUI({ isError, errMsg }: { isError: boolean; errMsg: string }): void {
    this.errorLabel.setInnerText(errMsg).done();
    this.input
      .toggleClass(`${this.blockName}__input--error`, isError)
      .setAttribute({ "aria-invalid": `${isError}` })
      .done();
  }

  defaultUI(): void {
    this.errorLabel.setInnerText("").done();
    const inputField = this.input
      .removeClass(`${this.blockName}__input--error`)
      .setAttribute({ "aria-invalid": "false" })
      .done();
    inputField.value = "";
  }
  // --------------------------- UI handler end ---------------------------
}
