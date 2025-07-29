import { Bill, Calculate, ErrorHandler, People, Tip } from "./classes/index.js";
import { useClass } from "./utils/index.js";
import { useValidator } from "./validator.js";
const bill = useClass(Bill);
const tip = useClass(Tip);
const people = useClass(People);
const calculate = useClass(Calculate);
const errorHandler = useClass(ErrorHandler);
function toggleButtonDisabled() {
    if (bill.value <= 0 && tip.value <= 0 && people.value <= 0) {
        calculate.disableButton({ isDisabled: true });
    }
    else {
        calculate.disableButton({ isDisabled: false });
    }
}
function updateOutputLabel() {
    calculate.updateOutputLabel({
        billPerPerson: calculate.totalBillPerPeople,
        tipPerPerson: calculate.totalTipPerPeople,
    });
}
function calculation() {
    if (bill.value <= 0 || tip.value <= 0 || people.value <= 0) {
        calculate.totalTipPerPeople = 0;
        calculate.totalBillPerPeople = 0;
        return;
    }
    calculate.totalTipPerPeople =
        Math.floor(((bill.value * tip.value) / people.value) * 100) / 100;
    calculate.totalBillPerPeople =
        Math.floor((bill.value / people.value + calculate.totalTipPerPeople) * 100) / 100;
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
    bill.obs.subcribeCalculate(calculation);
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
    tip.obs.subcribeCalculate(calculation);
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
    people.obs.subcribeCalculate(calculation);
    people.obs.subcribeUI([
        toggleButtonDisabled,
        updateOutputLabel,
        peopleErrorUI,
    ]);
    // Set event listener
    people.attachEvent();
}
// --------------------- People controller end ---------------------
// --------------------- Calculate controller start ---------------------
function calculateController() {
    const resetValue = () => {
        bill.defaultState();
        tip.defaultState();
        people.defaultState();
        calculate.defaultState();
        errorHandler.defaultState();
    };
    const defaultUI = () => {
        bill.defaultUI();
        tip.defaultUI();
        people.defaultUI();
        calculate.updateOutputLabel({
            billPerPerson: calculate.totalBillPerPeople,
            tipPerPerson: calculate.totalTipPerPeople,
        });
        calculate.disableButton({ isDisabled: true });
    };
    calculate.obs.subcribeReset(resetValue);
    calculate.obs.subcribeUI(defaultUI);
    // Set event listener
    calculate.attachEvent();
}
// --------------------- Calculate controller end ---------------------
billController();
tipController();
peopleController();
calculateController();
