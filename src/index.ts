"use strict";

import { monsterDisplayFactory } from "./models/monster.js";
import { Display } from "./manager/Display.js";

import type { Monster } from "./models/monster.js";

const logger = console;

type Signal<T> = {
  set(value: T): void;
  value: T;
  update: (fn: (updateValue: T) => T) => void;
};

export function signal<T = unknown>(initialValue: T) {
  let localValue = initialValue;

  return {
    set(value: T) {
      localValue = value;
    },
    /**
     * Gets the value from the `signal`
     */
    get value() {
      return localValue;
    },

    set value(v: T) {
      localValue = v;
    },

    update: (func: (updateValue: T) => T) => {
      localValue = func(localValue);
    },
  } as Signal<T>;
}

/**
 * TODO: Yes this is the goal
 */
export function computed(fn: () => number) {
  let localValue = fn();

  return {
    get value() {
      return localValue;
    },

    set value(v: number) {
      localValue = v;
    },
  };
}

export function watch<T extends object>(
  target: T,
  fn: (oldValue: T, newValue: T) => void,
) {
  return new Proxy(target, {
    set(target, prop, newValue, receiver) {
      fn(target, target);

      logger.debug("It watching it");

      return Reflect.set(target, prop, newValue, receiver);
    },
  });
}

function ref<T>(initValue: T) {
  const localValue = new Proxy(
    {
      value: initValue,
    },
    {},
  );

  return {
    get value() {
      return localValue.value;
    },
    set value(v: T) {
      localValue.value = v;
    },
  };
}

const monster = signal<Monster>({ name: "Urus", emotion: "happy" });

export function reactive<T extends object>(data: T) {
  return new Proxy(data, {
    get(target, p, receiver) {
      // logger.debug(`get ${String(p)} debug reactive`, { target });

      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
      // logger.debug(`set ${String(p)} to ${String(newValue)}`, { target });

      return Reflect.set(target, p, newValue, receiver);
    },
  });
}

const data = reactive({
  health: 100,
});

watch(data, () => {
  logger.debug("I really tracked the data");
});

data.health = 20;
data.health--;

/// console.debug("reactive data health", data.health);

// const displayMonster = Display(console.debug, monsterDisplayFactory);
//
// const proxy = watch(monster, (oldValue, newValue) => {
//   logger.info("System: Urus changes emotions...");
// });
//
// logger.debug("Say Urus, you are not scary");
//
// monster.value = { ...monster.value, emotion: "sad" };
//
// displayMonster(monster.value);
//
// logger.debug("Kick Urus");
//
// monster.value = { ...monster.value, emotion: "angry" };
//
// displayMonster(monster.value);

/**
 * Signals call the subscribers on change in by calling the `activeEffect`
 * ```ts
 * function main() {
 *  const [counter, setCounter] = createSignal(5);
 *  createEffect(() => {
      console.log("The counter got updated to", count());
    });

    setCounter(10) // "The counter got updated to 5

 * }
 * ```
 * 
 * 
 * 
 */

let info = undefined;

/**
 * SolidJs Observer https://www.youtube.com/watch?v=cELFZQAMdhQ
 * The active effect
 */
let activeEffect: (() => void) | null = null;

/**
 * Runs every time an signal got updated
 * @param fn
 */
export function createEffect(fn: () => void) {
  const execute = () => {
    activeEffect = execute;
    try {
      fn();
    } finally {
      activeEffect = null;
    }
  };

  execute();
}

export function createSignal<T>(value: T): [() => T, (value: T) => void] {
  const subscribers = new Set<() => void>();

  const get = () => {
    if (activeEffect) {
      subscribers.add(activeEffect);
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

function main() {
  const [count, setCount] = createSignal(2);
  const [multiplier, setMultiplier] = createSignal(2);

  createEffect(() => {
    console.log("get count", count(), multiplier());
  });

  createEffect(() => {
    console.log("get multi", multiplier());
  });

  setCount(4);

  setMultiplier(5);
}

main();
