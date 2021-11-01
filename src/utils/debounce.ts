/**
 * Prevent a function from being called multiple times within a time period.
 */
export const debounce = (func: Function, wait: number): Function => {
  let timeout: any;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};
