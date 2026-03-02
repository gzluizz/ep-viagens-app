// simple wrapper that injects token
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized - clear token and reload to force login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      // reject so callers know
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }
    const errText = await res.text();
    let errData;
    try { errData = JSON.parse(errText); } catch { errData = errText; }
    const error = new Error(errData.error || res.statusText);
    error.status = res.status;
    error.data = errData;
    throw error;
  }
  return res.json();
}
