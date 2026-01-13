const API_URL = import.meta.env.VITE_API_URL;

async function attemptRefresh() {
  try {
    const res = await fetch(`${API_URL}/api/users/refresh`, {
      method: "POST",
      headers: { "Accept": "application/json" },
      credentials: "include",
    });

    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    return data?.success === true;
  } catch (err) {
    console.error("attemptRefresh error:", err);
    return false;
  }
}

export async function apiFetch(path, { method = "GET", body, headers = {}, retry = true, ...rest } = {}) {
  const url = `${API_URL}${path}`;
  const opts = {
    method,
    headers: {
      ...headers,
      "Accept": "application/json",
    },
    credentials: "include",
    ...rest,
  };

  if (body && !(body instanceof FormData))
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
   

  const res = await fetch(url, opts);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") 
    ? await res.json().catch(() => null) 
    : await res.text().catch(() => null);

  if (res.ok) return data;

  if (res.status === 401 && retry && !path.includes("/refresh") && !path.includes("/logout")) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiFetch(path, { method, body, headers, retry: false, ...rest });
    } else {
      // Refresh failed - clear everything and logout
      localStorage.removeItem("isAuthenticated");
      
      // Call backend logout to clear cookies
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include"
      }).catch(() => {}); // Silent fail if already logged out
      
      // Redirect to login
      window.location.href = "/login";
    }
  }

  const err = new Error(data?.message || res.statusText || "Request failed");
  err.status = res.status;
  err.data = data;
  throw err;
}
