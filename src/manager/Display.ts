import { describe, expect, test } from "vitest";

export function Display<T>(
  io: (...data: any[]) => void,
  factory: (io: (...data: any[]) => void, item: T) => void,
) {
  return (item: T) => {
    return factory(io, item);
  };
}
