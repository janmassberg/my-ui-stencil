/**
 * Prevent a function from being called multiple times within a time period.
 */
export const debounce = <T>(
  fn: (args?: T) => void,
  wait: number,
): ((args?: T) => void) => {
  let timeout: any;
  return function (): void {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(context, args);
    }, wait);
  };
};
