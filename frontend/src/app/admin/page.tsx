'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building, Users, TrendingUp, DollarSign, 
  Plus, ArrowRight, Home, User 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { DashboardStats } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await userApi.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  const statCards = [
    {
      icon: Building,
      label: 'Total Biens',
      value: stats?.overview.totalProperties || 0,
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      label: 'Utilisateurs',
      value: stats?.overview.totalUsers || 0,
      color: 'bg-green-500',
    },
    {
      icon: TrendingUp,
      label: 'À Vendre',
      value: stats?.overview.forSaleCount || 0,
      color: 'bg-purple-500',
    },
    {
      icon: DollarSign,
      label: 'À Louer',
      value: stats?.overview.forRentCount || 0,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="bg-dark-900 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">
                Dashboard Admin
              </h1>
              <p className="text-gray-400 mt-1">
                Bienvenue, {user?.name}
              </p>
            </div>
            <Link
              href="/admin/properties/new"
              className="flex items-center space-x-2 px-6 py-3 bg-gold-500 text-dark-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter un bien</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-dark-800 rounded-xl p-6 border border-dark-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin/properties"
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-gold-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gold-500/10 rounded-lg flex items-center justify-center">
                  <Home className="w-7 h-7 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">
                    Gérer les biens
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ajouter, modifier ou supprimer des propriétés
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" />
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-gold-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gold-500/10 rounded-lg flex items-center justify-center">
                  <User className="w-7 h-7 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">
                    Gérer les utilisateurs
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Voir et gérer les comptes utilisateurs
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gold-500 transition-colors" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-dark-800 rounded-xl border border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">
                Derniers biens ajoutés
              </h3>
            </div>
            <div className="p-6">
              {stats?.recentProperties && stats.recentProperties.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 bg-dark-900 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium line-clamp-1">
                          {property.title}
                        </p>
                        <p className="text-gray-400 text-sm">{property.city}</p>
                      </div>
                      <p className="text-gold-500 font-semibold">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Aucun bien ajouté récemment
                </p>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-dark-800 rounded-xl border border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-white">
                Derniers utilisateurs inscrits
              </h3>
            </div>
            <div className="p-6">
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-dark-900 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                          <span className="text-gold-500 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${user.role === 'ADMIN' ? 'bg-gold-500 text-dark-950' : 'bg-dark-700 text-gray-300'}
                      `}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Aucun utilisateur inscrit récemment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
