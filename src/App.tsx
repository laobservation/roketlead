import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { EarlyAccessLandingPage } from './components/EarlyAccessLandingPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { MerchantDashboard } from './components/MerchantDashboard';
import { PrismaSchemaViewer } from './components/PrismaSchemaViewer';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MerchantProfile, AffiliateProfile } from './types';
import { INITIAL_MERCHANTS, INITIAL_AFFILIATE_PROFILE } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'merchant' | 'affiliate' | 'schema' | 'earlyaccess'>('landing');
  const [currentUserRole, setCurrentUserRole] = useState<'GUEST' | 'MERCHANT' | 'AFFILIATE' | 'SUPER_ADMIN'>('GUEST');
  
  const [activeMerchant, setActiveMerchant] = useState<MerchantProfile | null>(INITIAL_MERCHANTS[1]); // Default Caftan Royal Casablanca
  const [activeAffiliate, setActiveAffiliate] = useState<AffiliateProfile | null>(INITIAL_AFFILIATE_PROFILE); // Default Amine Benjelloun
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'seller' | 'promoter'>('seller');
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Direct URL Path & Hash listener for /earlyaccess and /admin/login
  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      if (path.includes('/admin/login') || hash.includes('admin/login') || hash.includes('admin-login') || search.includes('admin=login')) {
        setIsAdminLoginOpen(true);
      } else if (path.includes('/earlyaccess') || hash.includes('earlyaccess') || hash.includes('early-access') || search.includes('page=earlyaccess') || search.includes('earlyaccess')) {
        setCurrentView('earlyaccess');
      } else if (path === '/' && (hash === '' || hash === '#') && currentView === 'earlyaccess') {
        // If explicitly at root
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    window.addEventListener('popstate', handleUrlCheck);
    
    // Keyboard shortcut for SaaS Owner: Ctrl + Shift + A / Cmd + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigateView = (view: 'landing' | 'admin' | 'merchant' | 'affiliate' | 'earlyaccess') => {
    setCurrentView(view);
    if (view === 'earlyaccess') {
      window.history.pushState({}, '', '/earlyaccess');
    } else if (view === 'landing') {
      window.history.pushState({}, '', '/');
    }
  };

  // Handlers for authentications
  const handleLoginSeller = (merchant: MerchantProfile) => {
    setActiveMerchant(merchant);
    setCurrentUserRole('MERCHANT');
    setCurrentView('merchant');
    setIsAuthModalOpen(false);
  };

  const handleLoginPromoter = (affiliate: AffiliateProfile) => {
    setActiveAffiliate(affiliate);
    setCurrentUserRole('AFFILIATE');
    setCurrentView('affiliate');
    setIsAuthModalOpen(false);
  };

  const handleLoginAdmin = () => {
    setCurrentUserRole('SUPER_ADMIN');
    setCurrentView('admin');
    setIsAdminLoginOpen(false);
  };

  const handleLogout = () => {
    setCurrentUserRole('GUEST');
    setCurrentView('landing');
  };

  const handleOpenSignIn = (tab: 'seller' | 'promoter' = 'seller') => {
    setAuthModalTab(tab);
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = (tab: 'seller' | 'promoter' = 'seller') => {
    setAuthModalTab(tab);
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSelectMerchant = (merchant: MerchantProfile) => {
    setActiveMerchant(merchant);
    setCurrentUserRole('AFFILIATE');
    setCurrentView('affiliate');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* Universal Header - Hidden on Early Access Landing Page */}
      {currentView !== 'earlyaccess' && (
        <Navbar 
          currentView={currentView} 
          onViewChange={handleNavigateView} 
          onOpenSignIn={(tab) => handleOpenSignIn(tab || 'seller')}
          onOpenSignUp={(tab) => handleOpenSignUp(tab || 'seller')}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          currentUserRole={currentUserRole}
          activeMerchant={activeMerchant}
          activeAffiliate={activeAffiliate}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full overflow-x-hidden">
        {currentView === 'landing' && (
          <LandingPage 
            onStartSeller={() => handleOpenSignUp('seller')}
            onStartPromoter={() => handleOpenSignUp('promoter')}
            onNavigateToAffiliate={() => handleOpenSignIn('promoter')}
            onNavigateToAdmin={() => setIsAdminLoginOpen(true)}
            onNavigateToMerchant={() => handleOpenSignIn('seller')}
            onNavigateToEarlyAccess={() => handleNavigateView('earlyaccess')}
            onSelectMerchant={handleSelectMerchant}
          />
        )}

        {currentView === 'earlyaccess' && (
          <EarlyAccessLandingPage
            onNavigateHome={() => handleNavigateView('landing')}
            onOpenSignIn={(tab) => handleOpenSignIn(tab || 'seller')}
            onOpenSignUp={(tab) => handleOpenSignUp(tab || 'seller')}
          />
        )}

        {currentView === 'merchant' && (
          <MerchantDashboard 
            onSwitchToAffiliateView={() => {
              setCurrentUserRole('AFFILIATE');
              setCurrentView('affiliate');
            }}
            onSwitchToAdminView={() => setIsAdminLoginOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <SuperAdminDashboard 
            onSwitchToAffiliateView={() => {
              setCurrentUserRole('AFFILIATE');
              setCurrentView('affiliate');
            }}
          />
        )}

        {currentView === 'affiliate' && (
          <AffiliateDashboard />
        )}

        {currentView === 'schema' && (
          <PrismaSchemaViewer />
        )}
      </main>

      {/* Normal Login Modal with Seller & Promoter Options */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        initialMode={authModalMode}
        onLoginSeller={handleLoginSeller}
        onLoginPromoter={handleLoginPromoter}
        onOpenAdminLogin={() => {
          setIsAuthModalOpen(false);
          setIsAdminLoginOpen(true);
        }}
      />

      {/* Hidden SaaS Owner Admin Login (/admin/login) */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginAdmin}
      />

    </div>
  );
}
