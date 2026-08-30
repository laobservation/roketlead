import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { MerchantProfile, AffiliateProfile } from '../types';
import { INITIAL_MERCHANTS, INITIAL_AFFILIATE_PROFILE } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'seller' | 'promoter';
  onLoginSeller: (merchant: MerchantProfile) => void;
  onLoginPromoter: (affiliate: AffiliateProfile) => void;
  onOpenAdminLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'seller',
  onLoginSeller,
  onLoginPromoter,
  onOpenAdminLogin
}) => {
  const [activeTab, setActiveTab] = useState<'seller' | 'promoter'>(initialTab);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              roketlead<span className="text-blue-500">.</span>
            </span>
            <span className="text-[10px] uppercase font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
              Moroccan Performance Portal
            </span>
          </div>
          <button 
            id="auth-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Main User Selection Switcher (Sellers vs Promoters) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
              
              {/* Option 1: Sellers / Brand Owners */}
              <button
                type="button"
                id="auth-tab-seller"
                onClick={() => {
                  setActiveTab('seller');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'seller'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'seller' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="leading-tight">Brand / Seller</div>
                  <div className="text-[10px] font-normal text-slate-500 hidden sm:block">E-commerce Merchants</div>
                </div>
              </button>

              {/* Option 2: Promoters / Affiliates */}
              <button
                type="button"
                id="auth-tab-promoter"
                onClick={() => {
                  setActiveTab('promoter');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  activeTab === 'promoter'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'promoter' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="leading-tight">Promoter / Affiliate</div>
                  <div className="text-[10px] font-normal text-slate-500 hidden sm:block">Influencers & Creators</div>
                </div>
              </button>

            </div>
          </div>

          {/* Context Banner */}
          <div className={`mb-6 p-3.5 rounded-2xl border flex items-center gap-3 ${
            activeTab === 'seller' 
              ? 'bg-indigo-50/70 border-indigo-100 text-indigo-950' 
              : 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              activeTab === 'seller' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {activeTab === 'seller' ? <Store className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className="text-xs leading-relaxed">
              <span className="font-bold">
                {activeTab === 'seller' ? 'Seller Workspace:' : 'Creator Workspace:'}
              </span>{' '}
              {activeTab === 'seller' 
                ? 'Sign in to monitor affiliate sales, verify COD delivery statuses, and issue promo codes in MAD.' 
                : 'Sign in to access tracking links, coupon codes, and withdraw earned Dirhams directly to your Moroccan bank RIB.'
              }
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SELLER LOGIN FORM */}
          {/* ========================================================================= */}
          {activeTab === 'seller' && (
            <form onSubmit={handleSellerSubmit} className="space-y-4">
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand Name</label>
                  <div className="relative">
                    <input 
                      type="text"
                      required
                      value={sellerStoreName}
                      onChange={(e) => setSellerStoreName(e.target.value)}
                      placeholder="e.g. Caftan Royal Casablanca"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="email"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="contact@yourstore.ma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <a href="#forgot" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={sellerPassword}
                    onChange={(e) => setSellerPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Store Website (YouCan, Shopify, WooCommerce)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="url"
                      required
                      value={sellerStoreUrl}
                      onChange={(e) => setSellerStoreUrl(e.target.value)}
                      placeholder="https://yourstore.ma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="submit-seller-login-btn"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{authMode === 'signin' ? 'Sign in as Brand Owner' : 'Create Seller Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Seller Accounts */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Quick Demo Logins (Moroccan Brands)</span>
                  <span className="text-[10px] text-indigo-600 font-semibold">1-Click Access</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSeller(INITIAL_MERCHANTS[1])}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                      <span>👑</span> Caftan Royal
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">Shopify • Casablanca</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSeller(INITIAL_MERCHANTS[0])}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                      <span>🌿</span> Atlas Botanicals
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">YouCan • Agadir</div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* PROMOTER / AFFILIATE LOGIN FORM */}
          {/* ========================================================================= */}
          {activeTab === 'promoter' && (
            <form onSubmit={handlePromoterSubmit} className="space-y-4">
              
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name (For Bank Wire)</label>
                  <input 
                    type="text"
                    required
                    value={promoterFullName}
                    onChange={(e) => setPromoterFullName(e.target.value)}
                    placeholder="e.g. Amine Benjelloun"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Creator Handle</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={promoterEmail}
                    onChange={(e) => setPromoterEmail(e.target.value)}
                    placeholder="amine@creator.ma or @amine_deals"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <a href="#forgot" className="text-xs text-emerald-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={promoterPassword}
                    onChange={(e) => setPromoterPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Social Channel / Handle</label>
                  <div className="relative">
                    <Instagram className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      required
                      value={promoterHandle}
                      onChange={(e) => setPromoterHandle(e.target.value)}
                      placeholder="@your_instagram_or_tiktok"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="submit-promoter-login-btn"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{authMode === 'signin' ? 'Sign in as Promoter' : 'Join as Affiliate Creator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo 1-Click Promoter Accounts */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Quick Demo Logins (Moroccan Creators)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">1-Click Access</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoPromoter('@amine_tech_deals', 'Amine Benjelloun')}
                    className="p-2 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1">
                      <span>⚡</span> Amine Tech Deals
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">CIH Bank • Pro Affiliate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoPromoter('@sarah_beauty_ma', 'Sarah Kabbaj')}
                    className="p-2 text-left bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1">
                      <span>💄</span> Sarah Glam MA
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">Attijariwafa • Beauty Partner</div>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  Create {activeTab === 'seller' ? 'a Brand' : 'an Affiliate'} account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-slate-900 hover:underline cursor-pointer"
                >
                  Sign in to existing account
                </button>
              </span>
            )}
          </div>

          {/* SaaS Owner Hidden Admin Note */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              256-bit TLS Encrypted
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
              <span>SaaS Owner Login (/admin/login)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
