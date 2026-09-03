import { expect, test } from "bun:test";

test("Multi-Touch 3D projects contacts and document transforms without moving the phone", async () => {
  const source = await Bun.file(new URL("./MultiTouch3D.tsx", import.meta.url)).text();

  expect(source).toContain("model.updateTouchContacts(");
  expect(source).not.toContain("model.mainGroup.rotation");
});
