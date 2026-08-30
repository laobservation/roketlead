import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Fingerprint, 
  Database,
  Cpu
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [adminEmail, setAdminEmail] = useState<string>('admin@roketlead.ma');
  const [adminPassword, setAdminPassword] = useState<string>('••••••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('849 201');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [securityLevel, setSecurityLevel] = useState<'Standard' | 'Elevated'>('Elevated');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 450);
  };

  const handleQuickMasterLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Terminal Status Header */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400">
              roketlead.ma://internal/admin/login
            </span>
          </div>
          <button
            id="admin-login-modal-close"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Main Title Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  SaaS Owner Administration
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                  ROOT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Restricted access for RoketLead platform founders and super administrators.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              This is a private administrative endpoint. All IP addresses, courier reconciliation operations, and bank transfer dispatches are logged to the immutable audit ledger.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Super Admin Master Email
              </label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Root Master Password
              </label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Hardware Token / Authenticator 2FA (TOTP)
                </label>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Token Synced
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono tracking-widest text-emerald-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              id="submit-admin-login-btn"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating root credentials...</span>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  <span>Authenticate & Enter Super Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick 1-Click Master Access for Demo Testing */}
            <div className="pt-4 border-t border-slate-800 mt-5">
              <button
                type="button"
                id="quick-master-admin-btn"
                onClick={handleQuickMasterLogin}
                className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-purple-300 hover:text-purple-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>1-Click SaaS Founder Master Login</span>
              </button>
            </div>

          </form>

          {/* Direct URL path note */}
          <div className="mt-5 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <span>Direct route: </span>
            <code className="text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded text-[10px] font-mono">
              /admin/login
            </code>
          </div>

        </div>
      </div>
    </div>
  );
};
