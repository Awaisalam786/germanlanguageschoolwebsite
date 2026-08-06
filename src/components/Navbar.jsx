import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Menu, 
  X, 
  BookOpen, 
  PhoneCall, 
  GraduationCap, 
  Users,
  UserCheck,
  Image as GalleryIcon,
  HelpCircle,
  FileText,
  MessageSquare,
  MessageCircle,
  Laptop,
  Play,
  ShieldCheck,
  ChevronDown,

  Languages
} from 'lucide-react';
import Link from 'next/link';
import { translations } from '../i18n/translations';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Navbar({ 
  currentLang, 
  setLanguage, 
  activeTab, 
  setActiveTab,
  onOpenTrialModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'about' | 'resources' | null
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false);
  const [mobileResourcesExpanded, setMobileResourcesExpanded] = useState(false);
  
  const dropdownRef = useRef(null);
  const t = translations[currentLang];
  const { settings } = useGlobalContent();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown 1: About Group
  const aboutMenuItems = [
    { id: 'about', label: t.nav.about, icon: Users, desc: 'Our mission & 100% online model' },
    { id: 'founder', label: t.nav.founder, icon: UserCheck, desc: 'Prof. Dr. Michael Weber spotlight' },
    { id: 'teachers', label: t.nav.teachers, icon: ShieldCheck, desc: 'Native German & Pakistani faculty' },
  ];

  // Dropdown 2: Resources Group
  const resourcesMenuItems = [
    { id: 'books', label: 'Books & Resources', icon: BookOpen, desc: 'Official study materials & exam prep books' },
    { id: 'translator', label: 'Free Translator', icon: Languages, desc: 'Translate German text instantly' },
    { id: 'howItWorks', label: t.nav.howItWorks, icon: Laptop, desc: 'Live Zoom & HD lecture archive' },
    { id: 'gallery', label: t.nav.gallery, icon: GalleryIcon, desc: 'Live class screenshots & events' },
    { id: 'testimonials', label: t.nav.testimonials, icon: MessageSquare, desc: 'Graduation stories & reviews' },
    { id: 'faq', label: t.nav.faq, icon: HelpCircle, desc: 'Common questions answered' },
    { id: 'blog', label: t.nav.blog, icon: FileText, desc: 'German visa & exam preparation tips' },
  ];

  const isAboutActive = ['about', 'founder', 'teachers'].includes(activeTab);
  const isResourcesActive = ['howItWorks', 'gallery', 'testimonials', 'faq', 'blog', 'books', 'translator'].includes(activeTab);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300">
      
      {/* German Flag Strip (Black, Red, Gold) */}
      <div className="h-1 w-full german-flag-strip"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo: Clean White & Red Title with Minimal Gold Border Badge */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-red-800 to-slate-900 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300 border border-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🇵🇰🇩🇪</span>
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans flex items-center gap-1.5 leading-none">
                German <span className="text-red-500 font-extrabold">Language School</span>
              </span>
              <span className="block text-[9px] tracking-widest text-slate-400 uppercase font-bold mt-1">
                100% Online Institute • Pakistan
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Red Accent Palette) */}
          <nav className="hidden lg:flex items-center space-x-1.5" ref={dropdownRef}>
            
            {/* 1. Direct Link: Home */}
            <Link
              href="/"
              className={`relative group px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'text-white bg-red-600/20 border border-red-500/40 shadow-sm font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <BookOpen className={`w-[18px] h-[18px] ${activeTab === 'home' ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
              <span>{t.nav.home}</span>
              <span className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-red-500 transition-all duration-300 ${
                activeTab === 'home' ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-80'
              }`} />
            </Link>

            {/* 2. Direct Link: Courses & Fees */}
            <Link
              href="/courses"
              className={`relative group px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'text-white bg-red-600/20 border border-red-500/40 shadow-sm font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <GraduationCap className={`w-[18px] h-[18px] ${activeTab === 'courses' ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
              <span>{t.nav.courses}</span>
              <span className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-red-500 transition-all duration-300 ${
                activeTab === 'courses' ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-80'
              }`} />
            </Link>

            {/* 3. Dropdown Group: About */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                className={`group px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  isAboutActive || activeDropdown === 'about'
                    ? 'text-white bg-red-600/20 border border-red-500/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Users className={`w-[18px] h-[18px] ${isAboutActive ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
                <span>About</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'about' ? 'rotate-180 text-red-500' : 'text-slate-400'}`} />
              </button>

              {/* About Dropdown Panel */}
              {activeDropdown === 'about' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[540px] bg-slate-900/98 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 grid grid-cols-2 gap-2.5"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {aboutMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isFirst = index === 0;

                    return (
                      <Link
                        key={item.id}
                        href={item.id === 'home' ? '/' : '/' + item.id}
                        className={`group text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                          isFirst ? 'col-span-2' : 'col-span-1'
                        } ${
                          isActive 
                            ? 'bg-red-600/10 border-red-500/30 hover:bg-red-600 hover:border-red-500' 
                            : 'border-slate-800 bg-slate-900/40 hover:bg-red-600 hover:border-red-500'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors duration-200 ${
                          isActive 
                            ? 'bg-red-500/20 text-red-500 group-hover:bg-red-700/50 group-hover:text-white' 
                            : 'bg-slate-800 text-slate-300 group-hover:bg-red-700/50 group-hover:text-white'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 mt-0.5">
                          <div className="text-sm font-bold leading-tight text-slate-200 group-hover:text-white transition-colors duration-200">{item.label}</div>
                          <div className="text-[11px] text-slate-400 font-normal mt-1 leading-snug group-hover:text-red-100 transition-colors duration-200">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Dropdown Group: Resources */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                className={`group px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                  isResourcesActive || activeDropdown === 'resources'
                    ? 'text-white bg-red-600/20 border border-red-500/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Laptop className={`w-[18px] h-[18px] ${isResourcesActive ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'resources' ? 'rotate-180 text-red-500' : 'text-slate-400'}`} />
              </button>

              {/* Resources Dropdown Panel */}
              {activeDropdown === 'resources' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[540px] bg-slate-900/98 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl animate-fade-in z-50 grid grid-cols-2 gap-2.5"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {resourcesMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isPopular = item.id === 'blog';

                    return (
                      <Link
                        key={item.id}
                        href={item.id === 'home' ? '/' : '/' + item.id}
                        className={`group text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                          isPopular 
                            ? 'col-span-2 border-2 border-amber-500/40 bg-amber-500/5 hover:bg-red-600 hover:border-red-500 shadow-sm' 
                            : isActive 
                              ? 'col-span-1 bg-red-600/10 border-red-500/30 hover:bg-red-600 hover:border-red-500' 
                              : 'col-span-1 border-slate-800 bg-slate-900/40 hover:bg-red-600 hover:border-red-500'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors duration-200 ${
                          isPopular 
                            ? 'bg-amber-500/20 text-amber-500 group-hover:bg-red-700/50 group-hover:text-white' 
                            : isActive 
                              ? 'bg-red-500/20 text-red-500 group-hover:bg-red-700/50 group-hover:text-white' 
                              : 'bg-slate-800 text-slate-300 group-hover:bg-red-700/50 group-hover:text-white'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 mt-0.5">
                          <div className={`text-sm font-bold leading-tight transition-colors duration-200 ${isPopular ? 'text-amber-400 group-hover:text-white' : 'text-slate-200 group-hover:text-white'}`}>{item.label}</div>
                          <div className="text-[11px] text-slate-400 font-normal mt-1 leading-snug transition-colors duration-200 group-hover:text-red-100">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Direct Link: Contact Us */}
            <Link
              href="/contact"
              className={`relative group px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'text-white bg-red-600/20 border border-red-500/40 shadow-sm font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <PhoneCall className={`w-[18px] h-[18px] ${activeTab === 'contact' ? 'text-red-500' : 'text-slate-400 group-hover:text-red-400'}`} />
              <span>{t.nav.contact}</span>
              <span className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-red-500 transition-all duration-300 ${
                activeTab === 'contact' ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-80'
              }`} />
            </Link>

          </nav>

          {/* Desktop Right Action Area: Red Accent Demo Button & Green WhatsApp Button */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Language Switcher Badge (Clean Red Active Badge) */}
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs shadow-inner">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg font-bold transition-all duration-200 ${
                  currentLang === 'en' 
                    ? 'bg-red-600 text-white shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('de')}
                className={`px-2 py-1 rounded-lg font-bold transition-all duration-200 ${
                  currentLang === 'de' 
                    ? 'bg-red-600 text-white shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-2 py-1 rounded-lg font-bold transition-all duration-200 font-urdu ${
                  currentLang === 'ur' 
                    ? 'bg-red-600 text-white shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button - Rendered via CSS on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-red-500/50 transition shadow-lg ml-2 shrink-0 flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-8 h-8 text-red-500" /> : <Menu className="w-8 h-8" />}
            </button>

          </div>

        </div>
      </div>
      </header>

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sliding Mobile Sidebar */}
      <div 
        className={`lg:hidden fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-tight">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Mobile Direct Link: Home */}
          <Link
            href="/" onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-bold flex items-center gap-4 transition-all ${
              activeTab === 'home' 
                ? 'bg-red-600/20 text-white border border-red-500/40' 
                : 'text-slate-300 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <BookOpen className="w-6 h-6 text-red-500 shrink-0" />
            <span>{t.nav.home}</span>
          </Link>

          {/* Mobile Direct Link: Courses & Fees */}
          <Link
            href="/courses" onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-bold flex items-center gap-4 transition-all ${
              activeTab === 'courses' 
                ? 'bg-red-600/20 text-white border border-red-500/40' 
                : 'text-slate-300 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <GraduationCap className="w-6 h-6 text-red-500 shrink-0" />
            <span>{t.nav.courses}</span>
          </Link>

          {/* Mobile Accordion 1: About */}
          <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/40">
            <button
              onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
              className="w-full text-left px-5 py-4 text-lg font-bold text-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-red-500 shrink-0" />
                <span>About</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-red-500 transition-transform shrink-0 ${mobileAboutExpanded ? 'rotate-180' : ''}`} />
            </button>

            {mobileAboutExpanded && (
              <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-2">
                {aboutMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <Link
                      key={item.id}
                      href={'/' + item.id} onClick={() => setMobileMenuOpen(false)}
                      className={`group text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                        isActive
                          ? 'border-red-500/40 bg-red-900/20'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-200">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Accordion 2: Resources */}
          <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/40">
            <button
              onClick={() => setMobileResourcesExpanded(!mobileResourcesExpanded)}
              className="w-full text-left px-5 py-4 text-lg font-bold text-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Laptop className="w-6 h-6 text-red-500 shrink-0" />
                <span>Resources</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-red-500 transition-transform shrink-0 ${mobileResourcesExpanded ? 'rotate-180' : ''}`} />
            </button>

            {mobileResourcesExpanded && (
              <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-2">
                {resourcesMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <Link
                      key={item.id}
                      href={'/' + item.id} onClick={() => setMobileMenuOpen(false)}
                      className={`group text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                        isActive
                          ? 'border-red-500/40 bg-red-900/20'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-200">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Direct Link: Contact Us */}
          <Link
            href="/contact" onClick={() => setMobileMenuOpen(false)}
            className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-bold flex items-center gap-4 transition-all ${
              activeTab === 'contact' 
                ? 'bg-red-600/20 text-white border border-red-500/40' 
                : 'text-slate-300 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <PhoneCall className="w-6 h-6 text-red-500 shrink-0" />
            <span>{t.nav.contact}</span>
          </Link>

        </div>
      </div>
    </>
  );
}
