import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Idriss Villa Style | Immobilier de Luxe',
  description: 'Votre partenaire de confiance pour trouver la propriété de vos rêves au Maroc. Villas, appartements, terrains et plus.',
  keywords: 'immobilier, maroc, tanger, villa, appartement, terrain, luxe, achat, location',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans bg-dark-950 text-white min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
