// ============================================
// LAYOUT: MAIN LAYOUT
// ============================================

import React from 'react';
import Head from 'next/head';
import { Header, Footer } from '@/components/organisms';

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  noHeader?: boolean;
  noFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Le Sage Dev - Développement Web & Mobile',
  description = 'Votre partenaire de confiance pour tous vos projets de développement web et mobile',
  noHeader = false,
  noFooter = false,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        {!noHeader && <Header />}
        
        <main className="flex-1">{children}</main>
        
        {!noFooter && <Footer />}
      </div>
    </>
  );
};

MainLayout.displayName = 'MainLayout';

export default MainLayout;
