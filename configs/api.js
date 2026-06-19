const raw = process.env.NEXT_PUBLIC_BELL3_API_URL || "";

export const API_BASE_URL = raw.endsWith("/") ? raw : `${raw}/`;

export function apiUrl(path = "") {
  const normalizedPath = String(path).replace(/^\//, "");
  return `${API_BASE_URL}${normalizedPath}`;
}

export function getAuthHeaders(extra = {}, { json = true } = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = new Error(`API error: ${response.status}`);
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      error.data = null;
    }
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}

export async function apiFetchForm(path, formData, options = {}) {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    ...options,
    headers: {
      ...getAuthHeaders({}, { json: false }),
      ...(options.headers || {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = new Error(`API error: ${response.status}`);
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      error.data = null;
    }
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}

export const commonHeaders = {
  "ngrok-skip-browser-warning": "true",
  Accept: "application/json",
  "Content-Type": "application/json",
};
