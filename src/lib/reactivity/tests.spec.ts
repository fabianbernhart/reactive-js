import { describe, expect, test, vi } from "vitest";
import { createEffect, createSignal } from "../index.js";

describe("Reactivity Test Suite", () => {
  test("Expect `createEffect` scope to be called", () => {
    const [count, setCount] = createSignal(2);
    const mock = vi.fn();

    const fn = () => {
      count();
      mock();
    };

    createEffect(fn);
    setCount(4);

    /** once on initialization of the effect and once on update Count */
    expect(mock).toBeCalledTimes(2);
  });

  test.todo("Optimization Effect should be called once: Effect Scheduler");
});
