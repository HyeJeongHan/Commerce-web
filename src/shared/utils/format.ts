export function formatPrice(price: number, locale = 'ko-KR', currency = 'KRW'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price)
}

export function formatDate(dateStr: string, locale = 'ko-KR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
