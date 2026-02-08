"use strict";

import { createEffect, createSignal } from "./lib/reactivity/index.js";

function main() {
  const [count, setCount] = createSignal(2);
  const [multiplier, setMultiplier] = createSignal(2);

  createEffect(() => {
    console.log("get multi", count() * multiplier());
  });

  setCount(4);

  setMultiplier(5);
}

main();
