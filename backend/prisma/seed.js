const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@idrissvilla.com' },
    update: {
      name: 'Administrateur',
      password: adminPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Administrateur',
      email: process.env.ADMIN_EMAIL || 'admin@idrissvilla.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample properties
  const sampleProperties = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Villa Luxueuse Marina Vista',
      description: 'Magnifique villa de luxe avec vue panoramique sur la mer, située dans la prestigieuse station balnéaire de Cabo Negro. Cette résidence exclusive offre un cadre de vie exceptionnel avec des finitions haut de gamme.',
      price: 2500000.00,
      type: 'VILLA',
      status: 'FOR_SALE',
      city: 'Cabo Negro',
      address: 'Route de Cabo Negro, Tanger',
      surface: 450,
      rooms: 5,
      bathrooms: 4,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
      featured: true,
      userId: admin.id,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Appartement Haut Standing Malabata',
      description: 'Appartement moderne et élégant dans la résidence MNAR Cap Malabata. Profitez d\'une vue imprenable sur la baie de Tanger et des équipements de luxe.',
      price: 850000.00,
      type: 'APARTMENT',
      status: 'FOR_SALE',
      city: 'Tanger',
      address: 'Cap Malabata, Tanger',
      surface: 120,
      rooms: 3,
      bathrooms: 2,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      featured: true,
      userId: admin.id,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'Bureau Professionnel Casablanca',
      description: 'Espace de bureau moderne et professionnel au cœur de Casablanca. Idéal pour les entreprises recherchant un emplacement stratégique.',
      price: 15000.00,
      type: 'OFFICE',
      status: 'FOR_RENT',
      city: 'Casablanca',
      address: 'Boulevard Mohammed V, Casablanca',
      surface: 200,
      rooms: 4,
      bathrooms: 2,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
      featured: false,
      userId: admin.id,
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Villa Contemporaine Eden Paradise',
      description: 'Villa contemporaine d\'exception avec jardin paysager et piscine privée. Un havre de paix pour les familles exigeantes.',
      price: 1800000.00,
      type: 'VILLA',
      status: 'FOR_SALE',
      city: 'Tanger',
      address: 'Route d\'Achakar, Tanger',
      surface: 380,
      rooms: 4,
      bathrooms: 3,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
      featured: true,
      userId: admin.id,
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      title: 'Terrain Constructible',
      description: 'Terrain constructible de 1000m² avec vue sur mer. Parcelle idéale pour construire votre villa de rêve.',
      price: 500000.00,
      type: 'LAND',
      status: 'FOR_SALE',
      city: 'Tétouan',
      address: 'Route de Martil, Tétouan',
      surface: 1000,
      rooms: 0,
      bathrooms: 0,
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      featured: false,
      userId: admin.id,
    },
  ];

  for (const property of sampleProperties) {
    await prisma.property.upsert({
      where: { id: property.id || undefined },
      update: {},
      create: property,
    });
  }

  console.log('✅ Sample properties created');
  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
