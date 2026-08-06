'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AnnouncementTicker from './AnnouncementTicker';
import Navbar from './Navbar';
import Footer from './Footer';
import TrialClassModal from './TrialClassModal';
import WhatsAppWidget from './WhatsAppWidget';
import { useGlobalState } from '../context/GlobalStateContext';

export default function AppLayoutWrapper({ children }) {
  const { currentLang, setLanguage, trialModalOpen, setTrialModalOpen } = useGlobalState();
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on pathname
  let activeTab = 'home';
  if (pathname === '/about') activeTab = 'about';
  else if (pathname === '/courses') activeTab = 'courses';
  else if (pathname === '/contact') activeTab = 'contact';
  else if (pathname === '/faq') activeTab = 'faq';
  else if (pathname === '/blog') activeTab = 'blog';
  else if (pathname === '/books') activeTab = 'books';
  else if (pathname === '/translator') activeTab = 'translator';
  else if (pathname === '/howItWorks') activeTab = 'howItWorks';
  else if (pathname === '/teachers') activeTab = 'teachers';
  else if (pathname === '/gallery') activeTab = 'gallery';
  else if (pathname === '/testimonials') activeTab = 'testimonials';
  else if (pathname === '/enroll') activeTab = 'enroll';
  else if (pathname.startsWith('/admin')) activeTab = 'admin';

  const handleSetActiveTab = (tab) => {
    // Navigate via Next.js router
    if (tab === 'home') router.push('/');
    else router.push(`/${tab}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden box-border">
      {!pathname.startsWith('/admin') && <AnnouncementTicker />}
      
      {!pathname.startsWith('/admin') && (
        <Navbar
          currentLang={currentLang}
          setLanguage={setLanguage}
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          onOpenTrialModal={() => setTrialModalOpen(true)}
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      {!pathname.startsWith('/admin') && (
        <Footer currentLang={currentLang} setActiveTab={handleSetActiveTab} />
      )}

      {!pathname.startsWith('/admin') && (
        <TrialClassModal
          isOpen={trialModalOpen}
          onClose={() => setTrialModalOpen(false)}
          currentLang={currentLang}
        />
      )}
      {!pathname.startsWith('/admin') && <WhatsAppWidget />}
    </div>
  );
}
