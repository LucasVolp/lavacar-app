const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) {
    return '';
  }

  const text = String(str);
  return text.replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char);
}

export function sanitizeText(str: unknown): string {
  if (str === null || str === undefined) {
    return '';
  }

  return String(str)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function formatCurrency(value: unknown, locale = 'pt-BR'): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(num)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export function formatNumber(value: unknown, decimals = 0): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(num)) {
    return '0';
  }

  return num.toFixed(decimals);
}

export function sanitizePlate(plate: unknown): string {
  if (!plate) return '';
  const cleaned = String(plate).toUpperCase().replace(/[^A-Z0-9-]/g, '');
  return cleaned.slice(0, 8);
}

export function sanitizePhone(phone: unknown): string {
  if (!phone) return '';
  return String(phone).replace(/[^\d\s()-+]/g, '').slice(0, 20);
}
