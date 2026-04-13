const COOKIE = "auth_token";

export function getToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function setToken(token: string): void {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

export function clearToken(): void {
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
}

export function logout(): void {
  clearToken();
  window.location.href = "/login";
}
