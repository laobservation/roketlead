import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Store, 
  Instagram, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Globe,
  User,
  X
} from 'lucide-react';
import { MerchantProfile, AffiliateProfile } from '../types';
import { INITIAL_MERCHANTS, INITIAL_AFFILIATE_PROFILE } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { StoreLogo } from './StoreLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'seller' | 'promoter';
  initialMode?: 'signin' | 'signup';
  onLoginSeller: (merchant: MerchantProfile) => void;
  onLoginPromoter: (affiliate: AffiliateProfile) => void;
  onOpenAdminLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'seller',
  initialMode = 'signin',
  onLoginSeller,
  onLoginPromoter,
  onOpenAdminLogin
}) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'seller' | 'promoter'>(initialTab);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setAuthMode(initialMode);
    }
  }, [isOpen, initialTab, initialMode]);

  // Seller Form State
  const [sellerEmail, setSellerEmail] = useState<string>('contact@caftanroyal.ma');
  const [sellerPassword, setSellerPassword] = useState<string>('••••••••••••');
  const [sellerStoreUrl, setSellerStoreUrl] = useState<string>('https://caftanroyal.ma');
  const [sellerStoreName, setSellerStoreName] = useState<string>('Caftan Royal Casablanca');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('merch-02');

  // Promoter Form State
  const [promoterEmail, setPromoterEmail] = useState<string>('amine@benjelloun.ma');
  const [promoterPassword, setPromoterPassword] = useState<string>('••••••••••••');
  const [promoterHandle, setPromoterHandle] = useState<string>('@amine_tech_deals');
  const [promoterFullName, setPromoterFullName] = useState<string>('Amine Benjelloun');

  if (!isOpen) return null;

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = INITIAL_MERCHANTS.find(m => m.id === selectedMerchantId) || INITIAL_MERCHANTS[1];
    onLoginSeller(matched);
    onClose();
  };

  const handlePromoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginPromoter(INITIAL_AFFILIATE_PROFILE);
    onClose();
  };

  const handleQuickDemoSeller = (merchant: MerchantProfile) => {
    setSelectedMerchantId(merchant.id);
    setSellerEmail(merchant.website.replace('https://', 'admin@'));
    setSellerStoreName(merchant.companyName);
    setSellerStoreUrl(merchant.website);
    onLoginSeller(merchant);
    onClose();
  };

  const handleQuickDemoPromoter = (handle: string, name: string) => {
    setPromoterHandle(handle);
    setPromoterFullName(name);
    setPromoterEmail(name.toLowerCase().replace(' ', '.') + '@gmail.com');
    onLoginPromoter(INITIAL_AFFILIATE_PROFILE);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-slate-950 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              roketlead<span className="text-blue-500">.</span>
            </span>
            <span className="text-[10px] uppercase font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
              {isAr ? 'منصة الأداء والتسويق' : 'E-commerce Affiliate'}
            </span>
          </div>
          <button 
            id="auth-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* Main User Selection Switcher (Sellers vs Promoters) */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isAr ? 'اختر نوع الحساب' : 'Type de Compte'}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
              
              {/* Option 1: Sellers / Brand Owners */}
              <button
                type="button"
                id="auth-tab-seller"
                onClick={() => setActiveTab('seller')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'seller'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'seller' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">{isAr ? 'بائع / متجر' : 'Vendeur'}</div>
                </div>
              </button>

              {/* Option 2: Promoters / Affiliates */}
              <button
                type="button"
                id="auth-tab-promoter"
                onClick={() => setActiveTab('promoter')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'promoter'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'promoter' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">{isAr ? 'مسوق / صانع محتوى' : 'Promoteur'}</div>
                </div>
              </button>

            </div>
          </div>

          {/* Form Mode Indicator & Toggle Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-950">
              {authMode === 'signup' 
                ? (activeTab === 'seller' ? (isAr ? 'إنشاء حساب بائع جديد' : 'Inscription Vendeur / E-commerce') : (isAr ? 'إنشاء حساب مسوق جديد' : 'Inscription Promoteur / Affilié'))
                : (activeTab === 'seller' ? (isAr ? 'تسجيل الدخول كبائع' : 'Connexion Espace Vendeur') : (isAr ? 'تسجيل الدخول كمسوق' : 'Connexion Espace Promoteur'))
              }
            </h3>
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {authMode === 'signin' 
                ? (isAr ? 'إنشاء حساب جديد' : 'Créer un compte')
                : (isAr ? 'لدي حساب بالفعل' : 'Se connecter')
              }
            </button>
          </div>

          {/* Context Banner */}
          <div className={`mb-5 p-3 rounded-2xl border flex items-center gap-2.5 ${
            activeTab === 'seller' 
              ? 'bg-indigo-50/70 border-indigo-100 text-indigo-950' 
              : 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              activeTab === 'seller' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {activeTab === 'seller' ? <Store className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            </div>
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">
                {activeTab === 'seller' 
                  ? (isAr ? 'مساحة البائعين:' : 'Espace Vendeur :') 
                  : (isAr ? 'مساحة المسوقين:' : 'Espace Promoteur :')}
              </span>{' '}
              {activeTab === 'seller' 
                ? (isAr ? 'أنشئ روابط تتبع لمتجرك وتابع المبيعات والعمولات في الوقت الفعلي.' : 'Générez des liens de tracking et suivez chaque vente réalisée.') 
                : (isAr ? 'احصل على روابط تتبع العروض واكسب عمولات مباشرة على حسابك البنكي.' : 'Accédez aux liens de tracking et retirez vos commissions par virement (RIB).')
              }
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SELLER FORM */}
          {/* ========================================================================= */}
          {activeTab === 'seller' && (
            <form onSubmit={handleSellerSubmit} className="space-y-3.5">
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'اسم المتجر / العلامة التجارية' : 'Nom de la Boutique / Marque'} *
                  </label>
                  <div className="relative">
                    <Store className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <input 
                      type="text"
                      required
                      value={sellerStoreName}
                      onChange={(e) => setSellerStoreName(e.target.value)}
                      placeholder={isAr ? 'مثال: قفطان رويال الدار البيضاء' : 'Ex: Caftan Royal Casablanca'}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'البريد الإلكتروني للعمل' : 'Email Professionnel'} *
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  <input 
                    type="email"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="contact@votre-boutique.ma"
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all`}
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'رابط المتجر الإلكتروني (YouCan, Shopify, WooCommerce)' : 'Lien du Site (YouCan, Shopify, WooCommerce)'} *
                  </label>
                  <div className="relative">
                    <Globe className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <input 
                      type="url"
                      required
                      value={sellerStoreUrl}
                      onChange={(e) => setSellerStoreUrl(e.target.value)}
                      placeholder="https://votre-boutique.ma"
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all`}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isAr ? 'كلمة المرور' : 'Mot de passe'} *
                  </label>
                  {authMode === 'signin' && (
                    <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                      {isAr ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={sellerPassword}
                    onChange={(e) => setSellerPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-3 text-slate-400 hover:text-slate-600`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-seller-auth-btn"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>
                  {authMode === 'signin' 
                    ? (isAr ? 'تسجيل الدخول كبائع' : 'Se connecter comme Vendeur')
                    : (isAr ? 'إنشاء حساب بائع مجاناً' : 'Créer mon compte Vendeur')
                  }
                </span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              {/* Demo 1-Click Seller Accounts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>{isAr ? 'حسابات تجريبية سريعة (1-نقرة)' : 'Comptes Démo (Accès Rapide) :'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSeller(INITIAL_MERCHANTS[1])}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group flex items-center gap-2"
                  >
                    <StoreLogo
                      logo={INITIAL_MERCHANTS[1].logo}
                      name={INITIAL_MERCHANTS[1].companyName}
                      category={INITIAL_MERCHANTS[1].category}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                        Caftan Royal
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">Shopify • Casablanca</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSeller(INITIAL_MERCHANTS[0])}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group flex items-center gap-2"
                  >
                    <StoreLogo
                      logo={INITIAL_MERCHANTS[0].logo}
                      name={INITIAL_MERCHANTS[0].companyName}
                      category={INITIAL_MERCHANTS[0].category}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                        Atlas Botanicals
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">YouCan • Agadir</div>
                    </div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* PROMOTER FORM */}
          {/* ========================================================================= */}
          {activeTab === 'promoter' && (
            <form onSubmit={handlePromoterSubmit} className="space-y-3.5">
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الاسم الكامل (للتحويل البنكي)' : 'Nom Complet (Pour Virements RIB)'} *
                  </label>
                  <div className="relative">
                    <User className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <input 
                      type="text"
                      required
                      value={promoterFullName}
                      onChange={(e) => setPromoterFullName(e.target.value)}
                      placeholder={isAr ? 'مثال: أمين بنجلون' : 'Ex: Amine Benjelloun'}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'البريد الإلكتروني' : 'Adresse Email'} *
                </label>
                <div className="relative">
                  <Mail className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  <input 
                    type="email"
                    required
                    value={promoterEmail}
                    onChange={(e) => setPromoterEmail(e.target.value)}
                    placeholder="amine@createur.ma"
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all`}
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'حساب إنستغرام أو تيك توك أو القناة' : 'Compte Instagram / TikTok / Réseau'} *
                  </label>
                  <div className="relative">
                    <Instagram className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <input 
                      type="text"
                      required
                      value={promoterHandle}
                      onChange={(e) => setPromoterHandle(e.target.value)}
                      placeholder="@votre_compte"
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all`}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isAr ? 'كلمة المرور' : 'Mot de passe'} *
                  </label>
                  {authMode === 'signin' && (
                    <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer">
                      {isAr ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3`} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={promoterPassword}
                    onChange={(e) => setPromoterPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-3 text-slate-400 hover:text-slate-600`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-promoter-auth-btn"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>
                  {authMode === 'signin' 
                    ? (isAr ? 'تسجيل الدخول كمسوق' : 'Se connecter comme Promoteur')
                    : (isAr ? 'الانضمام كمسوق مجاناً' : 'Rejoindre comme Promoteur')
                  }
                </span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              {/* Demo 1-Click Promoter Accounts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>{isAr ? 'حسابات مسوقين تجريبية (1-نقرة)' : 'Comptes Démo (Accès Rapide) :'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoPromoter('@amine_tech_deals', 'Amine Benjelloun')}
                    className="p-2 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1 truncate">
                      <span>⚡</span> Amine Deals
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">CIH Bank • Pro</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoPromoter('@sarah_beauty_ma', 'Sarah Kabbaj')}
                    className="p-2 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1 truncate">
                      <span>💄</span> Sarah Glam
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">Attijariwafa • Beauty</div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* SaaS Owner Hidden Admin Note */}
          <div className="mt-5 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              TLS 256-bit Encrypted
            </span>
            <button
              type="button"
              id="admin-login-hint-btn"
              onClick={() => {
                onClose();
                onOpenAdminLogin();
              }}
              className="text-slate-400 hover:text-slate-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>/admin/login</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
