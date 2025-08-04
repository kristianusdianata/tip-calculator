import { arrayLoopHandler, useClass, useElement } from "../utils/index.js";
import { Element } from "./element.js";
import { Observable } from "./observable.js";
import type { ObservableInterface } from "./observable.js";
import type { ElementAPI } from "../utils/index.js";

export interface TipInterface {
  get value(): number;
  set value(value: number);
  get obs(): ObservableInterface;
  defaultState(): void;
  attachEvent(): void;
  errorUI({ isError, errMsg }: { isError: boolean; errMsg: string }): void;
  defaultUI(): void;
}

export class Tip extends Element implements TipInterface {
  private _value: number;
  private _obs: ObservableInterface;
  private input: ElementAPI<HTMLInputElement>;
  private errorLabel: ElementAPI<HTMLSpanElement>;
  private activeRadio: HTMLInputElement | null;
  private radios: NodeListOf<HTMLInputElement>;

  constructor() {
    super({ blockName: "tip" });
    this._value = 0;
    this._obs = useClass(Observable);
    this.activeRadio = null;
    this.input = useElement(
      <HTMLInputElement>this.element.querySelector(`.${this.blockName}__input`)
    );
    this.errorLabel = useElement(
      <HTMLLabelElement>(
        this.element.querySelector(`.${this.blockName}__label-error`)
      )
    );
    this.radios = this.element.querySelectorAll(
      `input[name="${this.blockName}-radio"][type="radio"]`
    );
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    this._value = Math.floor((value / 100) * 100) / 100;
  }

  get obs(): ObservableInterface {
    return this._obs;
  }

  defaultState(): void {
    this.value = 0;
  }

  private radiosCallback(func: (radio: HTMLInputElement) => void): void {
    arrayLoopHandler(Array.from(this.radios), (radio, _index) => {
      func(radio);
    });
  }

  // --------------------------- Event handler start ---------------------------
  private processInputValue<T extends keyof HTMLElementEventMap>(
    event: HTMLElementEventMap[T]
  ): void {
    const inputValue = Number((event.target as HTMLInputElement).value);
    this.value = Number(inputValue);
    this.obs.notifyError();
    this.obs.notifyOutput();
    this.obs.notifyUI();
  }

  private inputFocusHandler<T extends keyof HTMLElementEventMap>(
    _event: HTMLElementEventMap[T]
  ): void {
    const customRadio = <HTMLInputElement>(
      this.element.querySelector(
        `input#${this.blockName}-custom[name="${this.blockName}-radio"][type="radio"]`
      )
    );
    customRadio.checked = true;
    this.activeUI({ isActive: false });
    this.activeRadio = customRadio;
  }

  private radioChangeHandler<T extends keyof HTMLElementEventMap>(
    event: HTMLElementEventMap[T]
  ): void {
    if (this.activeRadio) {
      this.activeUI({ isActive: false });
    }

    const radio = event.target as HTMLInputElement;

    if (radio instanceof HTMLInputElement && radio.type === "radio") {
      this.activeRadio = radio;
      this.activeUI({ isActive: true });

      // check radio does not have value attribute (custome input)
      if (
        !Number.isNaN(radio.value) ||
        radio.value !== undefined ||
        radio.value !== null
      ) {
        this.value = Number(radio.value);
        const input = this.input.done();
        input.value = "";
        this.obs.notifyReset(); // reset error state
        this.obs.notifyOutput();
        this.obs.notifyUI();
      } else {
        this.value = 0;
      }
    }
  }

  attachEvent(): void {
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
  errorUI({ isError, errMsg }: { isError: boolean; errMsg: string }): void {
    this.errorLabel.setInnerText(errMsg);
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

    this.radiosCallback((radio) => {
      if (radio.checked === true) {
        useElement(
          <HTMLLabelElement>this.element.querySelector(`label[for=${radio.id}]`)
        )
          .removeClass(`${this.blockName}__button--active`)
          .done();
      }

      radio.checked = false;
    });
  }

  private activeUI({ isActive }: { isActive: boolean }): void {
    if (this.activeRadio) {
      useElement(
        <HTMLLabelElement>(
          this.element.querySelector(`label[for=${this.activeRadio.id}]`)
        )
      )
        .toggleClass(`${this.blockName}__button--active`, isActive)
        .done();
    }
  }
  // --------------------------- UI handler end ---------------------------
}
