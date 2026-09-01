import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Truck, 
  Key, 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Edit3, 
  Search, 
  Filter, 
  Tag, 
  ShieldCheck, 
  Download, 
  Play, 
  RefreshCw, 
  Globe, 
  FileCode2, 
  Layers, 
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles,
  Zap,
  RotateCcw,
  Database,
  CheckCircle
} from 'lucide-react';
import { 
  MerchantProfile, 
  Campaign, 
  Conversion, 
  PromoCode, 
  TrackingStatus, 
  CommissionType 
} from '../types';
import { 
  INITIAL_MERCHANTS, 
  INITIAL_CONVERSIONS, 
  INITIAL_PROMO_CODES 
} from '../data/mockData';
import { TRACKER_JS_CODE } from '../integrations/trackerSource';
import { WOOCOMMERCE_PLUGIN_CODE } from '../integrations/woocommercePluginSource';
import { WEBHOOK_HANDLER_TS_CODE } from '../integrations/webhookHandlerSource';
import { PrismaSchemaViewer } from './PrismaSchemaViewer';
import { useLanguage } from '../context/LanguageContext';
import { StoreLogo } from './StoreLogo';

interface MerchantDashboardProps {
  onSwitchToAffiliateView?: () => void;
  onSwitchToAdminView?: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  onSwitchToAffiliateView,
  onSwitchToAdminView
}) => {
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';

  // Store Selection
  const [merchants, setMerchants] = useState<MerchantProfile[]>(INITIAL_MERCHANTS);
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('merch-01');

  // Active Tab: overview | orders | campaigns | api-setup | code-suite | prisma-schema
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'campaigns' | 'api-setup' | 'code-suite' | 'prisma-schema'>('overview');

  // Orders State
  const [conversions, setConversions] = useState<Conversion[]>(INITIAL_CONVERSIONS);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);

  // Code Suite Sub-Tab
  const [codeTab, setCodeTab] = useState<'tracker' | 'woocommerce' | 'webhook'>('tracker');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  // Campaign Modal State
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [commissionType, setCommissionType] = useState<CommissionType>('PERCENTAGE');
  const [commissionVal, setCommissionVal] = useState(15);
  const [cookieDays, setCookieDays] = useState(30);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [assignedPromoter, setAssignedPromoter] = useState('Sarah El Amrani');

  // Webhook Simulator State
  const [simulatedStatus, setSimulatedStatus] = useState<'DELIVERED' | 'CANCELLED' | 'RETURNED'>('DELIVERED');
  const [simulatedOrderNum, setSimulatedOrderNum] = useState('MA-98244');
  const [simulatedCourier, setSimulatedCourier] = useState('Amana Express');
  const [simulationResponse, setSimulationResponse] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Current selected merchant
  const currentMerchant = useMemo(() => {
    return merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  }, [merchants, selectedMerchantId]);

  // Merchant specific conversions
  const merchantConversions = useMemo(() => {
    return conversions.filter(c => c.merchantId === currentMerchant.id);
  }, [conversions, currentMerchant.id]);

  // Calculations for Key Metrics
  const grossAffiliateSales = useMemo(() => {
    return merchantConversions.reduce((sum, c) => sum + c.orderAmountMAD, 0);
  }, [merchantConversions]);

  const totalCommissionsOwed = useMemo(() => {
    return merchantConversions
      .filter(c => c.status === 'DELIVERED' || c.status === 'PENDING')
      .reduce((sum, c) => sum + c.commissionMAD, 0);
  }, [merchantConversions]);

  const pendingVerificationCount = useMemo(() => {
    return merchantConversions.filter(c => c.status === 'PENDING' || c.status === 'CONFIRMED').length;
  }, [merchantConversions]);

  const deliveredCount = useMemo(() => {
    return merchantConversions.filter(c => c.status === 'DELIVERED').length;
  }, [merchantConversions]);

  const deliveryRatePercent = useMemo(() => {
    if (merchantConversions.length === 0) return 92;
    const resolved = merchantConversions.filter(c => ['DELIVERED', 'CANCELLED', 'RETURNED'].includes(c.status));
    if (resolved.length === 0) return 90;
    return Math.round((deliveredCount / resolved.length) * 100);
  }, [merchantConversions, deliveredCount]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return merchantConversions.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.customerCity.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.affiliateName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (order.promoCode && order.promoCode.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [merchantConversions, orderSearchQuery, statusFilter]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Download helper for scripts
  const handleDownloadFile = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setActionSuccessToast(msg);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  // Manual Status Change Handler
  const handleUpdateOrderStatus = (orderId: string, newStatus: TrackingStatus) => {
    setConversions(prev => prev.map(conv => {
      if (conv.id === orderId) {
        return {
          ...conv,
          status: newStatus,
          deliveredAt: newStatus === 'DELIVERED' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : conv.deliveredAt
        };
      }
      return conv;
    }));

    const orderObj = conversions.find(c => c.id === orderId);
    if (newStatus === 'DELIVERED') {
      showToast(isAr 
        ? `تم تحديث الطلب #${orderObj?.orderNumber} كـ مُسلَّم (DELIVERED). تم إيداع عمولة ${orderObj?.commissionMAD.toFixed(2)} د.م للمسوق ${orderObj?.affiliateName}.`
        : `Commande #${orderObj?.orderNumber} marquée comme LIVRÉE. Commission de ${orderObj?.commissionMAD.toFixed(2)} MAD débloquée pour ${orderObj?.affiliateName}.`
      );
    } else if (newStatus === 'RETURNED') {
      showToast(isAr 
        ? `تم تسجيل الطلب #${orderObj?.orderNumber} كـ مرتجع COD RETURNED. تم إلغاء العمولة المعلقة.`
        : `Commande #${orderObj?.orderNumber} marquée comme RETOUR COD. Commission annulée.`
      );
    } else if (newStatus === 'CANCELLED') {
      showToast(isAr ? `تم إلغاء الطلب #${orderObj?.orderNumber}.` : `Commande #${orderObj?.orderNumber} annulée.`);
    }
  };

  // Handle Create Offer
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle) return;

    // Update merchant profile
    setMerchants(prev => prev.map(m => {
      if (m.id === currentMerchant.id) {
        return {
          ...m,
          commissionOffer: commissionType === 'PERCENTAGE' 
            ? `${commissionVal}% ${isAr ? 'لكل طلب مسلم' : 'par commande livrée'}` 
            : `${commissionVal} MAD ${isAr ? 'لكل تحويل' : 'par conversion'}`,
          commissionType: commissionType,
          commissionValue: commissionVal,
          cookieDurationDays: cookieDays
        };
      }
      return m;
    }));

    // Add Promo code if provided
    if (promoCodeInput) {
      const newPromo: PromoCode = {
        id: `code-${Date.now()}`,
        affiliateId: 'aff-001',
        campaignId: currentMerchant.id,
        merchantName: currentMerchant.companyName,
        code: promoCodeInput.toUpperCase(),
        discountPercentage: 10,
        affiliateCommissionRate: commissionVal,
        usesCount: 0,
        totalVolumeMAD: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPromoCodes(prev => [newPromo, ...prev]);
    }

    setIsCampaignModalOpen(false);
    showToast(isAr 
      ? `تم حفظ ونشر العرض "${campaignTitle}" بنجاح للمسوقين المغاربة!` 
      : `L'offre de campagne "${campaignTitle}" a été enregistrée et publiée avec succès !`
    );
    setCampaignTitle('');
    setPromoCodeInput('');
  };

  // Run Webhook Simulation
  const handleRunWebhookSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const targetConv = conversions.find(c => c.orderNumber === simulatedOrderNum || c.merchantId === currentMerchant.id);
      
      if (targetConv) {
        handleUpdateOrderStatus(targetConv.id, simulatedStatus as TrackingStatus);
      }

      setSimulationResponse({
        success: true,
        event: 'order.delivery_status_updated',
        processedAt: new Date().toISOString(),
        orderNumber: simulatedOrderNum,
        courier: simulatedCourier,
        newStatus: simulatedStatus,
        commissionSettledMAD: simulatedStatus === 'DELIVERED' ? (targetConv ? targetConv.commissionMAD : 67.50) : 0,
        httpStatus: 200,
        signatureVerified: true,
        message: simulatedStatus === 'DELIVERED' 
          ? `Webhook processed successfully: Order #${simulatedOrderNum} marked as DELIVERED via ${simulatedCourier}. Funds credited in MAD.`
          : `Webhook processed successfully: Status ${simulatedStatus} recorded for #${simulatedOrderNum}.`
      });
    }, 800);
  };

  const getStatusBadge = (status: TrackingStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isAr ? 'مُسلَّم (مدفوع)' : 'Livré (Payé)'}
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            {isAr ? 'في طور التوصيل' : 'En transit'}
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {isAr ? 'قيد التحقق' : 'En attente COD'}
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Check className="w-3.5 h-3.5" />
            {isAr ? 'مؤكد من الزبون' : 'Confirmé Client'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            {isAr ? 'ملغى' : 'Annulé'}
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <RotateCcw className="w-3.5 h-3.5" />
            {isAr ? 'مرتجع COD' : 'Retour COD'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium">{actionSuccessToast}</p>
        </div>
      )}

      {/* Header with Store Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <StoreLogo
            logo={currentMerchant.logo}
            name={currentMerchant.companyName}
            category={currentMerchant.category}
            size="xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                {currentMerchant.companyName}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-md">
                {currentMerchant.city}, {isAr ? 'المغرب' : 'Maroc'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span>{isAr ? 'المنصة:' : 'Plateforme :'} <strong className="text-slate-800">{currentMerchant.platformType}</strong></span>
              <span>•</span>
              <a 
                href={currentMerchant.website} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {currentMerchant.website} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        {/* Store Switcher Dropdown & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              id="merchant-selector"
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-10 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {merchants.map(m => (
                <option key={m.id} value={m.id}>
                  {m.companyName} ({m.platformType})
                </option>
              ))}
            </select>
            <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} />
          </div>

          <button
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs shadow-blue-600/30 transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إنشاء عرض / كود جديد' : 'Nouvelle Offre / Promo'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Including Prisma Schema) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isAr ? 'نظرة عامة ومؤشرات' : 'Vue d’ensemble'}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isAr ? 'الطلبات وعمولات المبيعات' : 'Commandes & Ventes Affiliés'}</span>
          {pendingVerificationCount > 0 && (
            <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              activeTab === 'orders' ? 'bg-blue-800 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingVerificationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'campaigns'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{isAr ? 'الحملات وأكواد الخصم' : 'Campagnes & Promoteurs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('api-setup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'api-setup'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>{isAr ? 'إعدادات API و Webhooks' : 'Configuration API & Webhooks'}</span>
        </button>

        <button
          onClick={() => setActiveTab('code-suite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'code-suite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-purple-400" />
          <span>{isAr ? 'أكواد الربط والتتبع' : 'Plugins & Snippets'}</span>
        </button>

        {/* PRISMA SCHEMA VIEWER TAB INSIDE SELLER ACCOUNT */}
        <button
          onClick={() => setActiveTab('prisma-schema')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'prisma-schema'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'مخطط قاعدة البيانات Prisma' : 'Schéma Base de Données Prisma'}</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & KEY METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* 4 Core Moroccan Brand KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Metric 1: Gross Sales */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'المبيعات عبر المسوقين' : 'Ventes Brutes Affiliés'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {grossAffiliateSales.toLocaleString()} <span className="text-sm font-bold text-slate-500">{isAr ? 'د.م' : 'MAD'}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.6% {isAr ? 'مقارنة بالشهر الماضي' : 'vs 30 derniers jours'}</span>
              </div>
            </div>

            {/* Metric 2: Total Commissions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'العمولات المستحقة' : 'Commissions Dues'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CoinsIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {totalCommissionsOwed.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-bold text-slate-500">{isAr ? 'د.م' : 'MAD'}</span>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                {isAr ? 'نسبة العمولة:' : 'Taux moyen :'} <strong className="text-slate-800">{currentMerchant.commissionOffer}</strong>
              </div>
            </div>

            {/* Metric 3: Active Promoters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'المسوقون النشطون' : 'Promoteurs Actifs'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {currentMerchant.activeAffiliatesCount} <span className="text-sm font-bold text-slate-500">{isAr ? 'صانع محتوى' : 'créateurs'}</span>
              </div>
              <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">{isAr ? '100% صناع محتوى مغاربة' : 'Créateurs certifiés Maroc'}</span>
                <span>•</span>
                <button onClick={() => setActiveTab('campaigns')} className="text-blue-600 hover:underline">{isAr ? 'إدارة' : 'Gérer'}</button>
              </div>
            </div>

            {/* Metric 4: Pending Verification & Confirmation Rate */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isAr ? 'طلبات قيد المراجعة' : 'Ventes en Attente'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {pendingVerificationCount} <span className="text-sm font-bold text-slate-500">{isAr ? 'طلب' : 'commandes'}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{isAr ? 'نسبة التحويل والتأكيد:' : 'Taux de Validation :'}</span>
                <strong className="text-emerald-600 font-bold">{deliveryRatePercent}%</strong>
              </div>
            </div>

          </div>

          {/* Quick Action Bento Grid for Merchant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Commission Model card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'عرض العمولة الحالي' : 'Offre d’Affiliation Active'}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{currentMerchant.companyName}</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  {currentMerchant.description}
                </p>
                <div className="bg-white/10 rounded-2xl p-4 space-y-2.5 backdrop-blur-xs text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'نسبة العمولة:' : 'Taux de Commission :'}</span>
                    <span className="font-bold text-white">{currentMerchant.commissionOffer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'مدة صلاحية الكوكي:' : 'Durée d’Attribution Cookie :'}</span>
                    <span className="font-bold text-white">{currentMerchant.cookieDurationDays} {isAr ? 'يوم' : 'Jours'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'آلية التأكيد:' : 'Attribution des Ventes :'}</span>
                    <span className="font-bold text-emerald-400">{isAr ? 'تتبع فوري عبر بيكسل RoketLead' : 'Attribution Immédiate Pixel / API'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setIsCampaignModalOpen(true)}
                  className="text-xs font-bold text-blue-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isAr ? 'تعديل الشروط' : 'Modifier les Conditions'}
                </button>
                <button
                  onClick={() => setActiveTab('api-setup')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isAr ? 'مفاتيح الربط' : 'Clés Webhook'}
                </button>
              </div>
            </div>

            {/* Recent Incoming Orders summary */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {isAr ? 'آخر المبيعات عبر المسوقين' : 'Dernières Ventes Attribuées aux Promoteurs'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isAr ? 'تتبع مباشر لكل عملية بيع جديدة تأتي عبر روابط وكوبونات المسوقين' : 'Conversions en temps réel générées par vos affiliés et créateurs de contenu'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'عرض جميع الطلبات' : 'Voir tout'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {merchantConversions.slice(0, 4).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-mono">#{order.orderNumber}</strong>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">{order.customerCity}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-blue-600 font-medium">via {order.affiliateName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {order.courierName || 'RoketLead Tracker'} ({order.trackingNumber || 'RKT-SALE'})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-slate-900">
                          {order.orderAmountMAD.toLocaleString()} <span className="text-slate-500 font-normal">{isAr ? 'د.م' : 'MAD'}</span>
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{isAr ? 'تأكيد المبيعة يحرر العمولة مباشرة في رصيد المسوق' : 'La confirmation de vente crédite automatiquement la commission au créateur.'}</span>
                <button
                  onClick={() => setActiveTab('api-setup')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {isAr ? 'اختبار Webhook محاكي' : 'Tester le simulateur Webhook'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: ORDER VERIFICATION & AFFILIATE SALES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {isAr ? 'إدارة مبيعات الإحالة والعمولات' : 'Suivi des Ventes & Commissions Affiliés'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr 
                  ? 'تتبع وتأكيد المبيعات المحققة عبر روابط وأكواد المسوقين مع التحقق من صحة المعاملات.'
                  : 'Gérez et validez les ventes générées par les liens de vos promoteurs et influenceurs.'}
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  placeholder={isAr ? 'بحث بالطلب، المدينة، المسوق...' : 'Recherche par commande, ville...'}
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className={`bg-slate-50 border border-slate-200 text-xs rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-52 sm:w-64 ${
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">{isAr ? 'جميع الحالات' : 'Tous les Statuts'}</option>
                <option value="PENDING">{isAr ? 'قيد المراجعة' : 'En attente'}</option>
                <option value="SHIPPED">{isAr ? 'مؤكدة وفي التنفيذ' : 'En cours'}</option>
                <option value="DELIVERED">{isAr ? 'مبيعة مؤكدة (مدفوعة)' : 'Validée (Payée)'}</option>
                <option value="RETURNED">{isAr ? 'مسترجعة' : 'Remboursée'}</option>
                <option value="CANCELLED">{isAr ? 'ملغاة' : 'Annulée'}</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-[11px] border-b border-slate-100">
                <tr>
                  <th className="p-4">{isAr ? 'رقم الطلب' : 'Réf Commande'}</th>
                  <th className="p-4">{isAr ? 'المسوق / الكود' : 'Promoteur / Code'}</th>
                  <th className="p-4">{isAr ? 'المدينة والزبون' : 'Ville & Client'}</th>
                  <th className="p-4">{isAr ? 'قيمة المبيعة' : 'Montant Total'}</th>
                  <th className="p-4">{isAr ? 'عمولة المسوق' : 'Commission'}</th>
                  <th className="p-4">{isAr ? 'قناة الإحالة' : 'Canal d’Attribution'}</th>
                  <th className="p-4">{isAr ? 'الحالة' : 'Statut'}</th>
                  <th className="p-4 text-right">{isAr ? 'إجراءات التأكيد' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      {isAr ? 'لا توجد طلبات مطابقة لمعايير البحث' : 'Aucune commande trouvée correspondant à vos critères.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        #{order.orderNumber}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">{order.date}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{order.affiliateName}</div>
                        {order.promoCode && (
                          <span className="inline-block px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-mono mt-0.5">
                            🏷️ {order.promoCode}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{order.customerCity}</div>
                        <div className="text-[10px] text-slate-400">{isAr ? 'دفع عند الاستلام' : 'Cash On Delivery'}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {order.orderAmountMAD.toLocaleString()} {isAr ? 'د.م' : 'MAD'}
                      </td>
                      <td className="p-4 font-bold text-blue-600">
                        {order.commissionMAD.toFixed(2)} {isAr ? 'د.م' : 'MAD'}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-medium">{order.courierName || 'Amana'}</div>
                        <div className="text-[10px] font-mono text-slate-400">{order.trackingNumber || 'MA-AMN-99482'}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                              title="Marquer comme livré et débloquer la commission"
                            >
                              {isAr ? 'تأكيد التسليم' : 'Valider Livré'}
                            </button>
                          )}
                          {order.status !== 'RETURNED' && order.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'RETURNED')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                              title="Signaler un retour COD"
                            >
                              {isAr ? 'مرتجع' : 'Retour'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: CAMPAIGNS & PROMOTERS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {isAr ? 'الحملات، العمولات وأكواد الخصم' : 'Campagnes d’Affiliation & Codes Promo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr 
                  ? 'تخصيص نسب العمولة وأكواد الخصم الحصرية للمؤثرين وصناع المحتوى بالمغرب.'
                  : 'Définissez vos offres de commission et attribuez des codes promo exclusifs aux influenceurs.'}
              </p>
            </div>

            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة كود / عرض جديد' : 'Créer une Offre'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promo Codes Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <h3 className="font-bold text-slate-950 text-base mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'أكواد الخصم النشطة للمسوقين' : 'Codes Promo Actifs par Promoteur'}</span>
              </h3>

              <div className="space-y-3">
                {promoCodes.map((code) => (
                  <div key={code.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-xs border border-blue-200/60">
                          {code.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{code.merchantName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {isAr ? 'خصم للزبون:' : 'Réduction client :'} <strong>{code.discountPercentage}%</strong> • {isAr ? 'عمولة المسوق:' : 'Commission :'} <strong className="text-emerald-600">{code.affiliateCommissionRate}%</strong>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-900">{code.usesCount} {isAr ? 'استخدام' : 'utilisations'}</div>
                      <div className="text-[11px] text-slate-500">{code.totalVolumeMAD.toLocaleString()} {isAr ? 'د.م' : 'MAD'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Rules */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'قواعد الأمان والإسناد الدقيق' : 'Règles d’Attribution & Anti-Fraude'}</span>
              </h3>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-2 text-emerald-950">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'تتبع فوري ومحكم عبر بيكسل RoketLead' : 'Attribution Précise par Pixel & Liens'}</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  {isAr 
                    ? 'يتم تتبع النقرات والمبيعات تلقائياً بنظام إسناد فوري على صفحة تأكيد الطلب، مع حماية تامة ضد التكرار أو التلاعب بالروابط.'
                    : 'Chaque vente est attribuée en temps réel via le pixel JavaScript sur la page de confirmation de commande, avec détection anti-fraude.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2 text-slate-700">
                <div className="font-bold text-slate-900">{isAr ? 'نافذة التتبع للكوكي (Cookie Window):' : 'Attribution Cookie :'}</div>
                <p className="text-slate-600">
                  {isAr 
                    ? `محددة حالياً في ${currentMerchant.cookieDurationDays} يوماً. أي عملية شراء تتم خلال هذه المدة تُحسب تلقائياً للمسوق صاحب الرابط.`
                    : `Actuellement configurée sur ${currentMerchant.cookieDurationDays} jours. Tout achat effectué durant cette période est crédité au promoteur.`}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: API & WEBHOOK SETUP */}
      {activeTab === 'api-setup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-8 animate-in fade-in duration-200">
          
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {isAr ? 'إعدادات المفاتيح و Webhooks للمتجر' : 'Clés d’Intégration & Configuration Webhook'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr 
                ? 'استخدم هذه المفاتيح لربط متجرك (YouCan, Shopify, WooCommerce) أو لاستقبال تحديثات التوصيل.'
                : 'Utilisez ces identifiants sécurisés pour connecter votre boutique et recevoir les mises à jour de livraison.'}
            </p>
          </div>

          {/* Key Credentials Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {isAr ? 'معرف المتجر (Merchant ID)' : 'Merchant ID (Public)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentMerchant.id}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-900"
                />
                <button
                  onClick={() => handleCopy(currentMerchant.id, 'merchantId')}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
                  title="Copier"
                >
                  {copiedKey === 'merchantId' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {isAr ? 'المفتاح السري للتوقيع (Secret Key)' : 'Secret Key (HMAC Webhooks)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  readOnly
                  value={currentMerchant.integrationSecretKey}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-900"
                />
                <button
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {showSecretKey ? (isAr ? 'إخفاء' : 'Masquer') : (isAr ? 'إظهار' : 'Afficher')}
                </button>
                <button
                  onClick={() => handleCopy(currentMerchant.integrationSecretKey, 'secretKey')}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
                  title="Copier"
                >
                  {copiedKey === 'secretKey' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Interactive Simulator */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Play className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isAr ? 'محاكي استقبال إشعارات التوصيل (Webhook Simulator)' : 'Simulateur d’Événements Webhook Livraisons COD'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              {isAr 
                ? 'اختبر كيف يستجيب نظام RoketLead عندما تعلن أمانة أو كاثيديس عن تسليم الطرد وقبض المبلغ.'
                : 'Testez la réaction du système lors de la confirmation de livraison par votre transporteur.'}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'رقم الطلب' : 'Réf Commande'}</label>
                    <input
                      type="text"
                      value={simulatedOrderNum}
                      onChange={(e) => setSimulatedOrderNum(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'شركة الشحن' : 'Transporteur'}</label>
                    <select
                      value={simulatedCourier}
                      onChange={(e) => setSimulatedCourier(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      <option value="Amana Express">Amana Express</option>
                      <option value="Cathedis">Cathedis</option>
                      <option value="Sendit">Sendit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'حالة التسليم الجديدة' : 'Nouveau Statut'}</label>
                  <select
                    value={simulatedStatus}
                    onChange={(e) => setSimulatedStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="DELIVERED">{isAr ? 'DELIVERED (تم التسليم وقبض المبلغ)' : 'DELIVERED (Livré & Encaissé)'}</option>
                    <option value="RETURNED">{isAr ? 'RETURNED (مرتجع COD)' : 'RETURNED (Refusé / Retour)'}</option>
                    <option value="CANCELLED">{isAr ? 'CANCELLED (ملغى من الزبون)' : 'CANCELLED (Annulé)'}</option>
                  </select>
                </div>

                <button
                  onClick={handleRunWebhookSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? (isAr ? 'جاري الإرسال...' : 'Envoi en cours...') : (isAr ? 'إرسال Webhook اختباري' : 'Déclencher l’Événement Webhook')}</span>
                </button>
              </div>

              {/* Simulation Result Output */}
              <div className="lg:col-span-6 bg-[#0f172a] text-slate-200 p-5 rounded-2xl border border-slate-800 text-xs font-mono min-h-[220px]" dir="ltr">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>POST /api/v1/webhooks/order-status</span>
                  <span className={simulationResponse ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    {simulationResponse ? `HTTP ${simulationResponse.httpStatus} OK` : 'Awaiting simulation'}
                  </span>
                </div>

                {simulationResponse ? (
                  <pre className="text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
                    {JSON.stringify(simulationResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-36 text-slate-500 text-center font-sans">
                    <Zap className="w-6 h-6 text-slate-600 mb-2" />
                    <span>Cliquez sur "Déclencher l'événement" pour observer la réconciliation instantanée.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: CODE SUITE & PLUGINS */}
      {activeTab === 'code-suite' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {isAr ? 'أكواد الربط البرمجي وإضافات المتاجر' : 'Code d’Intégration & Plugins Techniques'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr 
                  ? 'إضافة تتبع الكوكيز، كود WooCommerce، وكود استقبال Webhooks لتسوية الشحنات.'
                  : 'Snippets JavaScript, plugin WordPress WooCommerce et script backend de réconciliation.'}
              </p>
            </div>

            {/* Sub-selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCodeTab('tracker')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  codeTab === 'tracker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tracker JS
              </button>
              <button
                onClick={() => setCodeTab('woocommerce')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  codeTab === 'woocommerce' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                WooCommerce PHP
              </button>
              <button
                onClick={() => setCodeTab('webhook')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  codeTab === 'webhook' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Webhook Handler (TS)
              </button>
            </div>
          </div>

          {/* Snippet Code Viewer */}
          <div className="bg-[#0f172a] rounded-2xl p-5 border border-slate-800 text-slate-200" dir="ltr">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <FileCode2 className="w-4 h-4 text-blue-400" />
                <span>
                  {codeTab === 'tracker' && 'roketlead-tracker.js (Client-side Attribution)'}
                  {codeTab === 'woocommerce' && 'roketlead-woocommerce.php (WordPress Plugin)'}
                  {codeTab === 'webhook' && 'webhook-reconciliation.ts (Express/Node.js)'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content = codeTab === 'tracker' ? TRACKER_JS_CODE : codeTab === 'woocommerce' ? WOOCOMMERCE_PLUGIN_CODE : WEBHOOK_HANDLER_TS_CODE;
                    const name = codeTab === 'tracker' ? 'roketlead-tracker.js' : codeTab === 'woocommerce' ? 'roketlead-woocommerce.php' : 'webhook-reconciliation.ts';
                    handleCopy(content, 'code');
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code' ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={() => {
                    const content = codeTab === 'tracker' ? TRACKER_JS_CODE : codeTab === 'woocommerce' ? WOOCOMMERCE_PLUGIN_CODE : WEBHOOK_HANDLER_TS_CODE;
                    const name = codeTab === 'tracker' ? 'roketlead-tracker.js' : codeTab === 'woocommerce' ? 'roketlead-woocommerce.php' : 'webhook-reconciliation.ts';
                    handleDownloadFile(content, name);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>

            <pre className="font-mono text-xs leading-relaxed overflow-x-auto text-slate-300 max-h-96 select-all">
              <code>
                {codeTab === 'tracker' && TRACKER_JS_CODE}
                {codeTab === 'woocommerce' && WOOCOMMERCE_PLUGIN_CODE}
                {codeTab === 'webhook' && WEBHOOK_HANDLER_TS_CODE}
              </code>
            </pre>
          </div>

        </div>
      )}

      {/* TAB 6: PRISMA SCHEMA & DATA MODEL (SELLER ACCOUNT EXCLUSIVE) */}
      {activeTab === 'prisma-schema' && (
        <div className="animate-in fade-in duration-200">
          <PrismaSchemaViewer isEmbedded={true} />
        </div>
      )}

      {/* CREATE OFFER / PROMO MODAL */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsCampaignModalOpen(false)}
              className={`absolute top-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold ${
                isRTL ? 'left-5' : 'right-5'
              }`}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-950 mb-1">
              {isAr ? 'إنشاء وتحديث عرض العمولة' : 'Créer ou Mettre à Jour une Offre'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAr ? `تحديد نسبة العمولة لمتجر ${currentMerchant.companyName}` : `Configurez la commission pour ${currentMerchant.companyName}`}
            </p>

            <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAr ? 'عنوان العرض / الحملة *' : 'Titre de l’Offre / Campagne *'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: عمولة 15% على مبيعات المتجر' : 'Ex: 15% de commission sur les ventes'}
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'نوع العمولة' : 'Modèle de Commission'}
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as CommissionType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium"
                  >
                    <option value="PERCENTAGE">{isAr ? 'نسبة مئوية % من الطلب' : 'Pourcentage % du montant'}</option>
                    <option value="FIXED_MAD">{isAr ? 'مبلغ ثابت بالدرهم (MAD)' : 'Montant fixe en MAD'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {commissionType === 'PERCENTAGE' ? (isAr ? 'القيمة (%)' : 'Valeur (%)') : (isAr ? 'القيمة (د.م)' : 'Valeur (MAD)')}
                  </label>
                  <input
                    type="number"
                    value={commissionVal}
                    onChange={(e) => setCommissionVal(Number(e.target.value))}
                    min={1}
                    max={commissionType === 'PERCENTAGE' ? 50 : 2000}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'صلاحية الكوكي (بالأيام)' : 'Durée Cookie (Jours)'}
                  </label>
                  <input
                    type="number"
                    value={cookieDays}
                    onChange={(e) => setCookieDays(Number(e.target.value))}
                    min={7}
                    max={90}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isAr ? 'تخصيص كود خصم (اختياري)' : 'Code Promo Dédié (Optionnel)'}
                  </label>
                  <input
                    type="text"
                    placeholder="VIP_SARAH"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 uppercase font-mono font-bold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <strong>{isAr ? 'قواعد الأداء والتسوية:' : 'Règles de Règlement :'}</strong>
                <p>• {isAr ? 'تحتسب العمولة تلقائياً عند إتمام الزبون لعملية الشراء عبر رابط أو كود المسوق.' : 'La commission est enregistrée automatiquement dès qu’un achat est complété via le lien du créateur.'}</p>
                <p>• {isAr ? 'يمكن للمسوق سحب رصيده عند بلوغ الحد الأدنى 200 درهم مباشرة إلى حسابه البنكي.' : 'Le promoteur peut retirer ses gains dès le seuil de 200 MAD vers son compte bancaire.'}</p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {isAr ? 'حفظ ونشر العرض' : 'Enregistrer & Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Coin Icon
function CoinsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}
