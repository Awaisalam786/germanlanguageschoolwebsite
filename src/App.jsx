import React, { useState, useEffect } from 'react';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TrialClassModal from './components/TrialClassModal';
import WhatsAppWidget from './components/WhatsAppWidget';

// Public Pages (12 Total)
import Home from './pages/Home';
import About from './pages/About';
import Founder from './pages/Founder';
import Courses from './pages/Courses';
import HowOnlineWorks from './pages/HowOnlineWorks';
import Teachers from './pages/Teachers';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Contact from './pages/Contact';
import Enroll from './pages/Enroll';
import FAQ from './pages/FAQ';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Documents from './admin/Documents';
import StudentManagement from './admin/StudentManagement';
import CourseManagement from './admin/CourseManagement';
import TeacherManagement from './admin/TeacherManagement';
import RecordingsManager from './admin/RecordingsManager';
import CertificateManager from './admin/CertificateManager';
import PaymentStatusTracker from './admin/PaymentStatusTracker';
import ThemeCustomizer from './admin/ThemeCustomizer';
import BlogCMS from './admin/BlogCMS';
import Inquiries from './admin/Inquiries';
import Analytics from './admin/Analytics';
import Notifications from './admin/Notifications';
import Settings from './admin/Settings';
import TestimonialManager from './admin/TestimonialManager';
import GalleryManager from './admin/GalleryManager';
import GoogleReviewsSettings from './admin/GoogleReviewsSettings';

// Theme Engine
import { applyTheme, getActiveTheme } from './utils/themeEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'home';
  });
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

  const handleAdminLogin = (sessionData) => {
    setAdminSession(sessionData);
    setIsAdminLoggedIn(true);
    setAdminTab('dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Render Public Page Routing (12 Pages)
  const renderPublicPage = () => {
    if (selectedBlogPost && activeTab === 'blog') {
      return (
        <BlogPostDetail
          post={selectedBlogPost}
          onBack={() => setSelectedBlogPost(null)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <Home
            currentLang={currentLang}
            setActiveTab={setActiveTab}
            onOpenTrialModal={() => setTrialModalOpen(true)}
          />
        );
      case 'about':
        return <About currentLang={currentLang} setActiveTab={setActiveTab} />;
      case 'founder':
        return <Founder setActiveTab={setActiveTab} />;
      case 'courses':
        return (
          <Courses
            currentLang={currentLang}
            setActiveTab={setActiveTab}
            onOpenTrialModal={() => setTrialModalOpen(true)}
          />
        );
      case 'howItWorks':
        return (
          <HowOnlineWorks
            setActiveTab={setActiveTab}
            onOpenTrialModal={() => setTrialModalOpen(true)}
          />
        );
      case 'teachers':
        return (
          <Teachers
            currentLang={currentLang}
            onOpenTrialModal={() => setTrialModalOpen(true)}
          />
        );
      case 'gallery':
        return <Gallery />;
      case 'testimonials':
        return <Testimonials currentLang={currentLang} setActiveTab={setActiveTab} />;
      case 'blog':
        return (
          <Blog
            onSelectPost={(post) => setSelectedBlogPost(post)}
          />
        );
      case 'contact':
        return <Contact currentLang={currentLang} />;
      case 'enroll':
        return <Enroll currentLang={currentLang} setActiveTab={setActiveTab} />;
      case 'faq':
        return <FAQ currentLang={currentLang} setActiveTab={setActiveTab} />;
      default:
        return (
          <Home
            currentLang={currentLang}
            setActiveTab={setActiveTab}
            onOpenTrialModal={() => setTrialModalOpen(true)}
          />
        );
    }
  };

  // Render Admin View Routing
  const renderAdminModule = () => {
    switch (adminTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setAdminTab} />;
      case 'documents':
        return <Documents />;
      case 'students':
        return <StudentManagement />;
      case 'coursesManager':
        return <CourseManagement />;
      case 'teachersManager':
        return <TeacherManagement />;
      case 'recordings':
        return <RecordingsManager />;
      case 'certificateManager':
        return <CertificateManager />;
      case 'paymentStatus':
        return <PaymentStatusTracker />;
      case 'themeCustomizer':
        return <ThemeCustomizer />;
      case 'blogCMS':
        return <BlogCMS />;
      case 'inquiries':
        return <Inquiries />;
      case 'testimonialsManager':
        return <TestimonialManager />;
      case 'galleryManager':
        return <GalleryManager />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'googleReviews':
        return <GoogleReviewsSettings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setCurrentTab={setAdminTab} />;
    }
  };

  // If in Admin Portal route
  if (activeTab === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={setAdminTab}
        userSession={adminSession}
        onLogout={handleAdminLogout}
        onReturnToSite={() => {
          window.history.pushState({}, '', '/');
          setActiveTab('home');
        }}
        currentLang={currentLang}
      >
        {renderAdminModule()}
      </AdminLayout>
    );
  }

  // Public Facing Website View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedBlogPost(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTrialModal={() => setTrialModalOpen(true)}
      />

      {/* Main Content Page Container */}
      <main className="flex-1">
        {renderPublicPage()}
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} setActiveTab={setActiveTab} />

      {/* Floating Action Widgets */}
      <TrialClassModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        currentLang={currentLang}
      />
      <WhatsAppWidget />

    </div>
  );
}
