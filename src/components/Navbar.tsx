import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  LogOut, 
  ArrowRight,
  Globe,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { MerchantProfile, AffiliateProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentView: 'landing' | 'admin' | 'merchant' | 'affiliate';
  onViewChange: (view: 'landing' | 'admin' | 'merchant' | 'affiliate') => void;
  onOpenSignIn?: (initialTab?: 'seller' | 'promoter') => void;
  onOpenSignUp?: (initialTab?: 'seller' | 'promoter') => void;
  onOpenAdminLogin?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  currentUserRole?: 'GUEST' | 'MERCHANT' | 'AFFILIATE' | 'SUPER_ADMIN';
  activeMerchant?: MerchantProfile | null;
  activeAffiliate?: AffiliateProfile | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onViewChange, 
  onOpenSignIn,
  onOpenSignUp,
  onOpenAdminLogin,
  onNavigateSection,
  currentUserRole = 'GUEST',
  activeMerchant,
  activeAffiliate,
  onLogout
}) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onViewChange('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (sectionId === 'home-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
            {/* Logo - RoketLead */}
          <div className="flex items-center gap-8">
            <button 
              id="nav-logo-btn"
              onClick={() => {
                onViewChange('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-2xl font-black tracking-tight text-slate-950 hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-950 group-hover:text-blue-600 transition-colors">
                roketlead<span className="text-blue-600">.</span>
              </span>
            </button>

            {/* Public Natural Navigation Links: Accueil, Qui sommes-nous, Comment ça marche, Contact */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <button 
                id="nav-home-btn"
                onClick={() => handleNavClick('home-top')}
                className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                {t('nav.home')}
              </button>

              <button 
                id="nav-about-btn"
                onClick={() => handleNavClick('section-about')}
                className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                {t('nav.whoWeAre')}
              </button>

              <button 
                id="nav-how-btn"
                onClick={() => handleNavClick('section-how-it-works')}
                className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                {t('nav.howItWorks')}
              </button>

              <button 
                id="nav-contact-btn"
                onClick={() => handleNavClick('section-contact')}
                className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                {t('nav.contact')}
              </button>
            </nav>
          </div>

          {/* Controls: Language Selector & Auth CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Applied Language Switcher Button (Shows only the active language) */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 active:scale-98 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
              title={language === 'fr' ? 'Changer en العربية' : 'Passer en Français'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold">{language === 'fr' ? 'FR' : 'العربية'}</span>
            </button>

            {/* Active Merchant Portal Badge */}
            {currentUserRole === 'MERCHANT' && (
              <div className="flex items-center gap-2">
                <button
                  id="nav-active-merchant-portal-btn"
                  onClick={() => onViewChange('merchant')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'merchant'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span className="truncate max-w-[130px]">
                    {activeMerchant ? activeMerchant.companyName : t('nav.sellerPortal')}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-indigo-600 text-white rounded-md uppercase tracking-wider">
                    {t('nav.seller')}
                  </span>
                </button>

                <button
                  id="nav-seller-logout-btn"
                  onClick={onLogout}
                  title={t('nav.switchAccount')}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Active Affiliate Portal Badge */}
            {currentUserRole === 'AFFILIATE' && (
              <div className="flex items-center gap-2">
                <button
                  id="nav-active-affiliate-portal-btn"
                  onClick={() => onViewChange('affiliate')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'affiliate'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-[130px]">
                    {activeAffiliate ? activeAffiliate.fullName : t('nav.promoterPortal')}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-emerald-600 text-white rounded-md uppercase tracking-wider">
                    {t('nav.promoter')}
                  </span>
                </button>

                <button
                  id="nav-affiliate-logout-btn"
                  onClick={onLogout}
                  title={t('nav.switchAccount')}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Super Admin Status */}
            {currentUserRole === 'SUPER_ADMIN' && (
              <div className="flex items-center gap-2">
                <button
                  id="nav-active-admin-portal-btn"
                  onClick={() => onViewChange('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-purple-950 border-purple-800 text-purple-200 shadow-xs'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">SaaS Console</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-purple-600 text-white rounded-md uppercase tracking-wider">
                    ROOT
                  </span>
                </button>

                <button
                  id="nav-admin-logout-btn"
                  onClick={onLogout}
                  title="Exit SaaS Admin Session"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Guest Actions (Sign In / Sign Up) */}
            {currentUserRole === 'GUEST' && (
              <div className="flex items-center gap-2">
                <button
                  id="header-signin-btn"
                  onClick={() => onOpenSignIn ? onOpenSignIn('seller') : onViewChange('merchant')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  {t('nav.signIn')}
                </button>

                <button
                  id="header-signup-btn"
                  onClick={() => onOpenSignUp ? onOpenSignUp('seller') : onViewChange('affiliate')}
                  className="px-4.5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{t('nav.signUp')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-950 md:hidden rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
            <button 
              onClick={() => handleNavClick('home-top')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => handleNavClick('section-about')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {t('nav.whoWeAre')}
            </button>
            <button 
              onClick={() => handleNavClick('section-how-it-works')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {t('nav.howItWorks')}
            </button>
            <button 
              onClick={() => handleNavClick('section-contact')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {t('nav.contact')}
            </button>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              <span className="text-xs text-slate-500 font-medium">{t('nav.language')} :</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setLanguage('fr'); setMobileMenuOpen(false); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${language === 'fr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Français
                </button>
                <button
                  onClick={() => { setLanguage('ar'); setMobileMenuOpen(false); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
