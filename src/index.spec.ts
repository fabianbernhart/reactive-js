import { describe, test, expect, vi } from "vitest";
import { computed, signal, watch } from "./index.js";

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

  describe("test watch", () => {
    test("watching updates on proxy update", () => {
      const logger = {
        log: vi.fn(),
      };

      const counter = signal({ value: "Hello" });

      const proxy = watch(counter, () => {
        logger.log("watch that i did it!");
      });

      proxy.value = { value: "Bye" };

      expect(logger.log).toBeCalledWith("watch that i did it!");
    });
  });
});
