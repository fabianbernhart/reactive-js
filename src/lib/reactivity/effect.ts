"use strict";
import { state } from "./state.js";

/**
 * Will execute if an in scope living signal be updated
 * # Example
 * ```ts
 * const [count, setCount] = createSignal(2);
 * const [some, setSome] = createSignal(2);
 *
 * createEffect(() => {
 *  called()
 *});
 *
 * // Will rerun the createEffect function scope
 * setCount(4)
 * // No effect will be run
 * setSome(4)
 * ```
 * @param fn
 */

export function createEffect(fn: () => void) {
  const execute = () => {
    state.activeEffect = execute;
    try {
      fn();
    } finally {
      state.activeEffect = null;
    }
  };

  execute();
}
