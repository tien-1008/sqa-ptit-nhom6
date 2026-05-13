interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export function getStoredToken(): string | null {
  return localStorage.getItem("sqa-token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token = getStoredToken()
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data;
}
