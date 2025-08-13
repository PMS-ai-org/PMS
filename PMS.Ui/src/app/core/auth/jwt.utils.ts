export function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch { return null; }
}

export function getExpiry(token: string): Date | null {
  const p = decodeJwtPayload(token);
  return p?.exp ? new Date(p.exp * 1000) : null;
}