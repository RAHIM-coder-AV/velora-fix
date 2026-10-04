import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "./route";

test("legacy EcoTrack endpoint cannot return a simulated shipment as success", async () => {
  const originalFetch = globalThis.fetch;
  let providerCalled = false;
  globalThis.fetch = async () => {
    providerCalled = true;
    throw new Error("Unexpected provider request");
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/ecotrack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "demo_ecotrack_token_dz",
          order: {
            reference: "VLR-12345678",
            customerName: "Test Customer",
            phone: "0555123456",
            wilaya: "16 - Alger",
            commune: "Alger Centre",
            address: "Test address",
            total: 2500,
            shipping: 400,
            isStopdesk: false,
            items: [{ name: "Test product", quantity: 1, price: 2500 }],
          },
        }),
      }),
    );
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.trackingCode, undefined);
    assert.equal(providerCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
