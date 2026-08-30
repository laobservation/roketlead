export type UserRole = 'SUPER_ADMIN' | 'SELLER' | 'PROMOTER' | 'MERCHANT' | 'AFFILIATE';

export type TrackingStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

export type PayoutStatus = 'PENDING' | 'PROCESSED' | 'REJECTED' | 'PAID' | 'REQUESTED';

export type CommissionType = 'PERCENTAGE' | 'FIXED_MAD' | 'RECURRING';

export type PromoterRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const MIN_WITHDRAWAL_THRESHOLD_MAD = 200; // 200 DH minimum balance for creators/promoters

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeUrl: string;
  companyName: string;
  slug: string;
  logo: string;
  category: 'E-commerce' | 'SaaS' | 'Health & Beauty' | 'Fashion & Artisanal' | 'Electronics' | 'Services';
  website: string;
  city: string;
  platformType: 'YouCan' | 'Shopify' | 'WooCommerce' | 'Custom API' | 'Custom React/HTML';
  pixelApiKey: string;
  integrationSecretKey: string;
  webhookUrl: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';
  totalSalesMAD: number;
  activeAffiliatesCount: number;
  commissionOffer: string;
  commissionType: CommissionType;
  commissionRate: number; // percentage (e.g. 10) or fixed amount in MAD (e.g. 30)
  commissionValue: number; // backward compatibility
  cookieDurationDays: number;
  description: string;
  tags: string[];
  featured?: boolean;
}

// Alias for backward compatibility
export type MerchantProfile = SellerProfile;

export interface PromoterProfile {
  id: string;
  userId: string;
  fullName: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeChannel?: string;
  whatsappNumber?: string;
  bankName: string;
  bankRib: string; // 24-digit Moroccan RIB
  accountHolderName: string;
  walletBalanceMAD: number;
  availableBalanceMAD: number;
  pendingCommissionMAD: number;
  lifetimePaidMAD: number;
  totalEarnedMAD: number;
  tier: 'Starter' | 'Verified Pro' | 'Elite Partner';
}

// Alias for backward compatibility
export type AffiliateProfile = PromoterProfile;

export interface PromoterRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerLogo: string;
  promoterId: string;
  promoterName: string;
  promoterHandle: string;
  promoterAvatar?: string;
  category: string;
  audienceSize: string;
  message?: string;
  status: PromoterRequestStatus;
  requestedAt: string;
  decidedAt?: string;
}

export interface Campaign {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  title: string;
  description: string;
  commissionType: CommissionType;
  commissionRate: string; // e.g. "10% per confirmed sale" or "30 DH fixed per order"
  cookieDuration: number; // in days
  category: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  totalClicks: number;
  totalConversions: number;
  totalPaidOutMAD: number;
  terms: string;
}

export interface TrackingLink {
  id: string;
  sellerId?: string;
  sellerName?: string;
  merchantId?: string;
  merchantName?: string;
  promoterId?: string;
  promoterName?: string;
  affiliateId?: string;
  affiliateName?: string;
  campaignId?: string;
  originalUrl: string;
  shortCode: string; // e.g. "rkt.ma/c/amine" or "rkt.ma/atlas-bio"
  trackingUrl: string;
  channel: 'Instagram' | 'TikTok' | 'WhatsApp' | 'YouTube' | 'Facebook' | 'General';
  clicksCount: number;
  conversionsCount: number;
  totalSalesMAD?: number;
  createdAt: string;
}

// Alias for backward compatibility
export type AffiliateLink = TrackingLink;

export interface PromoCode {
  id: string;
  affiliateId: string;
  campaignId: string;
  merchantName: string;
  code: string;
  discountPercentage: number;
  affiliateCommissionRate: number; // % or MAD
  usesCount: number;
  totalVolumeMAD: number;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: string;
}

export interface ClickRecord {
  id: string;
  affiliateLinkId: string;
  affiliateName: string;
  merchantName: string;
  ipAddress: string;
  city: string; // e.g. "Casablanca", "Rabat", "Marrakech", "Tangier"
  referrer: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  isFraudSuspect: boolean;
  timestamp: string;
}

export interface Conversion {
  id: string;
  orderId?: string;
  orderNumber?: string;
  merchantId?: string;
  sellerId?: string;
  merchantName?: string;
  sellerName?: string;
  affiliateId?: string;
  promoterId?: string;
  affiliateName?: string;
  promoterName?: string;
  channel: string;
  promoCode?: string;
  orderAmountMAD: number;
  commissionAmountMAD?: number;
  commissionMAD?: number; // backward compat
  saasCutMAD?: number; // 5% SaaS platform fee
  status: TrackingStatus;
  customerCity: string;
  courier: 'Amana Express' | 'Cathedis' | 'Aramex' | 'Sendit' | 'Ozone' | 'Self' | 'Pending Dispatch';
  trackingNumber: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface WithdrawalRequest {
  id: string;
  promoterId?: string;
  promoterName?: string;
  affiliateId?: string;
  affiliateName?: string;
  sellerId?: string;
  sellerName?: string;
  amountMAD: number;
  bankName: string;
  bankRib: string; // 24 digits
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  paidAt?: string;
  transactionReference?: string;
  notes?: string;
}

// Alias for backward compatibility
export type PayoutRequest = WithdrawalRequest;

export interface SystemAuditLog {
  id: string;
  type: 'COD_STATUS_UPDATE' | 'COMMISSION_CREDITED' | 'MERCHANT_SIGNUP' | 'PAYOUT_TRIGGERED' | 'FRAUD_FLAG';
  title: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}
