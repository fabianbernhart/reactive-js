"use strict";

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
  target: Signal<T>,
  fn: (oldValue: T, newValue: T) => void,
) {
  return new Proxy(target, {
    set(_target, prop, _value) {
      if (prop === "value") {
        fn(target.value, target.value);
        return true;
      } else {
        // TODO: understand `Reflect`
        /// @ts-ignore
        return Reflect.set(...arguments);
      }
    },
  } as ProxyHandler<{ value: T }>);
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

type Monster = { name: string; emotion: "sad" | "happy" | "angry" };

const monster = signal<Monster>({ name: "Urus", emotion: "happy" });

const DisplayManager = <T>(
  io: (...data: any[]) => void,
  factory: (io: (...data: any[]) => void, item: T) => void,
) => {
  return (item: T) => {
    return factory(io, item);
  };
};

const monsterDisplayFactory = (
  display: (...data: unknown[]) => void,
  monster: Monster,
) => {
  if (monster.emotion === "angry") {
    return display(`${monster.name}: ARRRGGGHGHHHHHH ${monster.emotion}`);
  }
  if (monster.emotion === "sad") {
    return display(`${monster.name}: ughhh* thats mean ${monster.emotion}`);
  }
  if (monster.emotion === "happy") {
    return display(`${monster.name}: Happy me!!! ${monster.emotion}`);
  }
};

const displayMonster = DisplayManager(console.debug, monsterDisplayFactory);

const proxy = watch(monster, (oldValue, newValue) => {
  logger.info("System: Urus changes emotions...");
});

logger.debug("Say Urus, you are not scary");

monster.value = { ...monster.value, emotion: "sad" };

displayMonster(monster.value);

logger.debug("Kick Urus");

monster.value = { ...monster.value, emotion: "angry" };

displayMonster(monster.value);
