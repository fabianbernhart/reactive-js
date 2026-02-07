import { describe, test, expect, vi } from "vitest";
import {
  computed,
  createEffect,
  createSignal,
  reactive,
  signal,
  watch,
} from "./index.js";

describe("ReactiveUI - Engine", () => {
  describe("test `signal`", () => {
    test("test create signal ", () => {
      const counter = signal(67);

      expect(counter.value).toEqual(67);
    });
    test("counter.value = 67", () => {
      const counter = signal<string | number>("");

      counter.value = 67;

      expect(counter.value).toEqual(67);
    });
    test("counter.value++", () => {
      const counter = signal(67);

      counter.value++;

      expect(counter.value).toEqual(68);
    });
    test("counter.value * 9", () => {
      const counter = signal(67);

      counter.value = counter.value * 9;

      expect(counter.value).toEqual(603);
    });
  });

  describe("test reactive", () => {
    test("test sharede state between two reactive object", () => {
      const data = reactive({
        health: 100,
      });

      const test = reactive({
        data,
      });

      data.health--;
      data.health--;

      test.data.health--;

      expect(data.health).toEqual(test.data.health);
      expect(test.data.health).toEqual(97);
    });
  });

  describe("Create signals", () => {
    test("Create and read a Signal", () => {
      const [value] = createSignal(5);
      expect(value()).toBe(5);
    });
  });
  describe("Create effect", () => {
    test("Create effect and call signal", () => {
      let effectCalled = false;
      const [value] = createSignal(5);

      createEffect(() => {
        value();
        effectCalled = true;
      });

      expect(effectCalled).true;
    });
  });
});
