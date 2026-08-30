import React, { useState } from 'react';
import { 
  TrendingUp, 
  MousePointerClick, 
  ShoppingBag, 
  Percent, 
  Clock, 
  Wallet, 
  Link2, 
  Tag, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  Building2, 
  Send, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Smartphone, 
  ArrowUpRight,
  Filter,
  History,
  QrCode,
  Share2,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import confetti from 'canvas-confetti';
import { 
  MerchantProfile, 
  AffiliateLink, 
  PromoCode, 
  Conversion, 
  PayoutRequest, 
  AffiliateProfile 
} from '../types';
import { 
  INITIAL_AFFILIATE_PROFILE, 
  INITIAL_MERCHANTS, 
  INITIAL_AFFILIATE_LINKS, 
  INITIAL_PROMO_CODES, 
  INITIAL_CONVERSIONS, 
  INITIAL_PAYOUT_REQUESTS, 
  MOROCCAN_BANKS 
} from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const PERFORMANCE_CHART_DATA = [
  { date: '24 Août', clicks: 120, conversions: 8, earningsMAD: 780 },
  { date: '25 Août', clicks: 190, conversions: 14, earningsMAD: 1240 },
  { date: '26 Août', clicks: 240, conversions: 19, earningsMAD: 1680 },
  { date: '27 Août', clicks: 310, conversions: 24, earningsMAD: 2190 },
  { date: '28 Août', clicks: 420, conversions: 32, earningsMAD: 2950 },
  { date: '29 Août', clicks: 380, conversions: 28, earningsMAD: 2420 },
  { date: '30 Août', clicks: 490, conversions: 39, earningsMAD: 3590 },
];

export const AffiliateDashboard: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [profile, setProfile] = useState<AffiliateProfile>(INITIAL_AFFILIATE_PROFILE);
  const [merchants] = useState<MerchantProfile[]>(INITIAL_MERCHANTS.filter(m => m.status === 'ACTIVE'));
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(INITIAL_AFFILIATE_LINKS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [conversions, setConversions] = useState<Conversion[]>(INITIAL_CONVERSIONS);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUT_REQUESTS);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'links' | 'codes' | 'payouts'>('overview');
  const [searchOffer, setSearchOffer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isCreateCodeModalOpen, setIsCreateCodeModalOpen] = useState(false);
  const [selectedMerchantForLink, setSelectedMerchantForLink] = useState<MerchantProfile | null>(null);

  // Link Generation Form State
  const [selectedChannel, setSelectedChannel] = useState<'Instagram' | 'TikTok' | 'WhatsApp' | 'YouTube' | 'Facebook' | 'General'>('Instagram');
  const [customSlug, setCustomSlug] = useState('');
  
  // Promo Code Form State
  const [customPromoCodeText, setCustomPromoCodeText] = useState('');
  const [selectedMerchantForCode, setSelectedMerchantForCode] = useState<string>(merchants[0]?.id || '');

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState<number>(profile.walletBalanceMAD);
  const [selectedBank, setSelectedBank] = useState<string>(profile.bankName);
  const [bankRib, setBankRib] = useState<string>(profile.bankRib);
  const [accountHolder, setAccountHolder] = useState<string>(profile.accountHolderName);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState('');

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculations
  const totalClicks = affiliateLinks.reduce((sum, l) => sum + l.clicksCount, 0);
  const totalConversionsCount = conversions.filter(c => c.status === 'DELIVERED').length;
  const conversionRate = totalClicks > 0 ? ((totalConversionsCount / totalClicks) * 100).toFixed(1) : '3.8';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Trigger Payout Request
  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount < 300) {
      alert(isAr ? 'الحد الأدنى لطلب السحب هو 300 درهم مغربي.' : 'Le montant minimum de retrait est de 300 MAD.');
      return;
    }
    if (payoutAmount > profile.walletBalanceMAD) {
      alert(isAr ? 'المبلغ المطلوب يتجاوز رصيد محفظتك المتاح.' : 'Le montant demandé dépasse votre solde disponible.');
      return;
    }

    const newPayout: PayoutRequest = {
      id: `pay-${Date.now()}`,
      affiliateId: profile.id,
      affiliateName: profile.fullName,
      amountMAD: payoutAmount,
      bankName: selectedBank,
      bankRib: bankRib,
      status: 'PENDING',
      requestedAt: isAr ? 'الآن' : 'À l’instant',
    };

    setPayouts(prev => [newPayout, ...prev]);
    setProfile(prev => ({
      ...prev,
      walletBalanceMAD: prev.walletBalanceMAD - payoutAmount,
    }));

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    setPayoutSuccessMessage(isAr 
      ? `تم تقديم طلب سحب بقيمة ${payoutAmount.toLocaleString()} د.م بنجاح إلى حسابك في ${selectedBank}!` 
      : `Demande de virement de ${payoutAmount.toLocaleString()} MAD transmise avec succès vers ${selectedBank} !`
    );

    setTimeout(() => {
      setIsPayoutModalOpen(false);
      setPayoutSuccessMessage('');
    }, 2500);
  };

  // Generate New Tracking Link
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchantForLink) return;

    const slug = customSlug.trim() || `${profile.fullName.split(' ')[0].toLowerCase()}-${selectedMerchantForLink.slug.slice(0, 5)}`;
    const newLink: AffiliateLink = {
      id: `link-${Date.now()}`,
      affiliateId: profile.id,
      campaignId: selectedMerchantForLink.id,
      merchantName: selectedMerchantForLink.companyName,
      originalUrl: selectedMerchantForLink.website,
      shortCode: `rkt.ma/${slug}`,
      trackingUrl: `https://roketlead.ma/r/${slug}?utm_source=${selectedChannel.toLowerCase()}&utm_medium=affiliate`,
      channel: selectedChannel,
      clicksCount: 0,
      conversionsCount: 0,
      createdAt: isAr ? 'الآن' : 'À l’instant',
    };

    setAffiliateLinks(prev => [newLink, ...prev]);
    setIsCreateLinkModalOpen(false);
    setCustomSlug('');
    
    confetti({ particleCount: 50, spread: 50 });
  };

  // Create Custom Promo Code
  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const merchant = merchants.find(m => m.id === selectedMerchantForCode);
    if (!merchant) return;

    const code = customPromoCodeText.toUpperCase().replace(/\s+/g, '') || `CODE_${Math.floor(1000 + Math.random() * 9000)}`;
    const newCode: PromoCode = {
      id: `code-${Date.now()}`,
      affiliateId: profile.id,
      campaignId: merchant.id,
      merchantName: merchant.companyName,
      code: code,
      discountPercentage: 10,
      affiliateCommissionRate: merchant.commissionValue,
      usesCount: 0,
      totalVolumeMAD: 0,
      status: 'ACTIVE',
      createdAt: isAr ? 'الآن' : 'À l’instant',
    };

    setPromoCodes(prev => [newCode, ...prev]);
    setIsCreateCodeModalOpen(false);
    setCustomPromoCodeText('');
    confetti({ particleCount: 50, spread: 50 });
  };

  const filteredOffers = merchants.filter(m => {
    const matchesSearch = m.companyName.toLowerCase().includes(searchOffer.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchOffer.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* Top Header & Moroccan Promoter Profile Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Promoter Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                AB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-950">{profile.fullName}</h1>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full">
                    {profile.tier}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>{profile.instagramHandle}</span>
                  <span>•</span>
                  <span>{profile.bankName} (RIB: ...{profile.bankRib.slice(-6)})</span>
                </div>
              </div>
            </div>

            {/* Wallet & Payout Action */}
            <div className="flex items-center gap-4">
              <div className={`text-right hidden sm:block ${isRTL ? 'text-left' : 'text-right'}`}>
                <span className="text-xs text-slate-500 font-medium block">
                  {isAr ? 'الرصيد القابل للسحب' : 'Solde Disponible'}
                </span>
                <span className="text-xl font-extrabold text-slate-950">
                  {profile.walletBalanceMAD.toLocaleString()} <span className="text-xs text-blue-600 font-bold">{isAr ? 'د.م' : 'MAD'}</span>
                </span>
              </div>

              <button
                id="request-payout-btn"
                onClick={() => setIsPayoutModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Wallet className="w-4 h-4" />
                <span>{isAr ? 'طلب تحويل بنكي (RIB)' : 'Demander Virement RIB'}</span>
              </button>
            </div>

          </div>

          {/* Navigation Bar inside Promoter Portal */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-slate-100 pt-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'مؤشرات الأداء والأرباح' : 'Performance & Revenus'}
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'marketplace' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{isAr ? 'سوق عروض المتاجر' : 'Marketplace des Offres'}</span>
              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full">
                {merchants.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'links' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAr ? `روابط التتبع (${affiliateLinks.length})` : `Mes Liens Trackés (${affiliateLinks.length})`}
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'codes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAr ? `أكواد الخصم (${promoCodes.length})` : `Mes Codes Promo (${promoCodes.length})`}
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'payouts' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isAr ? 'سجل السحوبات البنكية' : 'Historique des Virements'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: PERFORMANCE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 5 KPI Cards for Affiliate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Metric 1: Total Clicks */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'إجمالي النقرات' : 'Total Clics'}
                  </span>
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-950 mb-1">
                  {totalClicks.toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% {isAr ? 'هذا الأسبوع' : 'cette semaine'}</span>
                </div>
              </div>

              {/* Metric 2: Delivered Conversions */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'طلبات مستلمة (COD)' : 'Commandes Livrées'}
                  </span>
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-950 mb-1">
                  {conversions.length} <span className="text-xs font-medium text-slate-400">{isAr ? 'طلب' : 'commandes'}</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span>92% {isAr ? 'توصيل عبر أمانة وكاثيديس' : 'taux livraison COD'}</span>
                </div>
              </div>

              {/* Metric 3: Conversion Rate */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'معدل التحويل' : 'Taux de Conversion'}
                  </span>
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-950 mb-1">
                  {conversionRate}%
                </div>
                <div className="text-[11px] font-semibold text-purple-600">
                  {isAr ? 'أعلى 5% بين المؤثرين المغاربة' : 'Top 5% créateurs Maroc'}
                </div>
              </div>

              {/* Metric 4: Pending Commission (MAD) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {isAr ? 'عمولات معلقة COD' : 'Commissions en Attente'}
                  </span>
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-950 mb-1">
                  {profile.pendingCommissionMAD.toLocaleString()} <span className="text-xs font-bold text-slate-500">{isAr ? 'د.م' : 'MAD'}</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-600">
                  {isAr ? 'تتحرر فور تسليم الطرد' : 'Débloqué dès livraison client'}
                </div>
              </div>

              {/* Metric 5: Available Wallet Balance (MAD) */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    {isAr ? 'رصيد المحفظة المتاح' : 'Solde Retirable'}
                  </span>
                  <div className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mb-1">
                  {profile.walletBalanceMAD.toLocaleString()} <span className="text-xs font-bold text-blue-300">{isAr ? 'د.م' : 'MAD'}</span>
                </div>
                <button
                  onClick={() => setIsPayoutModalOpen(true)}
                  className="mt-2 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {isAr ? 'سحب فوري إلى الـ RIB' : 'Retirer vers RIB'}
                </button>
              </div>

            </div>

            {/* Earnings Chart & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Earnings Recharts Visualizer */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-slate-950 text-base">
                      {isAr ? 'تطور العمولات المحققة (بالدرهم المغربي)' : 'Évolution des Gains (MAD)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isAr ? 'تتبع يومي للطلبات المسلمة عبر روابطك' : 'Gains quotidiens validés sur livraisons COD'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200/60">
                    +32% {isAr ? 'نمو' : 'croissance'}
                  </span>
                </div>

                <div className="h-64 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip 
                        formatter={(val: number) => [`${val} MAD`, isAr ? 'الأرباح' : 'Gains']}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="earningsMAD" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Tracking Links Quick Access */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-950 text-base">
                      {isAr ? 'روابط التتبع الأكثر ربحية' : 'Mes Liens Performants'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('links')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      {isAr ? 'عرض الكل' : 'Voir tout'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {affiliateLinks.slice(0, 3).map((link) => (
                      <div key={link.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-slate-900">{link.merchantName}</strong>
                          <span className="text-slate-500 font-medium">{link.channel}</span>
                        </div>
                        <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                          <span className="font-mono text-xs text-blue-600 font-bold">{link.shortCode}</span>
                          <button
                            onClick={() => copyToClipboard(`https://${link.shortCode}`, link.id)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === link.id ? (isAr ? 'تم!' : 'Copié') : (isAr ? 'نسخ' : 'Copier')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMerchantForLink(merchants[0]);
                    setIsCreateLinkModalOpen(true);
                  }}
                  className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إنشاء رابط جديد' : 'Créer un Lien Tracké'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MARKETPLACE OF BRANDS */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {isAr ? 'سوق المتاجر والعلامات التجارية المغربية' : 'Marketplace des Marques & Campagnes'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? 'اختر عروض المتاجر المعتمدة وابدأ الترويج لتحقيق عمولات على كل طلب مسلم.'
                    : 'Rejoignez des programmes vérifiés et recevez vos commissions sur chaque commande livrée.'}
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  placeholder={isAr ? 'بحث عن علامة تجارية...' : 'Recherche par marque...'}
                  value={searchOffer}
                  onChange={(e) => setSearchOffer(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredOffers.map((merchant) => (
                <div key={merchant.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                        {merchant.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950 text-base">{merchant.companyName}</h4>
                        <span className="text-xs text-slate-500">{merchant.category} • {merchant.city}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {merchant.description}
                    </p>

                    <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs mb-4">
                      <div className="flex justify-between font-bold text-blue-900">
                        <span>{isAr ? 'عرض العمولة:' : 'Commission :'}</span>
                        <span>{merchant.commissionOffer}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-blue-700 mt-1">
                        <span>{isAr ? 'مدة الكوكي:' : 'Attribution Cookie :'}</span>
                        <span>{merchant.cookieDurationDays} {isAr ? 'يوم' : 'Jours'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMerchantForLink(merchant);
                        setIsCreateLinkModalOpen(true);
                      }}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'توليد رابط' : 'Créer Lien'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMerchantForCode(merchant.id);
                        setIsCreateCodeModalOpen(true);
                      }}
                      className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title={isAr ? 'كود خصم مخصص' : 'Code Promo'}
                    >
                      <Tag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MY TRACKING LINKS */}
        {activeTab === 'links' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {isAr ? 'روابط التتبع الذكية الخاصة بك' : 'Mes Liens d’Affiliation Trackés'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? 'شارك هذه الروابط في Bio انستغرام، تيك توك، ستوريات أو رسائل واتساب.' 
                    : 'Partagez ces liens raccourcis sur vos réseaux sociaux (Instagram, TikTok, WhatsApp).'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedMerchantForLink(merchants[0]);
                  setIsCreateLinkModalOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء رابط جديد' : 'Nouveau Lien'}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {affiliateLinks.map((link) => (
                <div key={link.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-sm font-bold text-slate-950">{link.merchantName}</strong>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {link.channel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        https://{link.shortCode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`https://${link.shortCode}`, link.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === link.id ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ' : 'Copier')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600">
                    <div className="text-center">
                      <div className="font-extrabold text-slate-900 text-base">{link.clicksCount}</div>
                      <div className="text-[10px] text-slate-400">{isAr ? 'نقرة' : 'Clics'}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-extrabold text-emerald-600 text-base">{link.conversionsCount}</div>
                      <div className="text-[10px] text-slate-400">{isAr ? 'مبيعة' : 'Ventes'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROMO CODES */}
        {activeTab === 'codes' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {isAr ? 'أكواد الخصم الحصرية للستوريات' : 'Mes Codes Promo Exclusifs'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? 'مثالية لستوريات انستغرام وتيك توك: يحصل متابعوك على تخفيض 10% وتحصل أنت على عمولتك.' 
                    : 'Idéal pour vos Stories et Reels : 10% de réduction pour vos abonnés avec commission automatique.'}
                </p>
              </div>

              <button
                onClick={() => setIsCreateCodeModalOpen(true)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'طلب كود خصم جديد' : 'Nouveau Code Promo'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promoCodes.map((code) => (
                <div key={code.id} className="p-5 bg-gradient-to-br from-purple-50/50 to-slate-50 rounded-2xl border border-purple-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">{code.merchantName}</span>
                    <div className="flex items-center gap-2 my-1">
                      <span className="font-mono text-lg font-black text-purple-700 tracking-wider">
                        {code.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(code.code, code.id)}
                        className="p-1.5 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 cursor-pointer"
                        title={isAr ? 'نسخ الكود' : 'Copier'}
                      >
                        {copiedId === code.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-xs text-slate-600">
                      {isAr ? 'خصم 10% للزبون' : '10% de réduction client'} • {isAr ? `عمولتك: ${code.affiliateCommissionRate}%` : `Votre commission : ${code.affiliateCommissionRate}%`}
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-black text-slate-900 text-base">{code.usesCount}</div>
                    <div className="text-[10px] text-slate-400">{isAr ? 'استخدام' : 'Utilisations'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: RIB PAYOUTS & BANK HISTORY */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {isAr ? 'سجل السحوبات والتحويلات البنكية (RIB)' : 'Historique des Virements Bancaires RIB'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr 
                    ? 'تحويلات بنكية مباشرة إلى حسابات CIH، التجاري وفا بنك، البنك الشعبي، أو بنك أفريقيا.' 
                    : 'Virements bancaires nationaux sécurisés vers CIH, Attijariwafa, Banque Populaire.'}
                </p>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>{isAr ? 'طلب سحب جديد' : 'Nouveau Retrait'}</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-[11px] border-b border-slate-100">
                  <tr>
                    <th className="p-4">{isAr ? 'رقم التحويل' : 'Réf Virement'}</th>
                    <th className="p-4">{isAr ? 'المبلغ بالدرهم' : 'Montant (MAD)'}</th>
                    <th className="p-4">{isAr ? 'البنك و الـ RIB' : 'Banque & RIB Maroc'}</th>
                    <th className="p-4">{isAr ? 'التاريخ' : 'Date de Demande'}</th>
                    <th className="p-4">{isAr ? 'الحالة' : 'Statut'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        #{payout.id}
                      </td>
                      <td className="p-4 font-black text-slate-950 text-sm">
                        {payout.amountMAD.toLocaleString()} {isAr ? 'د.م' : 'MAD'}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{payout.bankName}</div>
                        <div className="font-mono text-[11px] text-slate-400">RIB: {payout.bankRib}</div>
                      </td>
                      <td className="p-4 text-slate-500">
                        {payout.requestedAt}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          payout.status === 'PROCESSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {payout.status === 'PROCESSED' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تم التحويل لحسابك' : 'Virement Effectué'}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isAr ? 'قيد المعالجة' : 'En Traitement'}</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* REQUEST PAYOUT MODAL */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className={`absolute top-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold ${
                isRTL ? 'left-5' : 'right-5'
              }`}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-950 mb-1">
              {isAr ? 'طلب تحويل بنكي مغربي (RIB)' : 'Demande de Virement Bancaire Marocain'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAr ? 'سحب العمولات المحررة مباشرة إلى حسابك البنكي المغربي.' : 'Retirez vos commissions vers votre compte bancaire national en Dirhams.'}
            </p>

            {payoutSuccessMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold text-center">
                ✓ {payoutSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isAr ? 'المبلغ المطلوب سحبه (بالدرهم)' : 'Montant à retirer (MAD) *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={300}
                      max={profile.walletBalanceMAD}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-base text-slate-900 focus:bg-white focus:outline-none"
                      required
                    />
                    <span className={`absolute top-1/2 -translate-y-1/2 font-bold text-slate-400 ${isRTL ? 'left-3' : 'right-3'}`}>
                      {isAr ? 'د.م' : 'MAD'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {isAr ? `الرصيد المتاح: ${profile.walletBalanceMAD.toLocaleString()} د.م (الحد الأدنى 300 د.م)` : `Solde disponible : ${profile.walletBalanceMAD.toLocaleString()} MAD (Minimum 300 MAD)`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isAr ? 'البنك المغربي' : 'Banque Marocaine'}
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-900 focus:bg-white focus:outline-none"
                    >
                      {MOROCCAN_BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isAr ? 'اسم صاحب الحساب' : 'Nom du Titulaire'}
                    </label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isAr ? 'رقم الـ RIB المكون من 24 رقماً' : 'Relevé d’Identité Bancaire (24 chiffres)'}
                  </label>
                  <input
                    type="text"
                    maxLength={24}
                    value={bankRib}
                    onChange={(e) => setBankRib(e.target.value.replace(/\s+/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold text-xs text-slate-900 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                  {isAr 
                    ? '• تتم معالجة التحويلات البنكية خلال 24 إلى 48 ساعة عمل كحد أقصى.' 
                    : '• Les virements sont traités sous 24h à 48h ouvrées vers toutes les banques du Royaume.'}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-xs"
                >
                  {isAr ? `تأكيد وإرسال طلب سحب ${payoutAmount.toLocaleString()} د.م` : `Confirmer le Virement de ${payoutAmount.toLocaleString()} MAD`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE LINK MODAL */}
      {isCreateLinkModalOpen && selectedMerchantForLink && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedMerchantForLink.logo}</span>
                <div>
                  <h3 className="font-bold text-slate-950 text-base">
                    {isAr ? 'توليد رابط تتبع ذكي' : 'Générer un Lien de Tracking'}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedMerchantForLink.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateLinkModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isAr ? 'قناة النشر المستهدفة' : 'Canal de Publication'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Instagram', 'TikTok', 'WhatsApp', 'YouTube', 'Facebook', 'General'].map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setSelectedChannel(ch as any)}
                      className={`p-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        selectedChannel === ch 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isAr ? 'الاسم المختصر للرابط (اختياري)' : 'Identifiant court personnalisé'}
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" dir="ltr">
                  <span className="text-slate-400">rkt.ma/</span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="amine-deal"
                    className="flex-1 bg-transparent text-slate-900 font-bold focus:outline-none ml-1"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
                <strong>{isAr ? 'العرض:' : 'Offre :'} {selectedMerchantForLink.commissionOffer}</strong>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  {isAr ? 'تتبع آلي لمدة 30 يوماً مع تأكيد تسليم COD.' : 'Inclut la fenêtre d’attribution de 30 jours et la réconciliation Amana.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer text-xs"
              >
                {isAr ? 'إنشاء وتفعيل الرابط' : 'Créer le Lien Tracké'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROMO CODE MODAL */}
      {isCreateCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 text-base">
                    {isAr ? 'إنشاء كود خصم مخصص' : 'Créer un Code Promo Personnalisé'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'تتبع الطلبات بدون روابط (ستوريات / ريلز)' : 'Idéal pour vos Stories sans lien cliquable'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateCodeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromoCode} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isAr ? 'اختر المتجر أو العلامة التجارية' : 'Marque Partenaire'}
                </label>
                <select
                  value={selectedMerchantForCode}
                  onChange={(e) => setSelectedMerchantForCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none"
                >
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>{m.companyName} ({m.commissionOffer})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isAr ? 'اسم الكود المرغوب' : 'Code Souhaité'}
                </label>
                <input
                  type="text"
                  value={customPromoCodeText}
                  onChange={(e) => setCustomPromoCodeText(e.target.value.toUpperCase())}
                  placeholder="SARAH10"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-base text-purple-700 uppercase focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-200">
                <strong>{isAr ? 'خصم 10% للزبون في المغرب' : '10% de Réduction Client'}</strong>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  {isAr 
                    ? 'يحصل الزبون على تخفيض 10% عند إتمام الطلب، ويتم تسجيل العمولة بالكامل في حسابك.' 
                    : 'Vos abonnés bénéficient de 10% de remise, vous touchez votre commission complète sur chaque commande livrée.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer text-xs"
              >
                {isAr ? 'تأكيد وحفظ الكود' : 'Valider le Code Promo'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
