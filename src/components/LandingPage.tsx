import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  TrendingUp, 
  Heart, 
  ExternalLink,
  Calculator,
  Check,
  Building2,
  Lock,
  MessageSquare,
  Send,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Play,
  ArrowUpRight,
  Package,
  Layers,
  Search
} from 'lucide-react';
import { INITIAL_MERCHANTS } from '../data/mockData';
import { MerchantProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onStartSeller?: () => void;
  onStartPromoter?: () => void;
  onNavigateToAffiliate: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToMerchant?: () => void;
  onSelectMerchant?: (merchant: MerchantProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartSeller,
  onStartPromoter,
  onNavigateToAffiliate, 
  onNavigateToAdmin,
  onNavigateToMerchant,
  onSelectMerchant 
}) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  // Interactive Calculator State
  const [affiliateCount, setAffiliateCount] = useState<number>(35);
  const [avgOrderValueMAD, setAvgOrderValueMAD] = useState<number>(450);
  const [salesPerAffiliateMonth, setSalesPerAffiliateMonth] = useState<number>(20);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [favoriteMerchants, setFavoriteMerchants] = useState<string[]>(['merch-01', 'merch-02']);
  const [marketSearch, setMarketSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Contact Form State
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactType, setContactType] = useState<'seller' | 'promoter' | 'other'>('seller');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculated estimates for Moroccan Dirhams
  const estimatedMonthlyOrders = affiliateCount * salesPerAffiliateMonth;
  const estimatedMonthlyVolumeMAD = estimatedMonthlyOrders * avgOrderValueMAD;
  const estimatedAffiliatePayoutMAD = estimatedMonthlyVolumeMAD * 0.12; // 12% avg commission
  const estimatedNetNewRevenueMAD = estimatedMonthlyVolumeMAD - estimatedAffiliatePayoutMAD;

  const toggleFavorite = (id: string) => {
    setFavoriteMerchants(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 6000);
  };

  // Filtered merchants
  const filteredMerchants = INITIAL_MERCHANTS.filter(m => {
    const matchQuery = m.companyName.toLowerCase().includes(marketSearch.toLowerCase()) ||
                       m.description.toLowerCase().includes(marketSearch.toLowerCase()) ||
                       m.city.toLowerCase().includes(marketSearch.toLowerCase()) ||
                       m.category.toLowerCase().includes(marketSearch.toLowerCase());
    const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  const categories = ['All', 'Health & Beauty', 'Fashion & Artisanal', 'SaaS', 'Electronics'];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans" id="home-top">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO & VALUE PROPOSITION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Soft Ethereal Glow & Subtle Orbital Rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[850px] h-[550px] bg-gradient-to-tr from-blue-200/50 via-indigo-100/40 to-purple-100/30 blur-3xl rounded-full opacity-70 -translate-y-24" />
          <div className="absolute w-[600px] h-[600px] hero-orbital-ring opacity-40 -translate-y-16" />
          <div className="absolute w-[850px] h-[850px] hero-orbital-ring opacity-25 -translate-y-16" />
          <div className="absolute w-[1100px] h-[1100px] hero-orbital-ring opacity-15 -translate-y-16" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Localized Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-extrabold text-slate-950 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            {t('hero.title1')}{' '}
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {t('hero.subtitle')}
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 sm:mb-16">
            <button
              id="hero-start-seller-btn"
              onClick={onStartSeller || onNavigateToMerchant || onNavigateToAffiliate}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-full shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('hero.ctaSeller')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <button
              id="hero-start-promoter-btn"
              onClick={onStartPromoter || onNavigateToAffiliate}
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 text-sm sm:text-base font-bold text-slate-800 bg-white hover:bg-slate-50 active:scale-98 border border-slate-200/90 rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t('hero.ctaPromoter')}</span>
            </button>
          </div>

          {/* Floating Live Showcase Card */}
          <div className="relative max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-blue-300/40 via-white/80 to-indigo-100/50 shadow-2xl card-glow-subtle transition-transform duration-300 hover:scale-[1.005]">
            <div className="bg-white/95 backdrop-blur-md rounded-[22px] border border-slate-100 p-4 sm:p-7 overflow-hidden text-left relative">
              
              {/* Top Bar of the Mock Dashboard */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xs shadow-blue-500/30">
                    r.
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {isAr ? 'مركز الأداء والتجارة الإلكترونية بالمغرب' : 'Plateforme d’Affiliation & E-Commerce Maroc'}
                      </h3>
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                        {isAr ? 'مباشر وتلقائي' : 'Tracking Actif'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {isAr ? 'شبكة التوصيل الوطني والدفع عند الاستلام COD' : 'Réseau National COD (Casablanca, Rabat, Marrakech, Fès)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateToMerchant && (
                    <button 
                      onClick={onNavigateToMerchant}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{t('nav.sellerPortal')}</span>
                    </button>
                  )}
                  <button 
                    onClick={onNavigateToAffiliate}
                    className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{t('nav.promoterPortal')}</span>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Real-time KPI Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      {isAr ? 'حجم المبيعات المستلمة' : 'Volume Livré COD'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +87.3%
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                    248,400 <span className="text-xs font-bold text-slate-500">{isAr ? 'د.م' : 'MAD'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      {isAr ? 'النقرات المؤكدة' : 'Clics Trackés'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +44.2%
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                    78,530
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      {isAr ? 'المسوقون النشطون' : 'Promoteurs Actifs'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +78.9%
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                    154
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      {isAr ? 'العمولات المحولة' : 'Commissions Versées'}
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      +27.6%
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-950">
                    83,302 <span className="text-xs font-bold text-slate-500">{isAr ? 'د.م' : 'MAD'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom mini preview row */}
              <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 p-4 rounded-xl border border-blue-100/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {isAr ? 'ربط تلقائي مع أمانة، كاثيديس، وسندإت' : 'Synchronisation Directe Amana & Cathedis Webhooks'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isAr ? 'يتم تحويل العمولة للرصيد فور تسليم الطرد وقبض المبلغ من الزبون.' : 'Les commissions sont débloquées dès confirmation de livraison par le transporteur.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToAffiliate}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                >
                  {isAr ? 'دخول فوري كمسوق' : 'Accéder au Portail Promoteur'}
                </button>
              </div>

            </div>
          </div>

          {/* Moroccan Trust & Platform Integrations Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/60">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              {isAr ? 'متوافق ومتكامل مع منظومة التجارة الإلكترونية والبنوك في المغرب' : 'Compatible avec l’écosystème e-commerce et bancaire marocain'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-semibold text-slate-600">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>YouCan.shop</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Shopify Morocco</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>WooCommerce</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Amana & Cathedis COD</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>CIH & Attijari RIB</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: QUI SOMMES-NOUS / ABOUT US (Natural public anchor) */}
      {/* ========================================================================= */}
      <section id="section-about" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>{t('about.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
              {t('about.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-blue-300 transition-all card-glow-subtle flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">
                  {t('about.card1.title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about.card1.desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'روابط تتبع مخصصة وسريعة rkt.ma' : 'Liens courts rkt.ma ultra-rapides'}</span>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 transition-all card-glow-subtle flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
                  📈
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">
                  {t('about.card2.title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about.card2.desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-indigo-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'نمو مبني 100% على الأداء والمبيعات' : 'Croissance 100% à la performance'}</span>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-300 transition-all card-glow-subtle flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
                  💳
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-3">
                  {t('about.card3.title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('about.card3.desc')}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تحويل فوري إلى جميع الأبناك المغربية' : 'Virements directs vers tous les RIB marocains'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: COMMENT ÇA MARCHE / HOW IT WORKS */}
      {/* ========================================================================= */}
      <section id="section-how-it-works" className="py-20 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200">
              <Layers className="w-3.5 h-3.5" />
              <span>{t('how.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
              {t('how.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('how.subtitle')}
            </p>
          </div>

          {/* 4 Step Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-blue-600/20 block mb-4">01</span>
                <h4 className="text-lg font-bold text-slate-950 mb-2">{t('how.step1.title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('how.step1.desc')}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-blue-600">
                rkt.ma • YouCan • Shopify • WooCommerce
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-indigo-600/20 block mb-4">02</span>
                <h4 className="text-lg font-bold text-slate-950 mb-2">{t('how.step2.title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('how.step2.desc')}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-indigo-600">
                rkt.ma/c/... • Instagram • TikTok • YouTube
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-emerald-600/20 block mb-4">03</span>
                <h4 className="text-lg font-bold text-slate-950 mb-2">{t('how.step3.title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('how.step3.desc')}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
                {isAr ? 'تتبع فوري ومباشر للمبيعات' : 'Attribution Pixel & Suivi en Temps Réel'}
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-rose-600/20 block mb-4">04</span>
                <h4 className="text-lg font-bold text-slate-950 mb-2">{t('how.step4.title')}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{t('how.step4.desc')}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-semibold text-rose-600">
                CIH • Attijariwafa • Chaabi (RIB)
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MARKETPLACE DES OFFRES / CAMPAIGNS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-200">
              <Zap className="w-3.5 h-3.5" />
              <span>{t('market.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
              {t('market.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('market.subtitle')}
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('market.searchPlaceholder')}
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? t('market.filterAll') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {filteredMerchants.slice(0, 6).map((merchant) => {
              const isFav = favoriteMerchants.includes(merchant.id);
              return (
                <div 
                  key={merchant.id}
                  className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-2xs">
                          {merchant.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-950 text-base">{merchant.companyName}</h4>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{merchant.category} • {merchant.city}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(merchant.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isFav ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-700'
                        }`}
                        aria-label="Add to wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {merchant.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {merchant.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="text-slate-500 font-medium">{t('market.commission')} :</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {merchant.commissionOffer}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectMerchant) onSelectMerchant(merchant);
                        onNavigateToAffiliate();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('market.viewDetails')}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={onNavigateToAffiliate}
              className="px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md shadow-blue-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{isAr ? 'عرض جميع العروض والانضمام كمسوق' : 'Explorer toutes les offres disponibles'}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: INTERACTIVE SIMULATOR (ROI EN DIRHAMS) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {isAr ? 'محاكي نمو المبيعات بالدرهم المغربي' : 'Simulateur de Croissance Chiffre d’Affaires MAD'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {isAr ? 'قدّر أرباحك ومبيعاتك الإضافية عبر شبكة المسوقين' : 'Estimez votre chiffre d’affaires additionnel avec RoketLead'}
              </h3>
              <p className="text-slate-400 text-sm mb-10">
                {isAr ? 'حرّك المؤشرات لمعرفة الحجم الشهري المتوقع بالدرهم المغربي.' : 'Ajustez les curseurs ci-dessous pour simuler votre volume mensuel en Dirhams (MAD).'}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Sliders */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Slider 1: Affiliates */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300">
                        {isAr ? 'عدد المسوقين والمؤثرين النشطين' : 'Promoteurs & Créateurs actifs'}
                      </label>
                      <span className="text-lg font-bold text-blue-400">
                        {affiliateCount} {isAr ? 'مسوق' : 'créateurs'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      step="5"
                      value={affiliateCount}
                      onChange={(e) => setAffiliateCount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Slider 2: Average Order Value (AOV) in MAD */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300">
                        {isAr ? 'متوسط قيمة السلة (AOV)' : 'Panier Moyen (AOV)'}
                      </label>
                      <span className="text-lg font-bold text-emerald-400">
                        {avgOrderValueMAD.toLocaleString()} {isAr ? 'د.م' : 'MAD'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="2000"
                      step="50"
                      value={avgOrderValueMAD}
                      onChange={(e) => setAvgOrderValueMAD(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Slider 3: Sales per promoter / month */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-300">
                        {isAr ? 'متوسط المبيعات المحققة لكل مسوق / شهر' : 'Ventes générées par promoteur / mois'}
                      </label>
                      <span className="text-lg font-bold text-purple-400">
                        {salesPerAffiliateMonth} {isAr ? 'مبيعة' : 'ventes'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      step="5"
                      value={salesPerAffiliateMonth}
                      onChange={(e) => setSalesPerAffiliateMonth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                </div>

                {/* Calculation Output Card */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-7 border border-white/20 text-center">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    {isAr ? 'إجمالي مبيعات الإحالة الشهرية المتوقعة' : 'Volume Mensuel Affiliation Estimé (GMV)'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                    {estimatedMonthlyVolumeMAD.toLocaleString()} <span className="text-sm font-bold text-blue-300">{isAr ? 'د.م' : 'MAD'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">
                    {isAr ? `توليد حوالي ${estimatedMonthlyOrders.toLocaleString()} مبيعة جديدة شهرياً عبر قناة التسويق بالعمولة.` : `Générant environ ${estimatedMonthlyOrders.toLocaleString()} nouvelles ventes d’affiliation par mois.`}
                  </p>

                  <div className="bg-black/30 rounded-xl p-4 space-y-2 text-left text-xs mb-6 border border-white/5" dir="ltr">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commissions Affiliés (12%):</span>
                      <span className="font-bold text-slate-200">{estimatedAffiliatePayoutMAD.toLocaleString()} MAD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                      <span className="text-blue-300">Chiffre d’Affaires Net Marque:</span>
                      <span className="text-white text-sm">{estimatedNetNewRevenueMAD.toLocaleString()} MAD</span>
                    </div>
                  </div>

                  <button
                    onClick={onNavigateToMerchant || onNavigateToAffiliate}
                    className="w-full py-3 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {isAr ? 'إطلاق برنامجك الآن' : 'Lancer le Programme Vendeur'}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: CONTACT NOUS / CONTACT US (Natural public anchor) */}
      {/* ========================================================================= */}
      <section id="section-contact" className="py-20 bg-white border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('contact.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Details & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4">
                <h4 className="text-base font-bold text-slate-950 mb-2">
                  {isAr ? 'قنوات التواصل المباشر' : 'Nos Coordonnées Directes'}
                </h4>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-slate-900 block">{t('contact.whatsappDirect')}</strong>
                    <a href="https://wa.me/212661984210" target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-600 hover:underline">
                      +212 6 61 98 42 10
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-slate-900 block">{isAr ? 'البريد الإلكتروني الرسمي' : 'Email Support & Partenariats'}</strong>
                    <a href="mailto:contact@roketlead.ma" className="text-sm font-semibold text-blue-600 hover:underline">
                      contact@roketlead.ma
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs text-slate-900 block">{isAr ? 'المقر الرئيسي بالمغرب' : 'Siège Social'}</strong>
                    <p className="text-xs text-slate-600">
                      {t('contact.office')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Office hours box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100">
                <h5 className="text-xs font-bold text-slate-900 mb-1">{isAr ? 'ساعات العمل والمواكبة' : 'Horaires du Support'}</h5>
                <p className="text-xs text-slate-600">
                  {isAr ? 'من الإثنين إلى الجمعة : 09:00 - 18:30 (توقيت المغرب GMT+1)' : 'Du Lundi au Vendredi : 09h00 - 18h30 (Heure de Casablanca)'}
                </p>
              </div>
            </div>

            {/* Interactive Functional Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-slate-950">{isAr ? 'تم استلام رسالتك بنجاح!' : 'Demande Reçue avec Succès !'}</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {t('contact.success')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={isAr ? 'يوسف العلمي' : 'Youssef El Alami'}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="youssef@brand.ma"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.phone')}
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+212 6 XX XX XX XX"
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.type')}
                      </label>
                      <select
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value as any)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      >
                        <option value="seller">{t('contact.typeSeller')}</option>
                        <option value="promoter">{t('contact.typePromoter')}</option>
                        <option value="other">{t('contact.typeOther')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={isAr ? 'أخبرنا عن متجرك الإلكتروني أو عدد متابعيك...' : 'Détaillez votre projet e-commerce ou votre profil créateur...'}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('contact.submit')}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="pt-16 pb-12 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            
            {/* Big bold typography roketlead. */}
            <div className="max-w-sm">
              <div className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-950 mb-3">
                roketlead<span className="text-blue-600">.</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {isAr 
                  ? 'المنصة الرائدة لتسويق الإحالة والتسويق بالعمولة في المغرب، لمساعدة البائعين على مضاعفة مبيعاتهم ومساعدة صناع المحتوى على كسب أعلى العمولات.'
                  : 'La plateforme de référence pour le marketing d’affiliation au Maroc, conçue pour accélérer les ventes des boutiques et maximiser les commissions des créateurs.'}
              </p>
              <div className="text-xs text-slate-400">
                Casablanca Marina Business Tower • Rabat Agdal
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div>
                <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                  {isAr ? 'المنصة' : 'Plateforme'}
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li><button onClick={onNavigateToMerchant} className="hover:text-blue-600 cursor-pointer">{t('nav.forSellers')}</button></li>
                  <li><button onClick={onNavigateToAffiliate} className="hover:text-blue-600 cursor-pointer">{t('nav.forPromoters')}</button></li>
                  <li><a href="#section-about" className="hover:text-blue-600">{t('nav.whoWeAre')}</a></li>
                  <li><a href="#section-how-it-works" className="hover:text-blue-600">{t('nav.howItWorks')}</a></li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                  {isAr ? 'التكامل والربط' : 'Intégrations'}
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li><span>YouCan.shop App</span></li>
                  <li><span>Shopify Plugin</span></li>
                  <li><span>WooCommerce Plugin</span></li>
                  <li><span>RoketLead JS Pixel & API</span></li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                  {isAr ? 'الدعم الفني' : 'Support & Admin'}
                </div>
                <ul className="space-y-2 text-slate-600">
                  <li><a href="#section-contact" className="hover:text-blue-600">{t('nav.contact')}</a></li>
                  <li><a href="https://wa.me/212661984210" target="_blank" rel="noreferrer" className="hover:text-emerald-600">WhatsApp Support</a></li>
                  <li className="pt-2 border-t border-slate-100">
                    <button 
                      id="footer-admin-login-link"
                      onClick={onNavigateToAdmin} 
                      className="text-slate-400 hover:text-purple-700 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span>/admin/login</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 RoketLead Maroc. {t('footer.rights')}
            </div>
            <div className="flex gap-6">
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.terms')}</span>
              <span className="hover:text-slate-800 cursor-pointer">{t('footer.security')}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
