import assert from "node:assert/strict";
import { test } from "node:test";
import {
  enabledMetaPixelIds,
  enabledTikTokPixelIds,
  isValidMetaPixelId,
  isValidTikTokPixelId,
  normalizePixelSettings,
} from "@/lib/analytics/pixels";

test("pixel configuration defaults to empty disabled slots", () => {
  const pixels = normalizePixelSettings(undefined);
  assert.equal(pixels.metaPixelIds.length, 6);
  assert.equal(pixels.tiktokPixelIds.length, 4);
  assert.ok(pixels.metaPixelIds.every((id) => id === ""));
  assert.ok(pixels.metaPixelEnabled.every((enabled) => !enabled));
  assert.ok(pixels.tiktokPixelEnabled.every((enabled) => !enabled));
});

test("only valid enabled identifiers are sent to trackers", () => {
  const pixels = normalizePixelSettings({
    metaPixelIds: ["123456789012345", "not-a-meta-id", "987654321"],
    metaPixelEnabled: [true, true, false],
    tiktokPixelIds: ["C123456789ABCDEFG", "<script>alert(1)</script>"],
    tiktokPixelEnabled: [true, true],
  });

  test("identifier fields reject malformed values but allow empty unused slots", () => {
    assert.equal(isValidMetaPixelId(""), true);
    assert.equal(isValidMetaPixelId("123456789012345"), true);
    assert.equal(isValidMetaPixelId("1234abc"), false);
    assert.equal(isValidTikTokPixelId(""), true);
    assert.equal(isValidTikTokPixelId("C123456789ABCDEFG"), true);
    assert.equal(isValidTikTokPixelId("<script>alert(1)</script>"), false);
  });

  assert.deepEqual(enabledMetaPixelIds(pixels), ["123456789012345"]);
  assert.deepEqual(enabledTikTokPixelIds(pixels), ["C123456789ABCDEFG"]);
});
