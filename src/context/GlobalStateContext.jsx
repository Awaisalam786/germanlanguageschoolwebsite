'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { applyTheme, getActiveTheme } from '../utils/themeEngine';

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  // Routes under /ur are the server-rendered Urdu pages, so they start in Urdu
  // (same value on the server and in the browser, so no hydration mismatch).
  const pathname = usePathname() || '';
  const isUrduRoute = pathname === '/ur' || pathname.startsWith('/ur/');
  const [currentLang, setLanguage] = useState(isUrduRoute ? 'ur' : 'en');
  const wasUrduRoute = useRef(isUrduRoute);
  useEffect(() => {
    if (isUrduRoute) setLanguage('ur');
    else if (wasUrduRoute.current) setLanguage((l) => (l === 'ur' ? 'en' : l));
    wasUrduRoute.current = isUrduRoute;
  }, [isUrduRoute]);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminSession, setAdminSession] = useState({
    email: 'germanlanguageschool1@gmail.com',
    role: 'Super Admin',
    twoFactorEnabled: true
  });

  // Apply Theme & RTL Text Direction effect on app load
  useEffect(() => {
    applyTheme(getActiveTheme());
    document.documentElement.dir = currentLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <GlobalStateContext.Provider
      value={{
        currentLang, setLanguage,
        trialModalOpen, setTrialModalOpen,
        selectedBlogPost, setSelectedBlogPost,
        isAdminLoggedIn, setIsAdminLoggedIn,
        adminTab, setAdminTab,
        adminSession, setAdminSession
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
