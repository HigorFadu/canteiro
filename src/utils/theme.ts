import { CompanyBranding } from '../types';

/**
 * Padrão Original e Imutável da Marca "CANTEIRO" (utilizado exclusivamente antes do login)
 */
export const canteiroBrandTheme = {
  themePreset: 'escuro' as const,
  bgPrimary: '#0a0f1d',
  bgSecondary: '#0f172a',
  menuBg: '#0a0f1d',
  buttonPrimary: '#2563eb', // Azul institucional Canteiro
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#1e293b',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textTitles: '#ffffff',
  accentColor: '#f59e0b', // Âmbar Canteiro
  borderColor: '#1e293b',
  iconColor: '#3b82f6',
  linkColor: '#38bdf8',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
};

/**
 * Calculates luminance of a hex color (0 to 1)
 */
export function getLuminance(hex: string): number {
  if (!hex) return 0.5;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return 0.5;
  
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  } else {
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  }

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Determines whether a color is dark
 */
export function isDarkColor(hex: string): boolean {
  return getLuminance(hex) <= 0.45;
}

/**
 * Determines whether the active background/theme is dark
 */
export function isDarkTheme(bgHex: string): boolean {
  return isDarkColor(bgHex);
}

/**
 * Calculates contrast ratio between two hex colors (1:1 to 21:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * REGRA ESTRITA DE TIPOGRAFIA (Padrão sugerido para temas base):
 * No tema Claro, sugere fontes Pretas (#000000).
 * No tema Escuro, sugere fontes Brancas (#ffffff).
 * O cliente tem total liberdade para editar e personalizar qualquer cor de fonte.
 */
export function getReadableTextColor(bgHex: string): '#ffffff' | '#000000' {
  return isDarkColor(bgHex) ? '#ffffff' : '#000000';
}

/**
 * Sugere tipografia legível para um tema inicial sem travar a liberdade do cliente
 */
export function suggestInitialTypography(branding: CompanyBranding): CompanyBranding {
  const isDark = isDarkColor(branding.bgPrimary);
  const suggestedTextColor = isDark ? '#ffffff' : '#000000';
  const suggestedSecondaryText = isDark ? '#94a3b8' : '#475569';
  const suggestedBtnText = isDarkColor(branding.buttonPrimary) ? '#ffffff' : '#000000';

  return {
    ...branding,
    textPrimary: branding.textPrimary || suggestedTextColor,
    textTitles: branding.textTitles || suggestedTextColor,
    textSecondary: branding.textSecondary || suggestedSecondaryText,
    buttonPrimaryText: branding.buttonPrimaryText || suggestedBtnText,
  };
}

export function enforceStrictTypography(branding: CompanyBranding): CompanyBranding {
  return suggestInitialTypography(branding);
}

/**
 * Checks contrast and provides recommendations
 */
export function evaluateContrast(textColor: string, bgColor: string): {
  ratio: number;
  isReadable: boolean;
  score: 'Excelente' | 'Bom' | 'Baixo contraste';
  suggestedText: string;
} {
  const ratio = Math.round(getContrastRatio(textColor, bgColor) * 10) / 10;
  const isReadable = ratio >= 4.5;
  const suggestedText = getReadableTextColor(bgColor);

  let score: 'Excelente' | 'Bom' | 'Baixo contraste' = 'Baixo contraste';
  if (ratio >= 7) score = 'Excelente';
  else if (ratio >= 4.5) score = 'Bom';

  return { ratio, isReadable, score, suggestedText };
}

/**
 * Retorna as variáveis CSS dinâmicas para injeção direta no estilo do container raiz (App.tsx / Layout)
 */
export function getRootThemeCssStyles(branding: CompanyBranding): React.CSSProperties {
  const bgPrimary = branding.bgPrimary || '#090d16';
  const isDark = isDarkColor(bgPrimary);
  const textPrimary = branding.textPrimary || (isDark ? '#ffffff' : '#000000');
  const textTitles = branding.textTitles || textPrimary;
  const textSecondary = branding.textSecondary || (isDark ? '#94a3b8' : '#475569');
  const btnPrimary = branding.buttonPrimary || '#2563eb';
  const btnPrimaryText = branding.buttonPrimaryText || (isDarkColor(btnPrimary) ? '#ffffff' : '#000000');
  const btnSecondary = branding.buttonSecondary || (isDark ? '#1e293b' : '#f1f5f9');
  const btnSecondaryText = isDarkColor(btnSecondary) ? '#ffffff' : '#0f172a';
  const bgSecondary = branding.bgSecondary || (isDark ? '#0f172a' : '#ffffff');
  const menuBg = branding.menuBg || bgPrimary;
  const accent = branding.accentColor || '#3b82f6';
  const border = branding.borderColor || (isDark ? '#1e293b' : '#e2e8f0');
  const icon = branding.iconColor || accent;
  const link = branding.linkColor || accent;
  const success = branding.successColor || '#10b981';
  const warning = branding.warningColor || '#f59e0b';
  const error = branding.errorColor || '#ef4444';

  return {
    '--bg-primary': bgPrimary,
    '--bg-secondary': bgSecondary,
    '--menu-bg': menuBg,
    '--btn-primary': btnPrimary,
    '--btn-primary-text': btnPrimaryText,
    '--btn-secondary': btnSecondary,
    '--btn-secondary-text': btnSecondaryText,
    '--text-primary': textPrimary,
    '--text-secondary': textSecondary,
    '--title-color': textTitles,
    '--accent-color': accent,
    '--border-color': border,
    '--icon-color': icon,
    '--link-color': link,
    '--success-color': success,
    '--warning-color': warning,
    '--error-color': error,

    // Aliases com --color-*
    '--color-bg-primary': bgPrimary,
    '--color-bg-secondary': bgSecondary,
    '--color-menu-bg': menuBg,
    '--color-btn-primary': btnPrimary,
    '--color-btn-primary-text': btnPrimaryText,
    '--color-btn-secondary': btnSecondary,
    '--color-text-primary': textPrimary,
    '--color-text-secondary': textSecondary,
    '--color-text-titles': textTitles,
    '--color-accent': accent,
    '--color-border': border,
    '--color-icon': icon,
    '--color-link': link,
    '--color-success': success,
    '--color-warning': warning,
    '--color-error': error,

    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  } as React.CSSProperties;
}

/**
 * Injeta todas as variáveis CSS no document.documentElement (:root) e configura data-theme
 */
export function applyThemeVariables(branding: CompanyBranding): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  const bgPrimary = branding.bgPrimary || '#090d16';
  const isDark = isDarkColor(bgPrimary);
  const textPrimary = branding.textPrimary || (isDark ? '#ffffff' : '#000000');
  const textTitles = branding.textTitles || textPrimary;
  const textSecondary = branding.textSecondary || (isDark ? '#94a3b8' : '#475569');
  const btnPrimary = branding.buttonPrimary || '#2563eb';
  const btnPrimaryText = branding.buttonPrimaryText || (isDarkColor(btnPrimary) ? '#ffffff' : '#000000');
  const btnSecondary = branding.buttonSecondary || (isDark ? '#1e293b' : '#f1f5f9');
  const btnSecondaryText = isDarkColor(btnSecondary) ? '#ffffff' : '#0f172a';
  const bgSecondary = branding.bgSecondary || (isDark ? '#0f172a' : '#ffffff');
  const menuBg = branding.menuBg || bgPrimary;
  const accent = branding.accentColor || '#3b82f6';
  const border = branding.borderColor || (isDark ? '#1e293b' : '#e2e8f0');
  const icon = branding.iconColor || accent;
  const link = branding.linkColor || accent;
  const success = branding.successColor || '#10b981';
  const warning = branding.warningColor || '#f59e0b';
  const error = branding.errorColor || '#ef4444';

  root.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // Variáveis padrão solicitadas: --bg-primary, --bg-secondary, --menu-bg, --btn-primary, --btn-secondary, --text-primary, --text-secondary, --title-color, --accent-color, --border-color
  root.style.setProperty('--bg-primary', bgPrimary);
  root.style.setProperty('--bg-secondary', bgSecondary);
  root.style.setProperty('--menu-bg', menuBg);
  root.style.setProperty('--btn-primary', btnPrimary);
  root.style.setProperty('--btn-primary-text', btnPrimaryText);
  root.style.setProperty('--btn-secondary', btnSecondary);
  root.style.setProperty('--btn-secondary-text', btnSecondaryText);
  root.style.setProperty('--text-primary', textPrimary);
  root.style.setProperty('--text-secondary', textSecondary);
  root.style.setProperty('--title-color', textTitles);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--border-color', border);
  root.style.setProperty('--icon-color', icon);
  root.style.setProperty('--link-color', link);
  root.style.setProperty('--success-color', success);
  root.style.setProperty('--warning-color', warning);
  root.style.setProperty('--error-color', error);

  // Variáveis com prefixo --color-*
  root.style.setProperty('--color-bg-primary', bgPrimary);
  root.style.setProperty('--color-bg-secondary', bgSecondary);
  root.style.setProperty('--color-menu-bg', menuBg);
  root.style.setProperty('--color-btn-primary', btnPrimary);
  root.style.setProperty('--color-btn-primary-text', btnPrimaryText);
  root.style.setProperty('--color-btn-secondary', btnSecondary);
  root.style.setProperty('--color-text-primary', textPrimary);
  root.style.setProperty('--color-text-secondary', textSecondary);
  root.style.setProperty('--color-text-titles', textTitles);
  root.style.setProperty('--color-accent', accent);
  root.style.setProperty('--color-border', border);
  root.style.setProperty('--color-icon', icon);
  root.style.setProperty('--color-link', link);
  root.style.setProperty('--color-success', success);
  root.style.setProperty('--color-warning', warning);
  root.style.setProperty('--color-error', error);
}

/**
 * Predefinições Oficiais com cumprimento estrito das regras de contraste
 */
export const themePresets: Record<string, Partial<CompanyBranding>> = {
  escuro: {
    themePreset: 'escuro',
    bgPrimary: '#090d16',
    bgSecondary: '#0f172a',
    menuBg: '#090d16',
    buttonPrimary: '#2563eb',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#1e293b',
    textPrimary: '#ffffff',
    textSecondary: '#f1f5f9',
    textTitles: '#ffffff',
    accentColor: '#3b82f6',
    borderColor: '#1e293b',
    iconColor: '#60a5fa',
    linkColor: '#38bdf8',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  },
  claro: {
    themePreset: 'claro',
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    menuBg: '#ffffff',
    buttonPrimary: '#0f172a',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#f1f5f9',
    textPrimary: '#000000',      // OBRIGATORIAMENTE PRETO NO TEMA CLARO
    textSecondary: '#171717',    // OBRIGATORIAMENTE PRETO/ESCURO
    textTitles: '#000000',       // OBRIGATORIAMENTE PRETO
    accentColor: '#2563eb',
    borderColor: '#e2e8f0',
    iconColor: '#0f172a',
    linkColor: '#0284c7',
    successColor: '#16a34a',
    warningColor: '#d97706',
    errorColor: '#dc2626',
  },
  azul: {
    themePreset: 'personalizado',
    bgPrimary: '#090d16',
    bgSecondary: '#0e1726',
    menuBg: '#080d1a',
    buttonPrimary: '#0284c7',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#162238',
    textPrimary: '#ffffff',
    textSecondary: '#f1f5f9',
    textTitles: '#ffffff',
    accentColor: '#38bdf8',
    borderColor: '#162238',
    iconColor: '#38bdf8',
    linkColor: '#38bdf8',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  },
  verde: {
    themePreset: 'personalizado',
    bgPrimary: '#06130d',
    bgSecondary: '#092117',
    menuBg: '#040d09',
    buttonPrimary: '#059669',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#0f3323',
    textPrimary: '#ffffff',
    textSecondary: '#f1f5f9',
    textTitles: '#ffffff',
    accentColor: '#10b981',
    borderColor: '#0f3323',
    iconColor: '#34d399',
    linkColor: '#6ee7b7',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  },
  grafite: {
    themePreset: 'personalizado',
    bgPrimary: '#121214',
    bgSecondary: '#18181b',
    menuBg: '#09090b',
    buttonPrimary: '#eab308',
    buttonPrimaryText: '#000000',
    buttonSecondary: '#27272a',
    textPrimary: '#ffffff',
    textSecondary: '#f1f5f9',
    textTitles: '#ffffff',
    accentColor: '#eab308',
    borderColor: '#27272a',
    iconColor: '#facc15',
    linkColor: '#fde047',
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
  },
};
