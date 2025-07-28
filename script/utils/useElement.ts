import { objectLoopHandler } from "./utils.js";

export interface ElementAPI<T extends HTMLElement> {
  addClass: (
    classNames: string[] | string,
    conditionFn?: () => boolean
  ) => ElementAPI<T>;
  removeClass: (
    classNames: string[] | string,
    conditionFn?: () => boolean
  ) => ElementAPI<T>;
  toggleClass: (className: string, condition: boolean) => ElementAPI<T>;
  setInnerText: (text: string) => ElementAPI<T>;
  setAttribute: (
    attributes: Record<string, string>,
    conditionFn?: () => boolean
  ) => ElementAPI<T>;
  removeAttribute: (attrName: string) => ElementAPI<T>;
  setEventHandler: <K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ) => ElementAPI<T>;
  getAttribute: (attrName: string) => string;
  getDataAttribute: (attrName: string) => string;
  done: () => T;
}

/**
 * This function is used to enhance a given HTMLElement with a chainable API
 * that provides various DOM manipulation utilities.
 *
 * @param arg - Element to be wrapped and enhanced.
 * @returns Chainable methods for manipulating the element.
 * @example
 * const element = document.querySelector('button');
 * const api = useElement(element);
 *
 * api.addClass('active')
 *    .setInnerText('Loading...')
 *    .setAttribute({ disabled: 'true' })
 *    .done(); // returns the original button element
 */
export function useElement<T extends HTMLElement>(arg: T): ElementAPI<T> {
  const element = arg;
  const normalizeArray = (input: string[] | string): string[] =>
    Array.isArray(input) ? input : [input];

  const api: ElementAPI<T> = {
    addClass(classNames, conditionFn) {
      const isPass = conditionFn ? conditionFn() : true;
      if (isPass) {
        element.classList.add(...normalizeArray(classNames).filter(Boolean));
      }
      return api;
    },
    removeClass(classNames, conditionFn) {
      const shouldRun = conditionFn ? conditionFn() : true;
      if (shouldRun) {
        element.classList.remove(...normalizeArray(classNames).filter(Boolean));
      }
      return api;
    },

    toggleClass(className, condition) {
      element.classList.toggle(className, condition);
      return api;
    },

    setInnerText(text) {
      element.innerText = text;
      return api;
    },

    setAttribute(attributes, conditionFn) {
      const shouldRun = conditionFn ? conditionFn() : true;
      if (shouldRun) {
        objectLoopHandler(attributes, (value, key) => {
          element.setAttribute(key.toString(), value);
        });
      }
      return api;
    },

    removeAttribute(attrName) {
      element.removeAttribute(attrName);
      return api;
    },

    setEventHandler(event, handler, options) {
      element.addEventListener(event, handler, options);
      return api;
    },

    getAttribute(attrName) {
      return element.getAttribute(attrName) ?? "";
    },

    getDataAttribute(attrName) {
      return element.getAttribute(`data-${attrName}`) ?? "";
    },

    done() {
      return element;
    },
  };

  return api;
}
