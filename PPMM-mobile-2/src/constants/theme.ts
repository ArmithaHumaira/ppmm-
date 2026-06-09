import { Platform } from 'react-native';

export const COLORS = {
  primary: '#F86C8D',         // Bright pastel pink
  primaryLight: '#FCE4EA',    // Light pastel pink
  background: '#FFFDFB',      // Warm white / eggshell
  surface: '#FFFFFF',         // White
  text: '#1F2937',            // Charcoal
  textSecondary: '#6B7280',   // Cool gray
  success: '#22C55E',         // Soft green
  warning: '#F59E0B',         // Soft orange/yellow
  danger: '#EF4444',          // Soft red
  border: '#E5E7EB',          // Light border gray
  cardShadow: 'rgba(31, 41, 55, 0.05)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SHADOWS = Platform.select({
  ios: {
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  android: {
    elevation: 3,
  },
  web: {
    boxShadow: '0px 4px 12px rgba(31, 41, 55, 0.05)',
  },
  default: {},
});

export const CARD_STYLE = {
  backgroundColor: COLORS.surface,
  borderRadius: BORDER_RADIUS.lg,
  padding: SPACING.lg,
  borderWidth: 1,
  borderColor: COLORS.border,
  ...SHADOWS,
};
