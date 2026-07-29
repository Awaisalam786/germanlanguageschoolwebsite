'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, getActiveTheme } from '../utils/themeEngine';

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [currentLang, setLanguage] = useState('en');
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
