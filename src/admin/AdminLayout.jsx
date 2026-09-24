import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  GraduationCap, 
  UserCheck, 
  Newspaper, 
  MessageSquare, 
  BarChart3, 
  Bell, 
  Settings as SettingsIcon, 
  LogOut, 
  ShieldCheck, 
  Globe, 
  Lock,
  Video,
  Award,
  CreditCard,
  Palette,
  Menu,
  X,
  Star,
  Image as ImageIcon,
  MapPin,
  Edit3,
  BookOpen,
  ShoppingCart,
  Ticket,
  Megaphone,
  FileCode2,
  Trophy,
  ChevronDown,
  Search
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function AdminLayout({ 
  currentTab, 
  setCurrentTab, 
  userSession, 
  onLogout,
  onReturnToSite,
  currentLang,
  children 
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({ overview: true });
  const [menuSearch, setMenuSearch] = useState('');
  const t = translations[currentLang];

  const menuItems = [
    { id: 'dashboard', label: t.admin.dashboard, icon: LayoutDashboard },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, badge: 'New' },
    { id: 'documents', label: t.admin.documents, icon: FileText, badge: 'OCR' },
    { id: 'students', label: t.admin.students, icon: Users },
    { id: 'coursesManager', label: t.admin.coursesManager, icon: GraduationCap },
    { id: 'teachersManager', label: t.admin.teachersManager, icon: UserCheck },
    { id: 'recordings', label: t.admin.recordings, icon: Video, badge: 'HD' },
    { id: 'certificateManager', label: t.admin.certificateManager, icon: Award, badge: 'Carousel' },
    { id: 'booksManager', label: 'Books Manager', icon: BookOpen },
    { id: 'bookOrders', label: 'Book Orders', icon: ShoppingCart },
    { id: 'paymentStatus', label: t.admin.paymentStatus, icon: CreditCard },
    { id: 'couponManager', label: 'Coupon Manager', icon: Ticket },
    { id: 'themeCustomizer', label: 'Theme Customizer', icon: Palette, badge: 'CSS' },
    { id: 'practiceTests', label: 'Practice Tests', icon: FileCode2, badge: 'New' },
    { id: 'nounBuilder', label: 'Noun Builder', icon: BookOpen, badge: 'New' },
    { id: 'chapterVocab', label: 'Chapter Vocab', icon: BookOpen, badge: 'New' },
    { id: 'smartVocabResults', label: 'Smart Vocab Results', icon: Trophy, badge: 'New' },
    { id: 'grammarChapters', label: 'Grammar Chapters', icon: BookOpen, badge: 'New' },
    { id: 'grammarResults', label: 'Grammar Results', icon: Trophy, badge: 'New' },
    { id: 'readingPassages', label: 'Reading Passages', icon: BookOpen, badge: 'New' },
    { id: 'readingResults', label: 'Reading Results', icon: Trophy, badge: 'New' },
    { id: 'blogCMS', label: t.admin.blogCMS, icon: Newspaper },
    { id: 'inquiries', label: t.admin.inquiries, icon: MessageSquare, badge: '3' },
    { id: 'testimonialsManager', label: 'Testimonials', icon: Star },
    { id: 'galleryManager', label: 'Gallery Management', icon: ImageIcon },
    { id: 'analytics', label: t.admin.analytics, icon: BarChart3 },
    { id: 'notifications', label: t.admin.notifications, icon: Bell },
    { id: 'googleReviews', label: 'Google Reviews', icon: MapPin },
    { id: 'globalContent', label: 'Global Settings', icon: Edit3 },
    { id: 'settings', label: t.admin.settings, icon: SettingsIcon },
  ];

  // Keep every existing menu id and action while organizing the long menu into sections.
  const menuItemById = Object.fromEntries(menuItems.map((item) => [item.id, item]));
  const menuGroups = [
    { id: 'overview', label: 'Overview', itemIds: ['dashboard', 'analytics'] },
    { id: 'people', label: 'People', itemIds: ['students', 'teachersManager', 'inquiries'] },
    { id: 'learning', label: 'Learning', itemIds: ['coursesManager', 'recordings', 'certificateManager', 'practiceTests', 'nounBuilder', 'chapterVocab', 'smartVocabResults', 'grammarChapters', 'grammarResults', 'readingPassages', 'readingResults'] },
    { id: 'content', label: 'Website Content', itemIds: ['announcements', 'documents', 'blogCMS', 'testimonialsManager', 'galleryManager', 'googleReviews'] },
    { id: 'commerce', label: 'Orders & Payments', itemIds: ['booksManager', 'bookOrders', 'paymentStatus', 'couponManager'] },
    { id: 'settings', label: 'Settings', itemIds: ['themeCustomizer', 'notifications', 'globalContent', 'settings'] },
  ].map((group) => ({ ...group, items: group.itemIds.map((id) => menuItemById[id]).filter(Boolean) }));

  useEffect(() => {
    const activeGroup = menuGroups.find((group) => group.items.some((item) => item.id === currentTab));
    if (activeGroup) {
      setOpenGroups((previous) => ({ ...previous, [activeGroup.id]: true }));
    }
  }, [currentTab]);

  const normalizedSearch = menuSearch.trim().toLowerCase();
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: normalizedSearch
        ? group.items.filter((item) => item.label.toLowerCase().includes(normalizedSearch))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[min(84vw,18rem)] shrink-0 transform flex-col overflow-hidden border-r border-slate-800 bg-slate-900 shadow-2xl shadow-black/30 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-300 to-amber-500 text-sm font-black tracking-tight text-slate-950 shadow-lg shadow-amber-950/30">
              DE
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white">German Language</h2>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                Admin Portal
              </span>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close admin menu"
            className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:border-slate-600 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Session Card */}
        <div className="mx-3 mt-3 rounded-2xl border border-slate-800 bg-slate-950/75 p-3.5 shadow-inner shadow-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="min-w-0 flex-1 truncate">{userSession.email}</span>
            <span className="max-w-20 shrink-0 rounded-lg border border-amber-400/15 bg-amber-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-300">
              {userSession.role}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>2FA verified session</span>
          </div>
        </div>

        {/* Grouped Navigation */}
        <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <label className="relative mb-3 block">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={menuSearch}
              onChange={(event) => setMenuSearch(event.target.value)}
              placeholder="Find a section..."
              aria-label="Search admin sections"
              className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 text-xs text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
            />
          </label>

          <div className="space-y-2">
            {visibleGroups.map((group) => {
              const isOpen = Boolean(normalizedSearch) || Boolean(openGroups[group.id]);
              return (
                <section key={group.id} className="rounded-2xl border border-slate-800/80 bg-slate-950/25 p-1.5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`admin-nav-${group.id}`}
                    onClick={() => setOpenGroups((previous) => ({ ...previous, [group.id]: !previous[group.id] }))}
                    className="flex min-h-10 w-full items-center justify-between rounded-xl px-2.5 text-left text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 transition hover:bg-slate-800/70 hover:text-slate-200"
                  >
                    <span>{group.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold tracking-normal text-slate-500">{group.items.length}</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div id={`admin-nav-${group.id}`} className="mt-1 space-y-1 pb-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => {
                              setCurrentTab(item.id);
                              setMobileSidebarOpen(false);
                              setMenuSearch('');
                            }}
                            className={`group flex min-h-10 w-full items-center justify-between gap-2 rounded-xl border px-2.5 text-left text-xs transition-all ${
                              isActive
                                ? 'border-amber-400/25 bg-gradient-to-r from-amber-400/15 to-amber-400/[0.04] font-bold text-amber-200 shadow-sm shadow-amber-950/20'
                                : 'border-transparent text-slate-400 hover:border-slate-700/80 hover:bg-slate-800/80 hover:text-slate-100'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
                              <span className="truncate">{item.label}</span>
                            </span>
                            {item.badge && item.badge !== '3' && (
                              <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-amber-300/15 text-amber-200' : 'bg-slate-800 text-slate-500'}`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
            {visibleGroups.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-800 px-3 py-5 text-center text-xs text-slate-500">No matching admin sections.</p>
            )}
          </div>
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="space-y-2 border-t border-slate-800 bg-slate-900/95 p-3.5 sm:p-4">
          <button
            onClick={onReturnToSite}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-3 py-2 text-xs font-bold text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-400/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.logout}</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Admin Navbar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white capitalize">
              {menuItems.find(m => m.id === currentTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              • Live Backend Connected
            </span>
            <button
              onClick={onReturnToSite}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow hover:bg-amber-400 transition"
            >
              Public Site
            </button>
          </div>
        </header>

        {/* Main View Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
