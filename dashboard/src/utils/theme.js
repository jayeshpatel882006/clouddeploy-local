// ==========================================
// Global Theme Tokens & Accent Color System
// Centralized design tokens for the entire app
// ==========================================

// ─── Accent Color Palette (18 colors) ──────
export const ACCENT_PALETTE = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "violet", label: "Violet", class: "bg-violet-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "amber", label: "Amber", class: "bg-amber-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "lime", label: "Lime", class: "bg-lime-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "sky", label: "Sky", class: "bg-sky-500" },
  { value: "slate", label: "Slate", class: "bg-slate-500" },
  { value: "neutral", label: "Neutral", class: "bg-neutral-500" },
];

// ─── Accent Color Values (hex) ─────────────
// Each accent includes expanded tokens for comprehensive application theming
export const ACCENT_COLORS = {
  blue: {
    DEFAULT: "#3b82f6", rgb: "59, 130, 246",
    hover: "#2563eb", active: "#1d4ed8",
    focus: "rgba(59, 130, 246, 0.4)", light: "#93c5fd", dark: "#1e3a5f",
    bg: "rgba(59, 130, 246, 0.1)", bgSubtle: "rgba(59, 130, 246, 0.04)",
    border: "rgba(59, 130, 246, 0.2)", borderHover: "rgba(59, 130, 246, 0.35)",
    textMuted: "rgba(59, 130, 246, 0.7)", sidebarActive: "rgba(59, 130, 246, 0.15)",
  },
  indigo: {
    DEFAULT: "#6366f1", rgb: "99, 102, 241",
    hover: "#4f46e5", active: "#4338ca",
    focus: "rgba(99, 102, 241, 0.4)", light: "#a5b4fc", dark: "#312e81",
    bg: "rgba(99, 102, 241, 0.1)", bgSubtle: "rgba(99, 102, 241, 0.04)",
    border: "rgba(99, 102, 241, 0.2)", borderHover: "rgba(99, 102, 241, 0.35)",
    textMuted: "rgba(99, 102, 241, 0.7)", sidebarActive: "rgba(99, 102, 241, 0.15)",
  },
  purple: {
    DEFAULT: "#a855f7", rgb: "168, 85, 247",
    hover: "#9333ea", active: "#7e22ce",
    focus: "rgba(168, 85, 247, 0.4)", light: "#d8b4fe", dark: "#4c1d95",
    bg: "rgba(168, 85, 247, 0.1)", bgSubtle: "rgba(168, 85, 247, 0.04)",
    border: "rgba(168, 85, 247, 0.2)", borderHover: "rgba(168, 85, 247, 0.35)",
    textMuted: "rgba(168, 85, 247, 0.7)", sidebarActive: "rgba(168, 85, 247, 0.15)",
  },
  violet: {
    DEFAULT: "#8b5cf6", rgb: "139, 92, 246",
    hover: "#7c3aed", active: "#6d28d9",
    focus: "rgba(139, 92, 246, 0.4)", light: "#c4b5fd", dark: "#4c1d95",
    bg: "rgba(139, 92, 246, 0.1)", bgSubtle: "rgba(139, 92, 246, 0.04)",
    border: "rgba(139, 92, 246, 0.2)", borderHover: "rgba(139, 92, 246, 0.35)",
    textMuted: "rgba(139, 92, 246, 0.7)", sidebarActive: "rgba(139, 92, 246, 0.15)",
  },
  pink: {
    DEFAULT: "#ec4899", rgb: "236, 72, 153",
    hover: "#db2777", active: "#be185d",
    focus: "rgba(236, 72, 153, 0.4)", light: "#f9a8d4", dark: "#831843",
    bg: "rgba(236, 72, 153, 0.1)", bgSubtle: "rgba(236, 72, 153, 0.04)",
    border: "rgba(236, 72, 153, 0.2)", borderHover: "rgba(236, 72, 153, 0.35)",
    textMuted: "rgba(236, 72, 153, 0.7)", sidebarActive: "rgba(236, 72, 153, 0.15)",
  },
  rose: {
    DEFAULT: "#f43f5e", rgb: "244, 63, 94",
    hover: "#e11d48", active: "#be123c",
    focus: "rgba(244, 63, 94, 0.4)", light: "#fda4af", dark: "#881337",
    bg: "rgba(244, 63, 94, 0.1)", bgSubtle: "rgba(244, 63, 94, 0.04)",
    border: "rgba(244, 63, 94, 0.2)", borderHover: "rgba(244, 63, 94, 0.35)",
    textMuted: "rgba(244, 63, 94, 0.7)", sidebarActive: "rgba(244, 63, 94, 0.15)",
  },
  red: {
    DEFAULT: "#ef4444", rgb: "239, 68, 68",
    hover: "#dc2626", active: "#b91c1c",
    focus: "rgba(239, 68, 68, 0.4)", light: "#fca5a5", dark: "#7f1d1d",
    bg: "rgba(239, 68, 68, 0.1)", bgSubtle: "rgba(239, 68, 68, 0.04)",
    border: "rgba(239, 68, 68, 0.2)", borderHover: "rgba(239, 68, 68, 0.35)",
    textMuted: "rgba(239, 68, 68, 0.7)", sidebarActive: "rgba(239, 68, 68, 0.15)",
  },
  orange: {
    DEFAULT: "#f97316", rgb: "249, 115, 22",
    hover: "#ea580c", active: "#c2410c",
    focus: "rgba(249, 115, 22, 0.4)", light: "#fdba74", dark: "#7c2d12",
    bg: "rgba(249, 115, 22, 0.1)", bgSubtle: "rgba(249, 115, 22, 0.04)",
    border: "rgba(249, 115, 22, 0.2)", borderHover: "rgba(249, 115, 22, 0.35)",
    textMuted: "rgba(249, 115, 22, 0.7)", sidebarActive: "rgba(249, 115, 22, 0.15)",
  },
  amber: {
    DEFAULT: "#f59e0b", rgb: "245, 158, 11",
    hover: "#d97706", active: "#b45309",
    focus: "rgba(245, 158, 11, 0.4)", light: "#fcd34d", dark: "#78350f",
    bg: "rgba(245, 158, 11, 0.1)", bgSubtle: "rgba(245, 158, 11, 0.04)",
    border: "rgba(245, 158, 11, 0.2)", borderHover: "rgba(245, 158, 11, 0.35)",
    textMuted: "rgba(245, 158, 11, 0.7)", sidebarActive: "rgba(245, 158, 11, 0.15)",
  },
  yellow: {
    DEFAULT: "#eab308", rgb: "234, 179, 8",
    hover: "#ca8a04", active: "#a16207",
    focus: "rgba(234, 179, 8, 0.4)", light: "#fde047", dark: "#713f12",
    bg: "rgba(234, 179, 8, 0.1)", bgSubtle: "rgba(234, 179, 8, 0.04)",
    border: "rgba(234, 179, 8, 0.2)", borderHover: "rgba(234, 179, 8, 0.35)",
    textMuted: "rgba(234, 179, 8, 0.7)", sidebarActive: "rgba(234, 179, 8, 0.15)",
  },
  lime: {
    DEFAULT: "#84cc16", rgb: "132, 204, 22",
    hover: "#65a30d", active: "#4d7c0f",
    focus: "rgba(132, 204, 22, 0.4)", light: "#bef264", dark: "#365314",
    bg: "rgba(132, 204, 22, 0.1)", bgSubtle: "rgba(132, 204, 22, 0.04)",
    border: "rgba(132, 204, 22, 0.2)", borderHover: "rgba(132, 204, 22, 0.35)",
    textMuted: "rgba(132, 204, 22, 0.7)", sidebarActive: "rgba(132, 204, 22, 0.15)",
  },
  green: {
    DEFAULT: "#22c55e", rgb: "34, 197, 94",
    hover: "#16a34a", active: "#15803d",
    focus: "rgba(34, 197, 94, 0.4)", light: "#86efac", dark: "#166534",
    bg: "rgba(34, 197, 94, 0.1)", bgSubtle: "rgba(34, 197, 94, 0.04)",
    border: "rgba(34, 197, 94, 0.2)", borderHover: "rgba(34, 197, 94, 0.35)",
    textMuted: "rgba(34, 197, 94, 0.7)", sidebarActive: "rgba(34, 197, 94, 0.15)",
  },
  emerald: {
    DEFAULT: "#10b981", rgb: "16, 185, 129",
    hover: "#059669", active: "#047857",
    focus: "rgba(16, 185, 129, 0.4)", light: "#6ee7b7", dark: "#064e3b",
    bg: "rgba(16, 185, 129, 0.1)", bgSubtle: "rgba(16, 185, 129, 0.04)",
    border: "rgba(16, 185, 129, 0.2)", borderHover: "rgba(16, 185, 129, 0.35)",
    textMuted: "rgba(16, 185, 129, 0.7)", sidebarActive: "rgba(16, 185, 129, 0.15)",
  },
  teal: {
    DEFAULT: "#14b8a6", rgb: "20, 184, 166",
    hover: "#0d9488", active: "#0f766e",
    focus: "rgba(20, 184, 166, 0.4)", light: "#5eead4", dark: "#134e4a",
    bg: "rgba(20, 184, 166, 0.1)", bgSubtle: "rgba(20, 184, 166, 0.04)",
    border: "rgba(20, 184, 166, 0.2)", borderHover: "rgba(20, 184, 166, 0.35)",
    textMuted: "rgba(20, 184, 166, 0.7)", sidebarActive: "rgba(20, 184, 166, 0.15)",
  },
  cyan: {
    DEFAULT: "#06b6d4", rgb: "6, 182, 212",
    hover: "#0891b2", active: "#0e7490",
    focus: "rgba(6, 182, 212, 0.4)", light: "#67e8f9", dark: "#164e63",
    bg: "rgba(6, 182, 212, 0.1)", bgSubtle: "rgba(6, 182, 212, 0.04)",
    border: "rgba(6, 182, 212, 0.2)", borderHover: "rgba(6, 182, 212, 0.35)",
    textMuted: "rgba(6, 182, 212, 0.7)", sidebarActive: "rgba(6, 182, 212, 0.15)",
  },
  sky: {
    DEFAULT: "#0ea5e9", rgb: "14, 165, 233",
    hover: "#0284c7", active: "#0369a1",
    focus: "rgba(14, 165, 233, 0.4)", light: "#7dd3fc", dark: "#0c4a6e",
    bg: "rgba(14, 165, 233, 0.1)", bgSubtle: "rgba(14, 165, 233, 0.04)",
    border: "rgba(14, 165, 233, 0.2)", borderHover: "rgba(14, 165, 233, 0.35)",
    textMuted: "rgba(14, 165, 233, 0.7)", sidebarActive: "rgba(14, 165, 233, 0.15)",
  },
  slate: {
    DEFAULT: "#64748b", rgb: "100, 116, 139",
    hover: "#475569", active: "#334155",
    focus: "rgba(100, 116, 139, 0.4)", light: "#cbd5e1", dark: "#1e293b",
    bg: "rgba(100, 116, 139, 0.1)", bgSubtle: "rgba(100, 116, 139, 0.04)",
    border: "rgba(100, 116, 139, 0.2)", borderHover: "rgba(100, 116, 139, 0.35)",
    textMuted: "rgba(100, 116, 139, 0.7)", sidebarActive: "rgba(100, 116, 139, 0.15)",
  },
  neutral: {
    DEFAULT: "#737373", rgb: "115, 115, 115",
    hover: "#525252", active: "#404040",
    focus: "rgba(115, 115, 115, 0.4)", light: "#a3a3a3", dark: "#262626",
    bg: "rgba(115, 115, 115, 0.1)", bgSubtle: "rgba(115, 115, 115, 0.04)",
    border: "rgba(115, 115, 115, 0.2)", borderHover: "rgba(115, 115, 115, 0.35)",
    textMuted: "rgba(115, 115, 115, 0.7)", sidebarActive: "rgba(115, 115, 115, 0.15)",
  },
};

export const DEFAULT_ACCENT = "blue";

// ─── CSS Class Tokens ──────────────────────
// These are applied by SettingsContext via CSS variables
// Components should use these CSS variable references:
//
// Background:   var(--accent), var(--accent-hover), var(--accent-bg)
// Text:         var(--accent) or var(--accent-light)
// Border:       var(--accent-border), var(--accent-border-hover)
// Focus ring:   var(--accent-focus)
// Light variant: var(--accent-light)
// Sidebar:      var(--sidebar-active-bg)

export default ACCENT_COLORS;
