import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "./route";

const input = {
  company: "ecotrack",
  token: "safe-test-token-12345",
  baseUrl: "https://dhd.ecotrack.dz/api/v1",
};

function request(body: unknown) {
  return new Request("http://localhost/api/delivery/test-connection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("rejects the generic api.ecotrack.dz host without making a request", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("Unexpected carrier request");
  };
  try {
    const response = await POST(
      request({ ...input, baseUrl: "https://api.ecotrack.dz/api/v1" }),
    );
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("verifies the tenant token through the read-only validation endpoint", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl: URL | undefined;
  globalThis.fetch = async (input) => {
    requestedUrl = new URL(input.toString());
    return new Response(
      JSON.stringify({ success: true, message: "VALID_TOKEN" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  try {
    const response = await POST(request(input));
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(
      requestedUrl?.toString(),
      "https://dhd.ecotrack.dz/api/v1/validate/token?api_token=safe-test-token-12345",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports invalid credentials without returning the submitted token", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ success: false, message: "INVALID_TOKEN" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  try {
    const response = await POST(request(input));
    const body = await response.json();
    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.doesNotMatch(JSON.stringify(body), /safe-test-token-12345/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects demo tokens without contacting a tenant", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("Unexpected carrier request");
  };
  try {
    const response = await POST(
      request({ ...input, token: "demo_ecotrack_token_dz" }),
    );
    assert.equal(response.status, 400);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
