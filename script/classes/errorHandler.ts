export interface ErrorHandlerInterface {
  get isError(): boolean;
  set isError(_isError: boolean);
  get errMsg(): string;
  set errMsg(msg: string);
  defaultState(): void;
}

export class ErrorHandler implements ErrorHandlerInterface {
  private _isError: boolean;
  private _errMsg: string;

  constructor() {
    this._isError = false;
    this._errMsg = "";
  }

  get isError() {
    return this._isError;
  }

  set isError(_isError: boolean) {
    this._isError = _isError;
  }

  get errMsg() {
    return this._errMsg;
  }

  set errMsg(msg: string) {
    this._errMsg = msg;
  }

  defaultState(): void {
    this.isError = false;
    this._errMsg = "";
  }
}
