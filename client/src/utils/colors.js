export const hexToRgb = (hex) => {
  if (!hex || hex.length < 7) return { r: 0, g: 0, b: 0 };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

export const luminance = ({ r, g, b }) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

export const contrastColor = (hex) => {
  if (!hex || !hex.startsWith("#")) return "#f8f8f8";
  try {
    const rgb = hexToRgb(hex);
    return luminance(rgb) > 0.32 ? "#0a0a0a" : "#f8f8f8";
  } catch { return "#f8f8f8"; }
};

export const darken = (hex, amt) => {
  if (!hex || !hex.startsWith("#")) return hex || "#000";
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  return `#${[clamp(r - amt), clamp(g - amt), clamp(b - amt)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export const lighten = (hex, amt) => darken(hex, -amt);

export const alphaHex = (hex, alpha) => {
  if (!hex || !hex.startsWith("#")) return "transparent";
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
};
