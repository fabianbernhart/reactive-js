"use strict";

import { createEffect, createSignal } from "./lib/reactivity/index.js";

function main() {
  const [counter, setCount] = createSignal(1);
  const [multiplier, setMultiplier] = createSignal(1);

  createEffect(() => {
    document.getElementById("app")!.textContent = String(
      counter() * multiplier(),
    );
  });

  const incrementButton = document.getElementById("btn-increment");
  const decreaseButton = document.getElementById("btn-decrease");
  const multi = document.getElementById("multiplier");

  incrementButton?.addEventListener("click", () => {
    setCount(counter() + 1);
  });

  /** TODO: improve typing */
  multi?.addEventListener("input", (e: any) => {
    setMultiplier(Number(e.target.value));
  });

  decreaseButton?.addEventListener("click", () => {
    if (counter() === 0) return;

    setCount(counter() - 1);
  });
}

main();
