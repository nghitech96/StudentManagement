export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

function resolveUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

async function requestWithMetadata(path, options = {}) {
  const response = await fetch(resolveUrl(path), {
    credentials: "same-origin",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body,
  };
}

async function request(path, options = {}) {
  const result = await requestWithMetadata(path, options);
  if (!result.ok) {
    const error = new Error(result.body?.detail || result.body?.message || "Đã có lỗi xảy ra.");
    error.status = result.status;
    throw error;
  }

  return result.body;
}

export const api = {
  login: (credentials) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (details) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(details),
    }),
  saveDraft: (endpoint, draft) =>
    requestWithMetadata(endpoint, {
      method: "POST",
      body: JSON.stringify(draft),
    }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  users: () => request("/api/users"),
  health: () => request("/api/health"),
};
