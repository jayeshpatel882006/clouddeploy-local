import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { loadSettings, saveSettings, resetSettings, DEFAULT_SETTINGS, getSystemTheme } from "@/services/settings.service";
import { ACCENT_COLORS } from "@/utils/theme";

// ==========================================
// Settings Context
// ==========================================

const SettingsContext = createContext(null);

// Theme token CSS variables are set via applyCSS() below

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => loadSettings());
  const styleRef = useRef(null);

  // ── Resolved theme ─────────────────────
  const resolvedTheme = settings.colorScheme === "system"
    ? getSystemTheme()
    : settings.colorScheme;

  // ── Apply CSS variables ────────────────
  const applyCSS = useCallback((s) => {
    const root = document.documentElement;
    const accent = ACCENT_COLORS[s.accentColor] || ACCENT_COLORS.blue;

    // ── Core accent tokens ──
    root.style.setProperty("--accent", accent.DEFAULT);
    root.style.setProperty("--accent-rgb", accent.rgb);
    root.style.setProperty("--accent-hover", accent.hover);
    root.style.setProperty("--accent-active", accent.active);
    root.style.setProperty("--accent-focus", accent.focus);
    root.style.setProperty("--accent-light", accent.light);
    root.style.setProperty("--accent-dark", accent.dark);
    root.style.setProperty("--accent-bg", accent.bg);
    root.style.setProperty("--accent-bg-subtle", accent.bgSubtle);
    root.style.setProperty("--accent-bg-hover", `rgba(${accent.rgb}, 0.08)`);

    // ── Border tokens ──
    root.style.setProperty("--accent-border", accent.border);
    root.style.setProperty("--accent-border-hover", accent.borderHover);

    // ── Text tokens ──
    root.style.setProperty("--accent-text", accent.DEFAULT);
    root.style.setProperty("--accent-text-muted", accent.textMuted);

    // ── Component-specific aliases ──
    root.style.setProperty("--btn-primary-bg", accent.DEFAULT);
    root.style.setProperty("--btn-primary-hover", accent.hover);
    root.style.setProperty("--btn-primary-active", accent.active);
    root.style.setProperty("--btn-primary-ring", accent.focus);
    root.style.setProperty("--toggle-active", accent.DEFAULT);
    root.style.setProperty("--focus-ring", accent.focus);
    root.style.setProperty("--selection-bg", `rgba(${accent.rgb}, 0.3)`);

    // ── Sidebar tokens ──
    root.style.setProperty("--sidebar-active-bg", accent.sidebarActive);
    root.style.setProperty("--sidebar-hover-bg", `rgba(${accent.rgb}, 0.08)`);
    root.style.setProperty("--sidebar-active-text", accent.light);
    root.style.setProperty("--sidebar-border", `rgba(${accent.rgb}, 0.15)`);

    // ── Card tokens ──
    root.style.setProperty("--card-accent-border", `rgba(${accent.rgb}, 0.12)`);
    root.style.setProperty("--card-accent-shadow", `rgba(${accent.rgb}, 0.06)`);

    // ── Chart tokens ──
    root.style.setProperty("--chart-1", accent.DEFAULT);
    root.style.setProperty("--chart-1-soft", `rgba(${accent.rgb}, 0.15)`);
    root.style.setProperty("--chart-2", "#4ade80");
    root.style.setProperty("--chart-3", "#c084fc");
    root.style.setProperty("--chart-4", "#facc15");
    root.style.setProperty("--chart-5", "#22d3ee");
    root.style.setProperty("--chart-6", "#fb923c");
    root.style.setProperty("--chart-7", "#f87171");

    // ── Table tokens ──
    root.style.setProperty("--table-header-accent", `rgba(${accent.rgb}, 0.05)`);
    root.style.setProperty("--table-row-selected", `rgba(${accent.rgb}, 0.05)`);
    root.style.setProperty("--table-row-hover", `rgba(${accent.rgb}, 0.03)`);

    // ── Badge tokens ──
    root.style.setProperty("--badge-accent-bg", `rgba(${accent.rgb}, 0.1)`);
    root.style.setProperty("--badge-accent-text", accent.light);
    root.style.setProperty("--badge-accent-border", `rgba(${accent.rgb}, 0.2)`);

    // ── Form tokens ──
    root.style.setProperty("--form-focus-border", accent.DEFAULT);
    root.style.setProperty("--form-focus-ring", `rgba(${accent.rgb}, 0.2)`);
    root.style.setProperty("--form-checked-bg", accent.DEFAULT);
    root.style.setProperty("--form-checked-border", accent.DEFAULT);

    // ── Surface accent tokens ──
    root.style.setProperty("--surface-accent-subtle", `rgba(${accent.rgb}, 0.03)`);
    root.style.setProperty("--surface-accent-hover", `rgba(${accent.rgb}, 0.06)`);

    // ── Theme ──
    const theme = s.colorScheme === "system" ? getSystemTheme() : s.colorScheme;
    root.setAttribute("data-theme", theme);

    // ── Blend accent into surface colors ──
    const blend = (baseRgb, weight) => {
      const [r1, g1, b1] = baseRgb.split(", ").map(Number);
      const [r2, g2, b2] = accent.rgb.split(", ").map(Number);
      const w = weight;
      return `rgb(${Math.round(r1 * (1 - w) + r2 * w)}, ${Math.round(g1 * (1 - w) + g2 * w)}, ${Math.round(b1 * (1 - w) + b2 * w)})`;
    };

    // ── Light / Dark surface colors with accent tinting ──
    if (theme === "light") {
      root.style.setProperty("--bg-primary", blend("248, 250, 252", 0.03));
      root.style.setProperty("--bg-secondary", blend("241, 245, 249", 0.04));
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-sidebar", "#ffffff");
      root.style.setProperty("--bg-header", "#ffffff");
      root.style.setProperty("--bg-input", "#ffffff");
      root.style.setProperty("--bg-table-header", blend("248, 250, 252", 0.03));
      root.style.setProperty("--bg-table-hover", blend("241, 245, 249", 0.04));
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border-color", blend("226, 232, 240", 0.08));
    } else {
      root.style.setProperty("--bg-primary", blend("15, 23, 42", 0.04));
      root.style.setProperty("--bg-secondary", blend("30, 41, 59", 0.05));
      root.style.setProperty("--bg-card", blend("2, 6, 23", 0.03));
      root.style.setProperty("--bg-sidebar", blend("2, 6, 23", 0.06));
      root.style.setProperty("--bg-header", blend("2, 6, 23", 0.05));
      root.style.setProperty("--bg-input", blend("30, 41, 59", 0.04));
      root.style.setProperty("--bg-table-header", blend("30, 41, 59", 0.06));
      root.style.setProperty("--bg-table-hover", blend("15, 23, 42", 0.05));
      root.style.setProperty("--text-primary", "#f8fafc");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--border-color", blend("30, 41, 59", 0.08));
    }

    // ── Browser theme color ──
    updateBrowserThemeColor(accent.DEFAULT, theme);

    // ── Favicon accent ──
    updateFavicon(accent.DEFAULT);

    // ── Font size ──
    const fontSizes = {
      small: { base: "13px", heading: "1.1em", small: "11px" },
      medium: { base: "14px", heading: "1.25em", small: "12px" },
      large: { base: "16px", heading: "1.4em", small: "13px" },
    };
    const fs = fontSizes[s.fontSize] || fontSizes.medium;
    root.style.setProperty("--font-base", fs.base);
    root.style.setProperty("--font-heading", fs.heading);
    root.style.setProperty("--font-small", fs.small);

    // ── Code font ──
    const codeFonts = {
      monospace: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      jetbrains: "'JetBrains Mono', monospace",
      fira: "'Fira Code', monospace",
      source: "'Source Code Pro', monospace",
      system: "system-ui, -apple-system, sans-serif",
      "sans-serif": "system-ui, -apple-system, sans-serif",
    };
    root.style.setProperty("--font-code", codeFonts[s.codeFont] || codeFonts.monospace);

    // ── Compact mode ──
    if (s.compactMode) {
      root.setAttribute("data-compact", "true");
      root.style.setProperty("--space-sm", "0.375rem");
      root.style.setProperty("--space-md", "0.625rem");
      root.style.setProperty("--space-lg", "1rem");
      root.style.setProperty("--space-xl", "1.5rem");
      root.style.setProperty("--table-cell-py", "0.5rem");
      root.style.setProperty("--card-padding", "1rem");
    } else {
      root.removeAttribute("data-compact");
      root.style.setProperty("--space-sm", "0.5rem");
      root.style.setProperty("--space-md", "0.75rem");
      root.style.setProperty("--space-lg", "1.25rem");
      root.style.setProperty("--space-xl", "1.75rem");
      root.style.setProperty("--table-cell-py", "0.75rem");
      root.style.setProperty("--card-padding", "1.25rem");
    }

    // ── Reduced motion ──
    const existingMeta = document.querySelector("meta[name=\"reduced-motion\"]");
    if (s.reducedMotion) {
      if (!existingMeta) {
        const meta = document.createElement("meta");
        meta.name = "reduced-motion";
        meta.content = "true";
        document.head.appendChild(meta);
      }
      root.style.setProperty("--reduce-motion", "reduce");
      if (!styleRef.current) {
        const style = document.createElement("style");
        style.id = "reduced-motion-styles";
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
        styleRef.current = style;
      }
    } else {
      if (existingMeta) existingMeta.remove();
      root.style.removeProperty("--reduce-motion");
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    }

    // ── Sidebar position ──
    root.setAttribute("data-sidebar", s.sidebarPosition);
  }, []);

  // ── Update browser theme color meta tag ──
  const updateBrowserThemeColor = useCallback((accentColor, theme) => {
    let meta = document.querySelector("meta[name=\"theme-color\"]");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    // Use a darker version in dark mode, lighter in light mode
    const color = theme === "light" ? accentColor : "#0f172a";
    meta.content = color;

    // Also update apple-mobile-web-app-status-bar-style for iOS
    let appleMeta = document.querySelector("meta[name=\"apple-mobile-web-app-status-bar-style\"]");
    if (!appleMeta) {
      appleMeta = document.createElement("meta");
      appleMeta.name = "apple-mobile-web-app-status-bar-style";
      document.head.appendChild(appleMeta);
    }
    appleMeta.content = theme === "light" ? "default" : "black-translucent";
  }, []);

  // ── Update favicon to reflect accent color ──
  const updateFavicon = useCallback((accentColor) => {
    const link = document.querySelector("link[rel=\"icon\"]");
    if (!link) return;

    // Generate an inline SVG favicon with the accent color
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" fill="${accentColor}"/>
      <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui" font-weight="bold" font-size="18">CD</text>
    </svg>`;

    const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    link.href = encoded;
  }, []);

  // ── Apply on mount and when settings change ──
  useEffect(() => {
    applyCSS(settings);
  }, [settings, applyCSS]);

  // ── Listen for system theme changes ─────
  useEffect(() => {
    if (settings.colorScheme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => applyCSS(settings);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.colorScheme, settings, applyCSS]);

  // ── Update helpers ──────────────────────
  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const updateSection = useCallback((section, values) => {
    setSettings((prev) => {
      const next = { ...prev, [section]: { ...prev[section], ...values } };
      saveSettings(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const defaults = resetSettings();
    setSettings(defaults);
  }, []);

  const hasChanges = useCallback((proposed) => {
    return JSON.stringify(proposed) !== JSON.stringify(settings);
  }, [settings]);

  // ── Detect OS theme for CSS media query ──
  const themeClass = resolvedTheme === "light" ? "light" : "dark";

  return (
    <SettingsContext.Provider
      value={{
        settings,
        resolvedTheme,
        updateSettings,
        updateSection,
        reset,
        hasChanges,
        ACCENT_COLORS,
        accentColor: ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.blue,
      }}
    >
      <div className={`theme-${themeClass}`}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return ctx;
};

export default SettingsContext;
