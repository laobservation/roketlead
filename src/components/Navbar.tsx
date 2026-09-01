import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  LogOut, 
  ArrowRight,
  Globe,
  Menu,
  X,
  Sparkles,
  User,
  LogIn,
  UserPlus,
  Store,
  ChevronDown
} from 'lucide-react';
import { MerchantProfile, AffiliateProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentView: 'landing' | 'admin' | 'merchant' | 'affiliate' | 'earlyaccess';
  onViewChange: (view: 'landing' | 'admin' | 'merchant' | 'affiliate' | 'earlyaccess') => void;
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
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setMobileProfileOpen(false);
      }
    };
    if (mobileProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileProfileOpen]);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    setMobileProfileOpen(false);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Logo - RoketLead */}
          <div className="flex items-center shrink-0">
            <button 
              id="nav-logo-btn"
              onClick={() => {
                onViewChange('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 py-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 hover:opacity-90 transition-opacity cursor-pointer group"
            >
              <span className="font-extrabold tracking-tighter text-slate-950 group-hover:text-blue-600 transition-colors">
                roketlead<span className="text-blue-600">.</span>
              </span>
            </button>
          </div>

          {/* Center: Primary Centered Navigation Links */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10 text-[15px] lg:text-base font-semibold text-slate-700 px-4">
            <button 
              id="nav-home-btn"
              onClick={() => handleNavClick('home-top')}
              className="hover:text-blue-600 transition-colors py-2 cursor-pointer"
            >
              {t('nav.home')}
            </button>

            <button 
              id="nav-about-btn"
              onClick={() => handleNavClick('section-about')}
              className="hover:text-blue-600 transition-colors py-2 cursor-pointer"
            >
              {t('nav.whoWeAre')}
            </button>

            <button 
              id="nav-how-btn"
              onClick={() => handleNavClick('section-how-it-works')}
              className="hover:text-blue-600 transition-colors py-2 cursor-pointer"
            >
              {t('nav.howItWorks')}
            </button>

            <button 
              id="nav-contact-btn"
              onClick={() => handleNavClick('section-contact')}
              className="hover:text-blue-600 transition-colors py-2 cursor-pointer"
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Controls: Language Selector & Auth CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Applied Language Switcher Button (Shows only the active language, direct tap without hover dependency) */}
            <button
              id="lang-toggle-btn"
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer shrink-0"
              title={language === 'fr' ? 'Changer en العربية' : 'Passer en Français'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold text-xs">{language === 'fr' ? 'FR' : 'العربية'}</span>
            </button>

            {/* Active Merchant Portal Badge (Desktop) */}
            {currentUserRole === 'MERCHANT' && (
              <div className="hidden sm:flex items-center gap-2">
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

            {/* Active Affiliate Portal Badge (Desktop) */}
            {currentUserRole === 'AFFILIATE' && (
              <div className="hidden sm:flex items-center gap-2">
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

            {/* Super Admin Status (Desktop) */}
            {currentUserRole === 'SUPER_ADMIN' && (
              <div className="hidden sm:flex items-center gap-2">
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

            {/* Desktop Guest Actions (Sign In / Sign Up) */}
            {currentUserRole === 'GUEST' && (
              <div className="hidden md:flex items-center gap-2">
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

            {/* Mobile Profile Icon Button & Dropdown (Next to Language Switcher) */}
            <div className="relative md:hidden" ref={profileDropdownRef}>
              <button
                id="mobile-profile-btn"
                type="button"
                onClick={() => {
                  setMobileProfileOpen(!mobileProfileOpen);
                  setMobileMenuOpen(false);
                }}
                aria-label="Profil & Connexion"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                  mobileProfileOpen 
                    ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-xs' 
                    : currentUserRole !== 'GUEST'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 active:bg-slate-200'
                }`}
              >
                {currentUserRole === 'MERCHANT' ? (
                  <Building2 className="w-4 h-4 text-indigo-600" />
                ) : currentUserRole === 'AFFILIATE' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                ) : currentUserRole === 'SUPER_ADMIN' ? (
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* Mobile Profile Dropdown Popover */}
              {mobileProfileOpen && (
                <div 
                  className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
                >
                  {currentUserRole === 'GUEST' ? (
                    <div className="space-y-2 px-2">
                      <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setMobileProfileOpen(false);
                            onOpenSignIn ? onOpenSignIn('seller') : onViewChange('merchant');
                          }}
                          className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{language === 'ar' ? 'بائع' : 'Vendeur'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setMobileProfileOpen(false);
                            onOpenSignIn ? onOpenSignIn('promoter') : onViewChange('affiliate');
                          }}
                          className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{language === 'ar' ? 'مسوق' : 'Promoteur'}</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {language === 'ar' ? 'إنشاء حساب جديد' : 'Inscription'}
                        </div>
                        <div className="space-y-1.5">
                          <button
                            onClick={() => {
                              setMobileProfileOpen(false);
                              onOpenSignUp ? onOpenSignUp('seller') : onViewChange('merchant');
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 text-left text-xs font-bold text-blue-900 cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-blue-600" />
                              {language === 'ar' ? 'ابدأ كبائع / متجر' : 'Démarrer comme Vendeur'}
                            </span>
                            <ArrowRight className={`w-3 h-3 text-blue-600 ${isRTL ? 'rotate-180' : ''}`} />
                          </button>
                          <button
                            onClick={() => {
                              setMobileProfileOpen(false);
                              onOpenSignUp ? onOpenSignUp('promoter') : onViewChange('affiliate');
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/70 text-left text-xs font-bold text-emerald-900 cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              {language === 'ar' ? 'انضم كمسوق / صانع محتوى' : 'Devenir Promoteur'}
                            </span>
                            <ArrowRight className={`w-3 h-3 text-emerald-600 ${isRTL ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 px-3 py-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {currentUserRole === 'MERCHANT' 
                          ? (activeMerchant?.companyName || 'Espace Vendeur')
                          : currentUserRole === 'AFFILIATE'
                            ? (activeAffiliate?.fullName || 'Espace Promoteur')
                            : 'Super Admin'}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">
                        {currentUserRole === 'MERCHANT' ? 'Boutique Partenaire' : currentUserRole === 'AFFILIATE' ? 'Affilié / Promoteur' : 'Console Racine'}
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            setMobileProfileOpen(false);
                            if (currentUserRole === 'MERCHANT') onViewChange('merchant');
                            else if (currentUserRole === 'AFFILIATE') onViewChange('affiliate');
                            else if (currentUserRole === 'SUPER_ADMIN') onViewChange('admin');
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold text-center cursor-pointer"
                        >
                          {language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}
                        </button>
                        <button
                          onClick={() => {
                            setMobileProfileOpen(false);
                            if (onLogout) onLogout();
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>{language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Menu Toggle Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileProfileOpen(false);
              }}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-950 md:hidden rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer Menu */}
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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
              <span className="text-xs text-slate-500 font-medium">{t('nav.language')} :</span>
              <button
                onClick={() => {
                  setLanguage(language === 'fr' ? 'ar' : 'fr');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'fr' ? 'FR' : 'العربية'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

