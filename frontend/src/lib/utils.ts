import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'MAD'): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: 'Appartement',
    HOUSE: 'Maison',
    VILLA: 'Villa',
    LAND: 'Terrain',
    OFFICE: 'Bureau',
    COMMERCIAL: 'Commercial',
  };
  return labels[type] || type;
}

export function getPropertyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    FOR_SALE: 'À Vendre',
    FOR_RENT: 'À Louer',
  };
  return labels[status] || status;
}

export function getPropertyTypeColor(type: string): string {
  const colors: Record<string, string> = {
    APARTMENT: 'bg-blue-500',
    HOUSE: 'bg-green-500',
    VILLA: 'bg-gold-500',
    LAND: 'bg-amber-600',
    OFFICE: 'bg-purple-500',
    COMMERCIAL: 'bg-orange-500',
  };
  return colors[type] || 'bg-gray-500';
}
