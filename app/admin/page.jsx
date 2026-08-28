'use client';
import React from 'react';
import AdminLogin from '../../src/admin/AdminLogin';
import AdminLayout from '../../src/admin/AdminLayout';
import Dashboard from '../../src/admin/Dashboard';
import Documents from '../../src/admin/Documents';
import StudentManagement from '../../src/admin/StudentManagement';
import CourseManagement from '../../src/admin/CourseManagement';
import TeacherManagement from '../../src/admin/TeacherManagement';
import RecordingsManager from '../../src/admin/RecordingsManager';
import CertificateManager from '../../src/admin/CertificateManager';
import PaymentStatusTracker from '../../src/admin/PaymentStatusTracker';
import ThemeCustomizer from '../../src/admin/ThemeCustomizer';
import BlogCMS from '../../src/admin/BlogCMS';
import Inquiries from '../../src/admin/Inquiries';
import Analytics from '../../src/admin/Analytics';
import Notifications from '../../src/admin/Notifications';
import Settings from '../../src/admin/Settings';
import TestimonialManager from '../../src/admin/TestimonialManager';
import GalleryManager from '../../src/admin/GalleryManager';
import GoogleReviewsSettings from '../../src/admin/GoogleReviewsSettings';
import BooksManager from '../../src/admin/BooksManager';
import BookOrdersTracker from '../../src/admin/BookOrdersTracker';
import CouponManager from '../../src/admin/CouponManager';
import AnnouncementsManager from '../../src/admin/AnnouncementsManager';
import GlobalContentManager from '../../src/admin/GlobalContentManager';
import PracticeTestManager from '../../src/admin/PracticeTestManager';
import ChapterVocabManager from '../../src/admin/ChapterVocabManager';
import SmartVocabResultsManager from '../../src/admin/SmartVocabResultsManager';
import GrammarChaptersManager from '../../src/admin/GrammarChaptersManager';
import GrammarResultsManager from '../../src/admin/GrammarResultsManager';
import ReadingPassagesManager from '../../src/admin/ReadingPassagesManager';
import ReadingResultsManager from '../../src/admin/ReadingResultsManager';
import NounBuilderAdmin from '../../src/admin/noun-builder/NounBuilderAdmin';
import { useGlobalState } from '../../src/context/GlobalStateContext';
import { useRouter } from 'next/navigation';


export default function AdminPage() {
  const {
    currentLang,
    isAdminLoggedIn, setIsAdminLoggedIn,
    adminTab, setAdminTab,
    adminSession, setAdminSession
  } = useGlobalState();
  
  const router = useRouter();

  const handleAdminLogin = (sessionData) => {
    setAdminSession(sessionData);
    setIsAdminLoggedIn(true);
    setAdminTab('dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const renderAdminModule = () => {
    switch (adminTab) {
      case 'dashboard': return <Dashboard setCurrentTab={setAdminTab} />;
      case 'documents': return <Documents />;
      case 'students': return <StudentManagement />;
      case 'coursesManager': return <CourseManagement />;
      case 'teachersManager': return <TeacherManagement />;
      case 'recordings': return <RecordingsManager />;
      case 'certificateManager': return <CertificateManager />;
      case 'paymentStatus': return <PaymentStatusTracker />;
      case 'themeCustomizer': return <ThemeCustomizer />;
      case 'practiceTests': return <PracticeTestManager />;
      case 'chapterVocab': return <ChapterVocabManager />;
      case 'smartVocabResults': return <SmartVocabResultsManager />;
      case 'grammarChapters': return <GrammarChaptersManager />;
      case 'grammarResults': return <GrammarResultsManager />;
      case 'readingPassages': return <ReadingPassagesManager />;
      case 'readingResults': return <ReadingResultsManager />;
      case 'blogCMS': return <BlogCMS />;
      case 'inquiries': return <Inquiries />;
      case 'testimonialsManager': return <TestimonialManager />;
      case 'galleryManager': return <GalleryManager />;
      case 'booksManager': return <BooksManager />;
      case 'bookOrders': return <BookOrdersTracker />;
      case 'couponManager': return <CouponManager />;
      case 'analytics': return <Analytics />;
      case 'notifications': return <Notifications />;
      case 'googleReviews': return <GoogleReviewsSettings />;
      case 'globalContent': return <GlobalContentManager />;
      case 'settings': return <Settings />;
      case 'announcements': return <AnnouncementsManager />;
      case 'nounBuilder': return <NounBuilderAdmin />;
      default: return <Dashboard setCurrentTab={setAdminTab} />;
    }
  };

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <AdminLayout
      currentTab={adminTab}
      setCurrentTab={setAdminTab}
      userSession={adminSession}
      onLogout={handleAdminLogout}
      onReturnToSite={() => router.push('/')}
      currentLang={currentLang}
    >
      {renderAdminModule()}
    </AdminLayout>
  );
}
