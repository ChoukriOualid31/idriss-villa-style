export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'LAND' | 'OFFICE' | 'COMMERCIAL';
export type PropertyStatus = 'FOR_SALE' | 'FOR_RENT';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  city: string;
  address: string;
  surface: number;
  rooms: number;
  bathrooms: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}

export interface PropertyFilters {
  city?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  rooms?: number;
  featured?: boolean;
  search?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PropertyListResponse {
  properties: Property[];
  pagination: Pagination;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalProperties: number;
    forSaleCount: number;
    forRentCount: number;
  };
  recentUsers: User[];
  recentProperties: Property[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SiteContent {
  id: string;
  // About page
  aboutHeroTitle: string;
  aboutHeroDescription: string;
  aboutAgencyDescription: string;
  aboutAdminNote: string;
  aboutMetric1Value: string;
  aboutMetric1Label: string;
  aboutMetric2Value: string;
  aboutMetric2Label: string;
  aboutMetric3Value: string;
  aboutMetric3Label: string;
  aboutMetric4Value: string;
  aboutMetric4Label: string;
  // Contact page
  contactHeaderTitle: string;
  contactHeaderDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  // Social
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  updatedAt: string;
}
