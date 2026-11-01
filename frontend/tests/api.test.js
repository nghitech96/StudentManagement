import assert from "node:assert/strict";
import test from "node:test";
import { api } from "../src/api/http.js";

test("login sends the email and password as JSON", async (t) => {
  let requestUrl;
  let requestOptions;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return new Response(JSON.stringify({
      id: "user-001",
      username: "student",
      email: "student@example.test",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });

  const result = await api.login({ username: "student@example.test", password: "pass1234" });

  assert.equal(requestUrl, "/api/auth/login");
  assert.equal(requestOptions.method, "POST");
  assert.equal(requestOptions.credentials, "same-origin");
  assert.deepEqual(JSON.parse(requestOptions.body), {
    username: "student@example.test",
    password: "pass1234",
  });
  assert.equal(result.email, "student@example.test");
});

test("API errors retain the server message and status", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
    detail: "Email đã được sử dụng.",
  }), {
    status: 409,
    headers: { "Content-Type": "application/json" },
  }));

  await assert.rejects(
    api.register({ username: "student", email: "student@example.test", password: "pass1234" }),
    (error) => error.message === "Email đã được sử dụng." && error.status === 409,
  );
});

test("draft saving returns HTTP metadata and serializes the payload", async (t) => {
  let requestUrl;
  let requestOptions;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return new Response(JSON.stringify({
      message: "Draft saved successfully.",
      data: { applicationId: "HL202610310001", status: "DRAFT" },
    }), {
      status: 201,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  });
  const draft = {
    applicationId: "HL202610310001",
    productType: "HOME_LOAN",
    status: "DRAFT",
  };

  const result = await api.saveDraft("/api/drafts", draft);

  assert.equal(requestUrl, "/api/drafts");
  assert.equal(requestOptions.method, "POST");
  assert.deepEqual(JSON.parse(requestOptions.body), draft);
  assert.equal(result.status, 201);
  assert.equal(result.ok, true);
  assert.equal(result.headers["cache-control"], "no-store");
  assert.equal(result.body.data.applicationId, "HL202610310001");
});

test("draft saving can target an independently hosted API URL", async (t) => {
  let requestUrl;
  t.mock.method(globalThis, "fetch", async (url) => {
    requestUrl = url;
    return new Response(JSON.stringify({ message: "Draft saved successfully." }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  });

  await api.saveDraft("https://student-management-api.onrender.com/api/drafts", {
    applicationId: "HL202610310001",
  });

  assert.equal(requestUrl, "https://student-management-api.onrender.com/api/drafts");
});
