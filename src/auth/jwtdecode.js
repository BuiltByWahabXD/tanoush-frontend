export function decodeJwt(token) {

  if (!token) return null;
  
  try {
  
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  
}catch (err) {
    return null;
  }
}

export default decodeJwt;
