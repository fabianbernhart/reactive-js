"use strict";

import { state } from "./state.js";

export function createSignal<T>(value: T): [() => T, (value: T) => void] {
  const subscribers = new Set<() => void>();

  const get = () => {
    if (state.activeEffect) {
      subscribers.add(state.activeEffect);
    }
    return value;
  };

  const set = (newValue: T) => {
    value = newValue;

    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return [get, set];
}
