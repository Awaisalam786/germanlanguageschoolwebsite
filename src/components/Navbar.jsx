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
  ChevronDown
} from 'lucide-react';
import { translations } from '../i18n/translations';

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
    { id: 'howItWorks', label: t.nav.howItWorks, icon: Laptop, desc: 'Live Zoom & HD lecture archive' },
    { id: 'gallery', label: t.nav.gallery, icon: GalleryIcon, desc: 'Live class screenshots & events' },
    { id: 'testimonials', label: t.nav.testimonials, icon: MessageSquare, desc: 'Graduation stories & reviews' },
    { id: 'faq', label: t.nav.faq, icon: HelpCircle, desc: 'Common questions answered' },
    { id: 'blog', label: t.nav.blog, icon: FileText, desc: 'German visa & exam preparation tips' },
  ];

  const isAboutActive = ['about', 'founder', 'teachers'].includes(activeTab);
  const isResourcesActive = ['howItWorks', 'gallery', 'testimonials', 'faq', 'blog'].includes(activeTab);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl transition-all duration-300">
      
      {/* German Flag Strip (Black, Red, Gold) */}
      <div className="h-1 w-full german-flag-strip"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo: Clean White & Red Title with Minimal Gold Border Badge */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => {
              setActiveTab('home');
              setActiveDropdown(null);
            }}
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
            <button
              onClick={() => {
                setActiveTab('home');
                setActiveDropdown(null);
              }}
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
            </button>

            {/* 2. Direct Link: Courses & Fees */}
            <button
              onClick={() => {
                setActiveTab('courses');
                setActiveDropdown(null);
              }}
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
            </button>

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
                  className="absolute top-full left-0 mt-2 w-64 bg-slate-900/98 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl space-y-1 animate-fade-in z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {aboutMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                          isActive 
                            ? 'bg-red-600/20 text-white font-bold border border-red-500/30' 
                            : 'hover:bg-slate-800 text-slate-200 hover:text-red-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                        </div>
                      </button>
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
                  className="absolute top-full left-0 mt-2 w-72 bg-slate-900/98 border border-slate-800 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl space-y-1 animate-fade-in z-50"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {resourcesMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-start gap-3 ${
                          isActive 
                            ? 'bg-red-600/20 text-white font-bold border border-red-500/30' 
                            : 'hover:bg-slate-800 text-slate-200 hover:text-red-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Direct Link: Contact Us */}
            <button
              onClick={() => {
                setActiveTab('contact');
                setActiveDropdown(null);
              }}
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
            </button>

          </nav>

          {/* Desktop Right Action Area: Red Accent Demo Button & Green WhatsApp Button */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            
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

            {/* Red Accent Demo Button (Red Border -> Red Gradient Fill on Hover) */}
            <button
              onClick={onOpenTrialModal}
              className="group relative px-4 py-2.5 rounded-full text-xs font-bold text-white border-2 border-red-500/40 hover:border-red-500 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-red-500 group-hover:text-white fill-current group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.freeTrial}</span>
            </button>

            {/* Primary WhatsApp CTA Button (Kept Green as requested) */}
            <button
              onClick={() => {
                const msg = encodeURIComponent("Hi, I want to enroll in German Language School. Please share payment details.");
                window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
              }}
              className="group relative px-5 py-2.5 rounded-full text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0 animate-pulse group-hover:scale-110 transition-transform duration-300" />
              <span className="whitespace-nowrap">Enroll on WhatsApp</span>
            </button>



          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => {
                const langs = ['en', 'de', 'ur'];
                const next = langs[(langs.indexOf(currentLang) + 1) % langs.length];
                setLanguage(next);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-bold text-red-400 uppercase border border-slate-800 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-red-500/50 transition shadow"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-3 pb-8 space-y-3 animate-fade-in backdrop-blur-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
          
          <div className="space-y-1.5">
            
            {/* Mobile Direct Link: Home */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                activeTab === 'home' 
                  ? 'bg-red-600/20 text-white border border-red-500/40' 
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-5 h-5 text-red-500" />
              <span>{t.nav.home}</span>
            </button>

            {/* Mobile Direct Link: Courses & Fees */}
            <button
              onClick={() => {
                setActiveTab('courses');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                activeTab === 'courses' 
                  ? 'bg-red-600/20 text-white border border-red-500/40' 
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-5 h-5 text-red-500" />
              <span>{t.nav.courses}</span>
            </button>

            {/* Mobile Accordion 1: About */}
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                className="w-full text-left px-4 py-3 bg-slate-900/60 text-xs font-bold text-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-red-500" />
                  <span>About German Language School</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-red-500 transition-transform ${mobileAboutExpanded ? 'rotate-180' : ''}`} />
              </button>

              {mobileAboutExpanded && (
                <div className="bg-slate-950 p-2 space-y-1 border-t border-slate-800">
                  {aboutMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-300 hover:text-red-400 hover:bg-slate-900 flex items-center gap-3 font-semibold"
                      >
                        <Icon className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Accordion 2: Resources */}
            <div className="border border-slate-800/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => setMobileResourcesExpanded(!mobileResourcesExpanded)}
                className="w-full text-left px-4 py-3 bg-slate-900/60 text-xs font-bold text-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-red-500" />
                  <span>Resources & Visa Tips</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-red-500 transition-transform ${mobileResourcesExpanded ? 'rotate-180' : ''}`} />
              </button>

              {mobileResourcesExpanded && (
                <div className="bg-slate-950 p-2 space-y-1 border-t border-slate-800">
                  {resourcesMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl text-xs text-slate-300 hover:text-red-400 hover:bg-slate-900 flex items-center gap-3 font-semibold"
                      >
                        <Icon className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Direct Link: Contact Us */}
            <button
              onClick={() => {
                setActiveTab('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                activeTab === 'contact' 
                  ? 'bg-red-600/20 text-white border border-red-500/40' 
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <PhoneCall className="w-5 h-5 text-red-500" />
              <span>{t.nav.contact}</span>
            </button>

          </div>

          {/* Mobile Action Buttons Footer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenTrialModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full text-xs font-bold border-2 border-red-500/40 text-white hover:bg-red-600 text-center flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-red-500" />
                <span>{t.nav.freeTrial}</span>
              </button>

              <button
                onClick={() => {
                  const msg = encodeURIComponent("Hi, I want to enroll in German Language School. Please share payment details.");
                  window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-full text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-500 text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enroll Now</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </header>
  );
}
