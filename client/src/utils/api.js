const BASE = "/api";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  getAds:       ()       => req("GET",    "/ads"),
  getAd:        (id)     => req("GET",    `/ads/${id}`),
  generateAd:   (form)   => req("POST",   "/ads/generate", form),
  updateAd:     (id, d)  => req("PUT",    `/ads/${id}`, d),
  deleteAd:     (id)     => req("DELETE", `/ads/${id}`),
  deleteAllAds: ()       => req("DELETE", "/ads"),
  getPresets:   ()       => req("GET",    "/presets"),
  getStats:     ()       => req("GET",    "/stats"),
  health:       ()       => req("GET",    "/health"),
};
