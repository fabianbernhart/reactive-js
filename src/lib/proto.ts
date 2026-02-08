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
