export class ErrorHandler {
    constructor() {
        this._isError = false;
        this._errMsg = "";
    }
    get isError() {
        return this._isError;
    }
    set isError(_isError) {
        this._isError = _isError;
    }
    get errMsg() {
        return this._errMsg;
    }
    set errMsg(msg) {
        this._errMsg = msg;
    }
    defaultState() {
        this.isError = false;
        this._errMsg = "";
    }
}
