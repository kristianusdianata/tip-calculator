import { arrayLoopHandler } from "../utils/index.js";

type Func = () => void | Promise<void>;

export interface ObservableInterface {
  subcribeCalculate(listener: Func | Func[]): void;
  subcribeError(listener: Func | Func[]): void;
  subcribeUI(listener: Func | Func[]): void;
  subcribeReset(listener: Func | Func[]): void;
  unSubcribeCalculate(targetListener: Func): void;
  unSubcribeError(targetListener: Func): void;
  unSubcribeUI(targetListener: Func): void;
  unSubcribeReset(targetListener: Func): void;
  notifyCalculate(): void;
  notifyError(): void;
  notifyUI(): void;
  notifyReset(): void;
}

export class Observable implements ObservableInterface {
  private calculateListeners: Func[] = [];
  private errorListeners: Func[] = [];
  private UIListener: Func[] = [];
  private resetListener: Func[] = [];

  // ------------------------------ Subcribe start ------------------------------
  subcribeCalculate(listener: Func | Func[]): void {
    if (Array.isArray(listener)) {
      this.calculateListeners.push(...listener);
    } else {
      this.calculateListeners.push(listener);
    }
  }

  subcribeError(listener: Func | Func[]): void {
    if (Array.isArray(listener)) {
      this.errorListeners.push(...listener);
    } else {
      this.errorListeners.push(listener);
    }
  }

  subcribeUI(listener: Func | Func[]): void {
    if (Array.isArray(listener)) {
      this.UIListener.push(...listener);
    } else {
      this.UIListener.push(listener);
    }
  }

  subcribeReset(listener: Func | Func[]): void {
    if (Array.isArray(listener)) {
      this.resetListener.push(...listener);
    } else {
      this.resetListener.push(listener);
    }
  }
  // ------------------------------ Subcribe end ------------------------------

  // ------------------------------ Unsubcribe start ------------------------------
  unSubcribeCalculate(targetListener: Func): void {
    this.calculateListeners = this.calculateListeners.filter(
      (listener) => listener !== targetListener
    );
  }

  unSubcribeError(targetListener: Func): void {
    this.errorListeners = this.errorListeners.filter(
      (listener) => listener !== targetListener
    );
  }

  unSubcribeUI(targetListener: Func): void {
    this.UIListener = this.UIListener.filter(
      (listener) => listener !== targetListener
    );
  }

  unSubcribeReset(targetListener: Func): void {
    this.resetListener = this.resetListener.filter(
      (listener) => listener !== targetListener
    );
  }
  // ------------------------------ Unsubcribe end ------------------------------

  // ------------------------------ Notify start ------------------------------
  notifyCalculate(): void {
    arrayLoopHandler(this.calculateListeners, (func, _index) => {
      func();
    });
  }

  notifyError(): void {
    arrayLoopHandler(this.errorListeners, (func, _index) => {
      func();
    });
  }

  notifyUI(): void {
    arrayLoopHandler(this.UIListener, (func, _index) => {
      func();
    });
  }

  notifyReset(): void {
    arrayLoopHandler(this.resetListener, (func, _index) => {
      func();
    });
  }
  // ------------------------------ Notify end ------------------------------
}
