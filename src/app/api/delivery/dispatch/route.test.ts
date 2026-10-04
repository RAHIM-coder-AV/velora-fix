import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "./route";

const baseRequest = {
  company: "ecotrack",
  token: "real-test-token-123",
  baseUrl: "https://api.ecotrack.dz/api/v1",
  orders: [
    {
      id: "order-1",
      reference: "VLR-12345678",
      customerName: "Test Customer",
      phone: "0555123456",
      wilaya: "16 - Alger",
      commune: "Alger Centre",
      address: "Test address",
      total: 2500,
      shipping: 400,
      items: [{ name: "Test product", quantity: 1 }],
    },
  ],
};

function request(body: unknown) {
  return new Request("http://localhost/api/delivery/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("rejects demo tokens without contacting a delivery provider", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("Unexpected provider request");
  };
  try {
    const response = await POST(request({ ...baseRequest, token: "demo_ecotrack_token_dz" }));
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects untrusted endpoints before sending credentials", async () => {
  const response = await POST(
    request({ ...baseRequest, baseUrl: "https://example.com/api/v1" }),
  );
  assert.equal(response.status, 400);
});

test("does not report success when the provider rejects the request", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const response = await POST(request(baseRequest));
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.results[0].success, false);
    assert.equal(body.results[0].trackingCode, undefined);
    assert.match(body.results[0].error, /Invalid credentials/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("requires a provider tracking code instead of inventing one", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: true, message: "Created" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const response = await POST(request(baseRequest));
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.results[0].success, false);
    assert.equal(body.results[0].trackingCode, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports success only with a tracking code returned by the provider", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: true, data: { tracking_code: "ECO-12345" } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const response = await POST(request(baseRequest));
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.results[0].success, true);
    assert.equal(body.results[0].trackingCode, "ECO-12345");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports network failures as failures", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError("network failure");
  };
  try {
    const response = await POST(request(baseRequest));
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.results[0].success, false);
    assert.equal(body.results[0].trackingCode, undefined);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
