import { assert, equal, assertThrows, assertThrowsAsync } from "../deps.ts";
const { test } = Deno;

test("should work", () => {
  const universal = 42;
  equal(42, universal);
  assert(42 === universal);
});

test("assertThrows", () => {
  assertThrows(
    (): void => {
      throw new TypeError("hello world!");
    },
    TypeError,
    "world",
  );
});

test("assertThrowsAsync", async () => {
  await assertThrowsAsync(async (): Promise<void> => {
    throw new TypeError("hello world!");
  }, TypeError);
  await assertThrowsAsync(
    async (): Promise<void> => {
      throw new TypeError("hello world!");
    },
    TypeError,
    "hello",
  );
});
