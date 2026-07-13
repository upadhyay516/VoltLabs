// Single source of truth for every theme in the app. Add a theme here once
// and it automatically shows up in: the ThemeName type, the navbar cycle
// button, the Account settings picker, and the /themes gallery page.

export type ThemeName =
  | "y2k"
  | "midnight"
  | "obsidian"
  | "cyberlime"
  | "nightfall"
  | "slate"
  | "dusk"
  | "ocean"
  | "glacier"
  | "steel"
  | "aurora"
  | "sage"
  | "forest"
  | "meadow"
  | "terracotta"
  | "rosewood"
  | "solaris"
  | "citrus"
  | "coral"
  | "paper"
  | "blossom"
  | "ivory"
  | "plum"
  | "amethyst";

export type ThemeCategory =
  | "Retro & Neon"
  | "Cool & Calm"
  | "Nature & Earth"
  | "Warm & Cozy"
  | "Light & Minimal"
  | "Rich & Elegant";

export interface ThemeDef {
  value: ThemeName;
  label: string;
  shortLabel: string;
  category: ThemeCategory;
  description: string;
  colors: { bg: string; panel: string; accent: string; accent2: string };
}

export const THEMES: ThemeDef[] = [
  // ---- Retro & Neon ----
  {
    value: "y2k",
    label: "Y2K Neon",
    shortLabel: "Y2K",
    category: "Retro & Neon",
    description: "The original — cyan/magenta chrome, pixel-perfect nostalgia.",
    colors: { bg: "#0a0a12", panel: "#12121f", accent: "#00f0ff", accent2: "#ff2ee6" },
  },
  {
    value: "midnight",
    label: "Midnight Violet",
    shortLabel: "MID",
    category: "Retro & Neon",
    description: "Deep violet with a blue-toned glow.",
    colors: { bg: "#060608", panel: "#101014", accent: "#7c3aed", accent2: "#4f46e5" },
  },
  {
    value: "obsidian",
    label: "Obsidian",
    shortLabel: "OBS",
    category: "Retro & Neon",
    description: "Near-black with electric blue/violet. Max contrast, minimal palette.",
    colors: { bg: "#08090c", panel: "#101216", accent: "#4d7fff", accent2: "#a45bff" },
  },
  {
    value: "cyberlime",
    label: "Cyberlime",
    shortLabel: "CYB",
    category: "Retro & Neon",
    description: "Dark with electric lime and acid green — arcade-cabinet energy.",
    colors: { bg: "#0c1210", panel: "#141c19", accent: "#a3ff12", accent2: "#00ffa2" },
  },
  {
    value: "nightfall",
    label: "Nightfall",
    shortLabel: "NGT",
    category: "Retro & Neon",
    description: "Indigo-black with periwinkle and pink glow.",
    colors: { bg: "#090912", panel: "#12111d", accent: "#6c7cff", accent2: "#ff6ec7" },
  },

  // ---- Cool & Calm ----
  {
    value: "slate",
    label: "Slate",
    shortLabel: "SLT",
    category: "Cool & Calm",
    description: "Dark, low-contrast blue-gray. Easy on the eyes for long sessions.",
    colors: { bg: "#1a1d23", panel: "#22262e", accent: "#7ea6c9", accent2: "#5fb8a3" },
  },
  {
    value: "dusk",
    label: "Dusk",
    shortLabel: "DSK",
    category: "Cool & Calm",
    description: "Soft lavender-gray, gentler than Midnight Violet.",
    colors: { bg: "#16151d", panel: "#1e1d29", accent: "#9b8fd9", accent2: "#d99b9b" },
  },
  {
    value: "ocean",
    label: "Ocean",
    shortLabel: "OCN",
    category: "Cool & Calm",
    description: "Deep navy with a bright sky-blue current running through it.",
    colors: { bg: "#0a1929", panel: "#123049", accent: "#4fc3f7", accent2: "#29b6f6" },
  },
  {
    value: "glacier",
    label: "Glacier",
    shortLabel: "GLC",
    category: "Cool & Calm",
    description: "Light, icy blue — crisp and clean like fresh snow.",
    colors: { bg: "#f0f7fb", panel: "#ffffff", accent: "#2f9bda", accent2: "#7ec8e3" },
  },
  {
    value: "steel",
    label: "Steel",
    shortLabel: "STL",
    category: "Cool & Calm",
    description: "Neutral cool gray with a crisp sky-blue accent.",
    colors: { bg: "#14181d", panel: "#1c2128", accent: "#58a6ff", accent2: "#79c0ff" },
  },
  {
    value: "aurora",
    label: "Aurora",
    shortLabel: "AUR",
    category: "Cool & Calm",
    description: "Deep navy with teal/green glow, like the northern lights.",
    colors: { bg: "#0d1b2a", panel: "#142638", accent: "#2dd4bf", accent2: "#4ade80" },
  },

  // ---- Nature & Earth ----
  {
    value: "sage",
    label: "Sage",
    shortLabel: "SGE",
    category: "Nature & Earth",
    description: "Light, warm-neutral with a calm green accent.",
    colors: { bg: "#f0f3ee", panel: "#ffffff", accent: "#6b8f71", accent2: "#c98a5b" },
  },
  {
    value: "forest",
    label: "Forest",
    shortLabel: "FRS",
    category: "Nature & Earth",
    description: "Dark, deep green — like standing under a canopy at dusk.",
    colors: { bg: "#0f1b14", panel: "#16261c", accent: "#4caf7d", accent2: "#8bc34a" },
  },
  {
    value: "meadow",
    label: "Meadow",
    shortLabel: "MDW",
    category: "Nature & Earth",
    description: "Light, fresh sage-green with a warm orange accent.",
    colors: { bg: "#f4f8f0", panel: "#ffffff", accent: "#6fae44", accent2: "#f2a154" },
  },
  {
    value: "terracotta",
    label: "Terracotta",
    shortLabel: "TER",
    category: "Nature & Earth",
    description: "Warm clay tones on a light, sun-baked background.",
    colors: { bg: "#faf3ec", panel: "#ffffff", accent: "#c1652f", accent2: "#e0925a" },
  },
  {
    value: "rosewood",
    label: "Rosewood",
    shortLabel: "RSW",
    category: "Nature & Earth",
    description: "Warm dark maroon, rich and grounded.",
    colors: { bg: "#1a1112", panel: "#241819", accent: "#d97757", accent2: "#e8a87c" },
  },

  // ---- Warm & Cozy ----
  {
    value: "solaris",
    label: "Solaris",
    shortLabel: "SOL",
    category: "Warm & Cozy",
    description: "Warm amber/ember dark theme. High contrast without harshness.",
    colors: { bg: "#1c1712", panel: "#241d16", accent: "#f2a65a", accent2: "#e85d4c" },
  },
  {
    value: "citrus",
    label: "Citrus",
    shortLabel: "CIT",
    category: "Warm & Cozy",
    description: "Light, energetic lime + orange. Cheerful without being loud.",
    colors: { bg: "#fbfaf0", panel: "#ffffff", accent: "#7cb342", accent2: "#ff9f45" },
  },
  {
    value: "coral",
    label: "Coral",
    shortLabel: "COR",
    category: "Warm & Cozy",
    description: "Light peachy-coral, warm and inviting.",
    colors: { bg: "#fff5f0", panel: "#ffffff", accent: "#ff7a59", accent2: "#ffab73" },
  },

  // ---- Light & Minimal ----
  {
    value: "paper",
    label: "Paper Lab",
    shortLabel: "PPR",
    category: "Light & Minimal",
    description: "Light neutral with a violet accent — clean and quiet.",
    colors: { bg: "#f4f1ea", panel: "#ffffff", accent: "#12121f", accent2: "#7c3aed" },
  },
  {
    value: "blossom",
    label: "Blossom",
    shortLabel: "BLM",
    category: "Light & Minimal",
    description: "Soft, airy rose/mauve. Easy on the eyes in daylight.",
    colors: { bg: "#fdf2f5", panel: "#ffffff", accent: "#e0648a", accent2: "#9b6b9e" },
  },
  {
    value: "ivory",
    label: "Ivory",
    shortLabel: "IVY",
    category: "Light & Minimal",
    description: "Near-white, understated, almost paperless in its restraint.",
    colors: { bg: "#fbfaf7", panel: "#ffffff", accent: "#4a4a4a", accent2: "#b08d57" },
  },

  // ---- Rich & Elegant ----
  {
    value: "plum",
    label: "Plum",
    shortLabel: "PLM",
    category: "Rich & Elegant",
    description: "Dark plum and wine tones, elegant and moody.",
    colors: { bg: "#1c0f1a", panel: "#261625", accent: "#c2447a", accent2: "#e88fb0" },
  },
  {
    value: "amethyst",
    label: "Amethyst",
    shortLabel: "AMT",
    category: "Rich & Elegant",
    description: "Deep gemstone purple with a bright lilac glow.",
    colors: { bg: "#15101f", panel: "#1e1730", accent: "#9b5de5", accent2: "#c77dff" },
  },
];

export const THEME_CATEGORIES: ThemeCategory[] = [
  "Retro & Neon",
  "Cool & Calm",
  "Nature & Earth",
  "Warm & Cozy",
  "Light & Minimal",
  "Rich & Elegant",
];

export function getTheme(value: ThemeName): ThemeDef {
  return THEMES.find((t) => t.value === value) ?? THEMES[0];
}
