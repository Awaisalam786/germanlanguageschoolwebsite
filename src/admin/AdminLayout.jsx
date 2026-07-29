import React, { useState } from 'react';
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
  Megaphone
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 h-screen sticky top-0">
        
        {/* Top Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-gold-glow">
            🇩🇪
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight">German Language School</h2>
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
        </div>

        {/* User Session Card */}
        <div className="p-4 bg-slate-950/80 m-3 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="truncate max-w-[120px]">{userSession.email}</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">
              {userSession.role}
            </span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>2FA Verified Session</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onReturnToSite}
            className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 font-bold flex items-center justify-center gap-2 transition"
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
