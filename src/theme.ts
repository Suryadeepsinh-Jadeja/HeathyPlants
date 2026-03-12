export const colors = {
  primary: '#2D7D32',      // forest green — agriculture
  secondary: '#F9A825',    // golden yellow — wheat/harvest
  danger: '#C62828',       // disease alert red
  warning: '#EF6C00',      // orange
  background: '#F1F8E9',   // light green tint
  cardBackground: '#FFFFFF',
  textPrimary: '#1B1B1B',
  textSecondary: '#5D5D5D',
};

export const typography = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  hero: 36,
};

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 20,
  pill: 50,
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
};

export const theme = {
  colors,
  typography,
  borderRadius,
  shadows,
};
