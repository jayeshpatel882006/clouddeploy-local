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

    // Accent colors — expanded tokens
    root.style.setProperty("--accent", accent.DEFAULT);
    root.style.setProperty("--accent-rgb", accent.rgb);
    root.style.setProperty("--accent-hover", accent.hover);
    root.style.setProperty("--accent-active", accent.active);
    root.style.setProperty("--accent-focus", accent.focus);
    root.style.setProperty("--accent-light", accent.light);
    root.style.setProperty("--accent-dark", accent.dark);
    root.style.setProperty("--accent-bg", accent.bg);
    root.style.setProperty("--accent-ring", accent.focus);

    // Theme token aliases — components consume these
    root.style.setProperty("--btn-primary-bg", accent.DEFAULT);
    root.style.setProperty("--btn-primary-hover", accent.hover);
    root.style.setProperty("--btn-primary-active", accent.active);
    root.style.setProperty("--btn-primary-ring", accent.focus);
    root.style.setProperty("--toggle-active", accent.DEFAULT);
    root.style.setProperty("--focus-ring", accent.focus);
    root.style.setProperty("--selection-bg", accent.focus);

    // Theme
    const theme = s.colorScheme === "system" ? getSystemTheme() : s.colorScheme;
    root.setAttribute("data-theme", theme);

    if (theme === "light") {
      root.style.setProperty("--bg-primary", "#f8fafc");
      root.style.setProperty("--bg-secondary", "#f1f5f9");
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--bg-sidebar", "#ffffff");
      root.style.setProperty("--bg-header", "#ffffff");
      root.style.setProperty("--bg-input", "#ffffff");
      root.style.setProperty("--bg-table-header", "#f8fafc");
      root.style.setProperty("--bg-table-hover", "#f1f5f9");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border-color", "#e2e8f0");
    } else {
      root.style.setProperty("--bg-primary", "#0f172a");
      root.style.setProperty("--bg-secondary", "#1e293b");
      root.style.setProperty("--bg-card", "#020617");
      root.style.setProperty("--bg-sidebar", "#020617");
      root.style.setProperty("--bg-header", "#020617");
      root.style.setProperty("--bg-input", "#1e293b");
      root.style.setProperty("--bg-table-header", "rgba(30, 41, 59, 0.5)");
      root.style.setProperty("--bg-table-hover", "rgba(15, 23, 42, 0.6)");
      root.style.setProperty("--text-primary", "#f8fafc");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--border-color", "#1e293b");
    }

    // Font size
    const fontSizes = {
      small: { base: "13px", heading: "1.1em", small: "11px" },
      medium: { base: "14px", heading: "1.25em", small: "12px" },
      large: { base: "16px", heading: "1.4em", small: "13px" },
    };
    const fs = fontSizes[s.fontSize] || fontSizes.medium;
    root.style.setProperty("--font-base", fs.base);
    root.style.setProperty("--font-heading", fs.heading);
    root.style.setProperty("--font-small", fs.small);

    // Code font
    const codeFonts = {
      monospace: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      jetbrains: "'JetBrains Mono', monospace",
      fira: "'Fira Code', monospace",
      source: "'Source Code Pro', monospace",
      system: "system-ui, -apple-system, sans-serif",
      "sans-serif": "system-ui, -apple-system, sans-serif",
    };
    root.style.setProperty("--font-code", codeFonts[s.codeFont] || codeFonts.monospace);

    // Compact mode
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

    // Reduced motion
    const existingMeta = document.querySelector("meta[name=\"reduced-motion\"]");
    if (s.reducedMotion) {
      if (!existingMeta) {
        const meta = document.createElement("meta");
        meta.name = "reduced-motion";
        meta.content = "true";
        document.head.appendChild(meta);
      }
      root.style.setProperty("--reduce-motion", "reduce");
      // Add a style tag to override animations
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

    // Sidebar position
    root.setAttribute("data-sidebar", s.sidebarPosition);
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
