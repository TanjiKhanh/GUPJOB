// Simple in-memory token storage.
// Access token lives in memory to reduce XSS risk.
// This module is intentionally tiny — use React Context to expose to UI.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}