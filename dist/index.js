import { Bill, Output, ErrorHandler, People, Tip } from "./classes/index.js";
import { useClass } from "./utils/index.js";
import { useValidator } from "./validator.js";
const bill = useClass(Bill);
const tip = useClass(Tip);
const people = useClass(People);
const output = useClass(Output);
const errorHandler = useClass(ErrorHandler);
function toggleButtonDisabled() {
    if (bill.value <= 0 && tip.value <= 0 && people.value <= 0) {
        output.disableButton({ isDisabled: true });
    }
    else {
        output.disableButton({ isDisabled: false });
    }
}
function updateOutputLabel() {
    output.updateOutputLabel({
        billPerPerson: output.totalBillPerPeople,
        tipPerPerson: output.totalTipPerPeople,
    });
}
function calculation() {
    if (bill.value <= 0 || tip.value <= 0 || people.value <= 0) {
        output.totalTipPerPeople = 0;
        output.totalBillPerPeople = 0;
        return;
    }
    output.totalTipPerPeople =
        Math.floor(((bill.value * tip.value) / people.value) * 100) / 100;
    output.totalBillPerPeople =
        Math.floor((bill.value / people.value + output.totalTipPerPeople) * 100) /
            100;
}
function validateInput({ input }) {
    const targetInput = Number(input);
    const result = useValidator(targetInput);
    if (result instanceof Error) {
        errorHandler.isError = true;
        errorHandler.errMsg = result.message;
    }
    else {
        errorHandler.isError = false;
        errorHandler.errMsg = "";
    }
}
// --------------------- Bill controller start ---------------------
function billController() {
    const billErrorHandler = () => {
        validateInput({ input: bill.value });
        if (errorHandler.isError && errorHandler.errMsg) {
            bill.value = 0;
        }
    };
    const billErrorUI = () => {
        bill.errorUI({
            isError: errorHandler.isError,
            errMsg: errorHandler.errMsg,
        });
    };
    // Subscribe to observer's event
    bill.obs.subcribeError(billErrorHandler);
    bill.obs.subcribeOutput(calculation);
    bill.obs.subcribeUI([toggleButtonDisabled, updateOutputLabel, billErrorUI]);
    // Set event listener
    bill.attachEvent();
}
// --------------------- Bill controller end ---------------------
// --------------------- Tip controller start ---------------------
function tipController() {
    const resetError = () => {
        errorHandler.isError = false;
        errorHandler.errMsg = "";
    };
    const tipErrorHandler = () => {
        validateInput({ input: tip.value });
        if (errorHandler.isError && errorHandler.errMsg) {
            tip.value = 0;
        }
    };
    const tipErrorUI = () => {
        tip.errorUI({
            isError: errorHandler.isError,
            errMsg: errorHandler.errMsg,
        });
    };
    // Subscribe to observer's event
    tip.obs.subcribeError(tipErrorHandler);
    tip.obs.subcribeOutput(calculation);
    tip.obs.subcribeReset(resetError);
    tip.obs.subcribeUI([toggleButtonDisabled, updateOutputLabel, tipErrorUI]);
    // Set event listener
    tip.attachEvent();
}
// --------------------- Tip controller end ---------------------
// --------------------- People controller start ---------------------
function peopleController() {
    const peopleErrorHandler = () => {
        validateInput({ input: people.value });
        if (errorHandler.isError && errorHandler.errMsg) {
            people.value = 0;
        }
    };
    const peopleErrorUI = () => {
        people.errorUI({
            isError: errorHandler.isError,
            errMsg: errorHandler.errMsg,
        });
    };
    // Subscribe to observer's event
    people.obs.subcribeError(peopleErrorHandler);
    people.obs.subcribeOutput(calculation);
    people.obs.subcribeUI([
        toggleButtonDisabled,
        updateOutputLabel,
        peopleErrorUI,
    ]);
    // Set event listener
    people.attachEvent();
}
// --------------------- People controller end ---------------------
// --------------------- Output controller start ---------------------
function outputController() {
    const resetValue = () => {
        bill.defaultState();
        tip.defaultState();
        people.defaultState();
        output.defaultState();
        errorHandler.defaultState();
    };
    const defaultUI = () => {
        bill.defaultUI();
        tip.defaultUI();
        people.defaultUI();
        output.updateOutputLabel({
            billPerPerson: output.totalBillPerPeople,
            tipPerPerson: output.totalTipPerPeople,
        });
        output.disableButton({ isDisabled: true });
    };
    output.obs.subcribeReset(resetValue);
    output.obs.subcribeUI(defaultUI);
    // Set event listener
    output.attachEvent();
}
// --------------------- Calculate controller end ---------------------
billController();
tipController();
peopleController();
outputController();
