import { debounce } from "./debounce";

jest.useFakeTimers();

describe("debounce", () => {
  it("the Callback is only called once when invoked a second time immediately", () => {
    expect.assertions(1);
    const callback = jest.fn();

    const func = debounce(callback, 100);
    func();
    func();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("the Callback is called twice when invoked after the right amount of time", () => {
    expect.assertions(1);
    const callback = jest.fn();

    const func = debounce(callback, 100);
    func();
    setTimeout(() => {
      func();
    }, 200);
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
