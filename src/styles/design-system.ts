export const COLORS = {
  primary: "#005085",
  primaryLight: "#b3d9ff",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40",
  white: "#ffffff",
  muted: "#6c757d",
  border: "#dee2e6",
  borderLight: "#e9ecef",
  background: "#f5f5f5",
  text: "#1a1a1a",
  textMuted: "#6c757d",
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  xxxl: "48px",
} as const;

export const BORDER_RADIUS = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "50%",
} as const;

export const SHADOWS = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
  md: "0 2px 8px rgba(0, 0, 0, 0.1)",
  lg: "0 4px 16px rgba(0, 0, 0, 0.15)",
} as const;

export const TYPOGRAPHY = {
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
} as const;

export const BREAKPOINTS = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1400px",
} as const;

export const COMMON_STYLES = {
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    border: `1px solid ${COLORS.borderLight}`,
    boxShadow: SHADOWS.md,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    padding: `${SPACING.sm} ${SPACING.lg}`,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  input: {
    borderRadius: BORDER_RADIUS.md,
    border: `1px solid ${COLORS.border}`,
    padding: `${SPACING.sm} ${SPACING.md}`,
  },
} as const;
