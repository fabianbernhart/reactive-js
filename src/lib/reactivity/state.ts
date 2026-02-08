"use strict";

/**
 * Reactivity State type
 */
export type State = {
  activeEffect: (() => void) | null;
};
/**
 * Shared reactivity State
 */
export const state: State = {
  activeEffect: null,
};
