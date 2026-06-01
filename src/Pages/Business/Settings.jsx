import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import {
  BuildingOfficeIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  CommandLineIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const Settings = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('business-profile');
  
  // Toast notification state
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Persisted or default states
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('invoiceflow_business_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      // Business Profile
      businessName: 'Acme Inc.',
      businessEmail: 'hello@acmeinc.com',
      phoneNumber: '+1 212 555 0101',
      website: 'www.acmeinc.com',
      address: '450 Park Ave, Suite 1200, New York, NY 10022',
      industry: 'Technology & Software',
      taxId: '12-3456789',
      logoUrl: '', // Dynamic blob URL on upload
      primaryColor: '#7f22fe',
      accentColor: '#22d3ee',
      
      // Invoice Preferences
      currency: 'USD — US Dollar',
      taxRate: '8%',
      invoicePrefix: 'INV-',
      paymentTerms: 'Net 14 Days',
      invoiceNotes: 'Payment due within 14 days. Thank you for your business.',
      autoSend: true,
      
      // Security
      twoFactor: true,
      sso: false,
      sessionTimeout: '30 minutes',
      passwordPolicy: 'Strong',

      // Notifications
      notifyInvoicePaid: true,
      notifyLowStock: true,
      notifyMonthlyReport: false,
      notifyNewCustomer: true,
      notifyPushAlerts: true,
      webhookUrl: 'https://api.acmeinc.com/invoiceflow-webhook'
    };
  });

  // Save changes handler
  const handleSave = () => {
    localStorage.setItem('invoiceflow_business_settings', JSON.stringify(settings));
    triggerToast('Settings successfully updated!');
  };

  // Reset to default settings
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('invoiceflow_business_settings');
      setSettings({
        businessName: 'Acme Inc.',
        businessEmail: 'hello@acmeinc.com',
        phoneNumber: '+1 212 555 0101',
        website: 'www.acmeinc.com',
        address: '450 Park Ave, Suite 1200, New York, NY 10022',
        industry: 'Technology & Software',
        taxId: '12-3456789',
        logoUrl: '',
        primaryColor: '#7f22fe',
        accentColor: '#22d3ee',
        currency: 'USD — US Dollar',
        taxRate: '8%',
        invoicePrefix: 'INV-',
        paymentTerms: 'Net 14 Days',
        invoiceNotes: 'Payment due within 14 days. Thank you for your business.',
        autoSend: true,
        twoFactor: true,
        sso: false,
        sessionTimeout: '30 minutes',
        passwordPolicy: 'Strong',
        notifyInvoicePaid: true,
        notifyLowStock: true,
        notifyMonthlyReport: false,
        notifyNewCustomer: true,
        notifyPushAlerts: true,
        webhookUrl: 'https://api.acmeinc.com/invoiceflow-webhook'
      });
      triggerToast('Settings reset to defaults');
    }
  };

  // Image Upload refs & handlers
  const fileInputRef = useRef(null);
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast('Image size exceeds 2MB limit!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({ ...prev, logoUrl: event.target.result }));
        triggerToast('Company logo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Input change helper
  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // API Key Generator states
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Live Client Token', token: 'pk_live_51N8f9qX3s8b2e1x4...z01p', created: '2026-04-12' },
    { id: 2, name: 'Main Admin Secret', token: 'sk_live_51N8f9qX3s9f9x7d5...c81w', created: '2026-05-10' }
  ]);
  const handleAddApiKey = () => {
    const keyName = prompt('Enter a name/label for your new API key:');
    if (keyName && keyName.trim()) {
      const type = confirm('Should this be a live (sk_live_) key? (Cancel creates test key)') ? 'sk_live_' : 'sk_test_';
      const randomHex = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const newKey = {
        id: Date.now(),
        name: keyName.trim(),
        token: `${type}${randomHex.slice(0, 10)}...${randomHex.slice(18)}`,
        created: new Date().toISOString().split('T')[0]
      };
      setApiKeys(prev => [...prev, newKey]);
      triggerToast('New API key generated successfully!');
    }
  };
  const handleDeleteApiKey = (id) => {
    if (confirm('Are you sure you want to revoke this API key? Systems utilizing this key will break.')) {
      setApiKeys(prev => prev.filter(k => k.id !== id));
      triggerToast('API key successfully revoked.', 'error');
    }
  };

  // Integrations states
  const [integrations, setIntegrations] = useState([
    { id: 'stripe', name: 'Stripe', desc: 'Accept credit cards and local bank transfers on invoices.', logo: '⚡', connected: true },
    { id: 'paypal', name: 'PayPal', desc: 'Fast, secure online invoices payment processing checkout.', logo: '💳', connected: true },
    { id: 'slack', name: 'Slack Notifications', desc: 'Send real-time updates directly to your business channels.', logo: '💬', connected: false },
    { id: 'quickbooks', name: 'QuickBooks Sync', desc: 'Automatically sync products, clients, and invoice states.', logo: '📊', connected: false },
    { id: 'shopify', name: 'Shopify Store', desc: 'Sync customer orders, inventory stock, and catalog items.', logo: '🛍️', connected: false }
  ]);
  const handleToggleIntegration = (id) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === id) {
        const nextState = !integration.connected;
        triggerToast(`${integration.name} ${nextState ? 'connected' : 'disconnected'}!`);
        return { ...integration, connected: nextState };
      }
      return integration;
    }));
  };

  // Active Sessions mockup state
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome / Windows 11 (Acme HQ)', ip: '192.168.1.15', active: true, label: 'Current Session' },
    { id: 2, device: 'Safari / iPhone 15 Pro Max', ip: '172.56.21.90', active: false, label: 'Last active 2 hrs ago' },
    { id: 3, device: 'Firefox / macOS Sequoia', ip: '82.165.99.124', active: false, label: 'Last active 3 days ago' }
  ]);
  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    triggerToast('Remote session successfully terminated!', 'error');
  };

  // Color picker helper click trigger
  const colorPickerRef1 = useRef(null);
  const colorPickerRef2 = useRef(null);

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">
      
      {/* Toast popup */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-float-1 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-neon-purple/10 border-neon-purple/30 text-white dark:bg-neon-cyan/10 dark:border-neon-cyan/30 dark:text-neon-cyan'}`}>
          <div className={`h-2 w-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-neon-purple dark:bg-neon-cyan'} animate-ping`}></div>
          <span className="font-bold tracking-wide text-sm font-mono">{toast.message}</span>
        </div>
      )}

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* TOP TITLE HEADER & SAVE ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              Manage your business profile, security, and platform preferences
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset Button */}
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-400"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Glowing Save Button */}
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]"
            >
              <CheckIcon className="w-5 h-5 stroke-[3]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL TAB SELECTOR */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none border-b border-slate-200/60 dark:border-slate-800/40">
          {[
            { id: 'business-profile', label: 'Business Profile', icon: BuildingOfficeIcon },
            { id: 'security', label: 'Security', icon: ShieldCheckIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
            { id: 'billing', label: 'Billing', icon: CreditCardIcon },
            { id: 'api-keys', label: 'API Keys', icon: KeyIcon },
            { id: 'integrations', label: 'Integrations', icon: CommandLineIcon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 border cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-neon-purple text-white border-neon-purple shadow-md dark:bg-gradient-to-r dark:from-neon-purple dark:to-neon-purple/75 dark:border-neon-purple dark:shadow-[0_0_15px_rgba(189,0,255,0.35)]'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-cyber-card/40 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN TAB CONTENT CONTAINER */}
        <div className="transition-all duration-500 ease-in-out">
          
          {/* TAB 1: BUSINESS PROFILE */}
          {activeTab === 'business-profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* LEFT COLUMN: PROFILE FORM & PREFERENCES */}
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* CARD 1: BUSINESS PROFILE DETAILS */}
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                      <BuildingOfficeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Business Profile</h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Update your company information and branding</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Business Name</label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Business Email</label>
                      <input
                        type="email"
                        value={settings.businessEmail}
                        onChange={(e) => handleChange('businessEmail', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={settings.phoneNumber}
                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Website</label>
                      <input
                        type="text"
                        value={settings.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Business Address</label>
                      <textarea
                        rows="3"
                        value={settings.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Industry</label>
                      <select
                        value={settings.industry}
                        onChange={(e) => handleChange('industry', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      >
                        <option>Technology & Software</option>
                        <option>Financial Services</option>
                        <option>Creative & Marketing</option>
                        <option>Retail & E-commerce</option>
                        <option>Manufacturing & Logistics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Tax ID / EIN</label>
                      <input
                        type="text"
                        value={settings.taxId}
                        onChange={(e) => handleChange('taxId', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>
                  </div>
                </div>

                {/* CARD 2: INVOICE PREFERENCES */}
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Invoice Preferences</h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Set defaults for new invoices</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Default Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      >
                        <option>USD — US Dollar</option>
                        <option>EUR — Euro</option>
                        <option>GBP — British Pound</option>
                        <option>CAD — Canadian Dollar</option>
                        <option>NGN — Nigerian Naira</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Default Tax Rate</label>
                      <input
                        type="text"
                        value={settings.taxRate}
                        onChange={(e) => handleChange('taxRate', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Invoice Prefix</label>
                      <input
                        type="text"
                        value={settings.invoicePrefix}
                        onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Payment Terms</label>
                      <select
                        value={settings.paymentTerms}
                        onChange={(e) => handleChange('paymentTerms', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      >
                        <option>Due On Receipt</option>
                        <option>Net 14 Days</option>
                        <option>Net 30 Days</option>
                        <option>Net 60 Days</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Invoice Notes</label>
                      <textarea
                        rows="2"
                        value={settings.invoiceNotes}
                        onChange={(e) => handleChange('invoiceNotes', e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      ></textarea>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-800/40 mt-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Auto-send invoice on creation</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Email invoices to customers automatically</p>
                      </div>
                      
                      {/* Premium Dynamic Toggle Switch */}
                      <button
                        onClick={() => handleChange('autoSend', !settings.autoSend)}
                        className={`relative inline-flex h-6.5 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.autoSend ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ${settings.autoSend ? 'translate-x-5.5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: BRANDING, LOGO, SECURITY STATUS, DANGER */}
              <div className="space-y-6 md:space-y-8">
                
                {/* LOGO & BRANDING */}
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                      <PhotoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Business Logo & Branding</h2>
                    </div>
                  </div>

                  {/* Logo Drag/Drop Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-250 dark:border-slate-800/80 rounded-2xl hover:border-neon-purple dark:hover:border-neon-cyan/85 bg-slate-50/55 dark:bg-slate-950/20 hover:bg-slate-100/30 dark:hover:bg-slate-900/10 cursor-pointer transition-all duration-300 group"
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {settings.logoUrl ? (
                      <div className="relative w-20 h-20 mb-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition-transform duration-300">
                        <img src={settings.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpTrayIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      /* Glowing InvoiceFlow logo default icon */
                      <div className="h-16 w-16 mb-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-neon-cyan dark:to-neon-purple flex items-center justify-center shadow-[0_8px_20px_rgba(124,31,255,0.3)] dark:shadow-[0_0_20px_rgba(0,243,255,0.4)] group-hover:scale-105 transition-transform duration-300">
                        <svg className="h-9 w-9 text-white dark:text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          <path d="M2 17L12 22L22 17" />
                          <path d="M2 12L12 17L22 12" />
                        </svg>
                      </div>
                    )}

                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{settings.businessName}</span>
                    <span className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-2">Click to upload or drag & drop</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-650 font-mono mt-1">PNG, JPG up to 2MB</span>

                    <button 
                      type="button"
                      className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-450"
                    >
                      <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                    </button>
                  </div>

                  {/* Brand Color Settings */}
                  <div className="mt-6 space-y-4">
                    {/* Primary Color Picker */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/40">
                      <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Primary Color</span>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color"
                          ref={colorPickerRef1}
                          value={settings.primaryColor}
                          onChange={(e) => handleChange('primaryColor', e.target.value)}
                          className="opacity-0 w-0 h-0"
                        />
                        <button 
                          onClick={() => colorPickerRef1.current?.click()}
                          style={{ backgroundColor: settings.primaryColor }}
                          className="w-7 h-7 rounded-lg border border-white dark:border-slate-950 shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleChange('primaryColor', e.target.value)}
                          className="w-20 bg-slate-50 dark:bg-slate-950/40 border border-slate-250 dark:border-slate-850 rounded-lg px-2 py-1 text-xs font-mono font-bold text-center text-slate-700 dark:text-slate-350 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Accent Color Picker */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/40">
                      <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Accent Color</span>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color"
                          ref={colorPickerRef2}
                          value={settings.accentColor}
                          onChange={(e) => handleChange('accentColor', e.target.value)}
                          className="opacity-0 w-0 h-0"
                        />
                        <button 
                          onClick={() => colorPickerRef2.current?.click()}
                          style={{ backgroundColor: settings.accentColor }}
                          className="w-7 h-7 rounded-lg border border-white dark:border-slate-950 shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => handleChange('accentColor', e.target.value)}
                          className="w-20 bg-slate-50 dark:bg-slate-950/40 border border-slate-250 dark:border-slate-850 rounded-lg px-2 py-1 text-xs font-mono font-bold text-center text-slate-700 dark:text-slate-350 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECURITY QUICK SUMMARY */}
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                        <ShieldCheckIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Security</h2>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-450 dark:shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                      Secure
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* 2FA Toggle */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850/50">
                      <div>
                        <span className="block text-sm font-bold text-slate-850 dark:text-slate-250">Two-Factor Authentication</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{settings.twoFactor ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <button
                        onClick={() => handleChange('twoFactor', !settings.twoFactor)}
                        className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.twoFactor ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.twoFactor ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* SSO Toggle */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850/50">
                      <div>
                        <span className="block text-sm font-bold text-slate-850 dark:text-slate-250">Single Sign-On</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{settings.sso ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <button
                        onClick={() => handleChange('sso', !settings.sso)}
                        className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.sso ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                      >
                        <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.sso ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Session Timeout */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850/50">
                      <div>
                        <span className="block text-sm font-bold text-slate-850 dark:text-slate-250">Session Timeout</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{settings.sessionTimeout}</span>
                      </div>
                      <button 
                        onClick={() => {
                          const val = prompt('Enter session timeout duration (e.g. 30 minutes, 1 hour):', settings.sessionTimeout);
                          if (val) handleChange('sessionTimeout', val);
                        }}
                        className="text-xs font-bold font-mono tracking-wider text-neon-purple dark:text-neon-cyan hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Password Policy */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="block text-sm font-bold text-slate-850 dark:text-slate-250">Password Policy</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{settings.passwordPolicy}</span>
                      </div>
                      <span className="h-5 w-5 rounded-full text-emerald-500 dark:text-emerald-450 bg-emerald-500/10 flex items-center justify-center">
                        <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-white border border-red-200 shadow-sm dark:bg-red-950/5 dark:backdrop-blur-xl dark:border-red-900/40 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent dark:via-red-800 opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <ExclamationTriangleIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-red-650 dark:text-red-400">Danger Zone</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Export Data */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/50">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Export All Data</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Download a copy of all your business data</p>
                      </div>
                      <button 
                        onClick={() => {
                          triggerToast('Preparing backup. Download will start shortly...');
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold font-mono tracking-wider text-slate-700 dark:text-slate-350 cursor-pointer"
                      >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-50/10 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30">
                      <div>
                        <h4 className="text-sm font-bold text-red-750 dark:text-red-400">Delete Business Account</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Permanently remove all data. This cannot be undone</p>
                      </div>
                      <button 
                        onClick={() => {
                          const confirmDelete = prompt("To confirm deletion, type 'DELETE' below:");
                          if (confirmDelete === 'DELETE') {
                            triggerToast('Account termination request submitted', 'error');
                          } else if (confirmDelete !== null) {
                            triggerToast('Invalid confirmation string', 'error');
                          }
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-700 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border dark:border-red-500/30 rounded-xl text-xs font-bold font-mono tracking-wider text-white dark:text-red-400 cursor-pointer shadow-sm transition-all"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED SECURITY OPTIONS */}
          {activeTab === 'security' && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Login & Session Security</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Manage active logins, login options, and MFA keys</p>
                  </div>
                </div>

                {/* Session List */}
                <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-500 mb-4">Active Login Sessions</h3>
                
                <div className="space-y-4">
                  {sessions.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-850/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${session.active ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{session.device}</span>
                            {session.active && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-250 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="block text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">{session.ip} • {session.label}</span>
                        </div>
                      </div>

                      {!session.active && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3.5 py-1.5 border border-red-200 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-bold font-mono tracking-wider text-red-650 dark:text-red-400 cursor-pointer transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-850/50">
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-500 mb-4">Security Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono text-slate-450 dark:text-slate-450">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-850/40 text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-550">
                          <th className="pb-3">Event Action</th>
                          <th className="pb-3">Location IP</th>
                          <th className="pb-3 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/30 font-medium">
                        <tr>
                          <td className="py-3 text-slate-800 dark:text-slate-200 font-bold">2FA Configuration Updated</td>
                          <td className="py-3">192.168.1.15 (Dallas, US)</td>
                          <td className="py-3 text-right">2026-05-29 14:20:11</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-slate-800 dark:text-slate-200 font-bold">Password Login Succeeded</td>
                          <td className="py-3">192.168.1.15 (Dallas, US)</td>
                          <td className="py-3 text-right">2026-05-29 08:12:45</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-slate-800 dark:text-slate-200 font-bold">New API live Token Generated</td>
                          <td className="py-3">192.168.1.15 (Dallas, US)</td>
                          <td className="py-3 text-right">2026-05-28 17:34:02</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS SETTINGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                    <BellIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Notifications</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Control how and when you receive notification updates</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850/50 pb-2">Email Notifications</h3>
                  
                  {/* Notify Invoice Paid */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="block text-sm font-bold text-slate-855 dark:text-slate-200">Invoice Paid</span>
                      <span className="text-xs text-slate-400 dark:text-slate-550 font-mono mt-0.5">Receive email alerts when clients clear payment dues</span>
                    </div>
                    <button
                      onClick={() => handleChange('notifyInvoicePaid', !settings.notifyInvoicePaid)}
                      className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.notifyInvoicePaid ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.notifyInvoicePaid ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Notify Low Stock */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="block text-sm font-bold text-slate-855 dark:text-slate-200">Low Stock Alert</span>
                      <span className="text-xs text-slate-400 dark:text-slate-550 font-mono mt-0.5">Receive instant warnings when inventory is critical</span>
                    </div>
                    <button
                      onClick={() => handleChange('notifyLowStock', !settings.notifyLowStock)}
                      className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.notifyLowStock ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.notifyLowStock ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Notify Monthly Report */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="block text-sm font-bold text-slate-855 dark:text-slate-200">Monthly Statements Summary</span>
                      <span className="text-xs text-slate-400 dark:text-slate-550 font-mono mt-0.5">Automated accounting sheets delivered first day of month</span>
                    </div>
                    <button
                      onClick={() => handleChange('notifyMonthlyReport', !settings.notifyMonthlyReport)}
                      className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.notifyMonthlyReport ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.notifyMonthlyReport ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Notify New Customer */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="block text-sm font-bold text-slate-855 dark:text-slate-200">New Client Onboarding</span>
                      <span className="text-xs text-slate-400 dark:text-slate-550 font-mono mt-0.5">Email alerts when a client signs up or registers profiles</span>
                    </div>
                    <button
                      onClick={() => handleChange('notifyNewCustomer', !settings.notifyNewCustomer)}
                      className={`relative inline-flex h-5.5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${settings.notifyNewCustomer ? 'bg-neon-purple dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition-transform duration-300 ${settings.notifyNewCustomer ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850/50 pb-2 mt-8">System Integration Slack webhooks</h3>

                  {/* Webhook URLs input */}
                  <div>
                    <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Endpoint URL</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={settings.webhookUrl}
                        onChange={(e) => handleChange('webhookUrl', e.target.value)}
                        className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-450 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                      />
                      <button 
                        onClick={() => triggerToast('Test webhook payload dispatched!')}
                        className="px-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono tracking-wider text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BILLING & PLANS */}
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
              {/* CURRENT TIER */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* BILLING INFO CARD */}
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Subscription & Plan</h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Manage your active billing tier, plans, and invoices</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-slate-950/40 dark:to-slate-950/15 border border-purple-100 dark:border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Acme Enterprise Premium</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-glow-cyan shadow-[0_0_8px_rgba(0,243,255,0.15)]">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-slate-450 dark:text-slate-500 font-mono mt-1">Next invoice billing date: June 28, 2026 ($49.00 / month)</p>
                      
                      <div className="mt-4 flex gap-4">
                        <div className="text-left">
                          <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Invoices quota</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Unlimited / Month</span>
                        </div>
                        <div className="text-left border-l border-slate-200 dark:border-slate-800 pl-4">
                          <span className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Users Allowed</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">15 Team Members</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => triggerToast('Subscription checkout initialized!')}
                      className="px-5 py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 text-xs text-center"
                    >
                      Upgrade Plan
                    </button>
                  </div>

                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-450 dark:text-slate-500 mt-8 mb-4 border-b border-slate-100 dark:border-slate-850/40 pb-2">InvoiceFlow Billing Receipts</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono text-slate-500 dark:text-slate-450">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 border-b border-slate-100 dark:border-slate-850/30">
                          <th className="pb-3">Reference No</th>
                          <th className="pb-3">Month</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3 text-right">Receipt PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/30">
                        <tr>
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">IF-REC-9014</td>
                          <td className="py-3.5">May 2026</td>
                          <td className="py-3.5 font-bold">$49.00</td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => triggerToast('Downloading receipt...')} className="text-neon-purple dark:text-neon-cyan hover:underline cursor-pointer">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">IF-REC-8902</td>
                          <td className="py-3.5">April 2026</td>
                          <td className="py-3.5 font-bold">$49.00</td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => triggerToast('Downloading receipt...')} className="text-neon-purple dark:text-neon-cyan hover:underline cursor-pointer">Download</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">IF-REC-7801</td>
                          <td className="py-3.5">March 2026</td>
                          <td className="py-3.5 font-bold">$49.00</td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => triggerToast('Downloading receipt...')} className="text-neon-purple dark:text-neon-cyan hover:underline cursor-pointer">Download</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* CARD DETAILS */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                  <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Payment Method</h3>
                  
                  {/* Virtual glowing Credit Card Mock */}
                  <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyber-dark text-white overflow-hidden shadow-lg border border-slate-800/60 dark:shadow-[0_0_15px_rgba(0,243,255,0.08)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl"></div>

                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="block text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Acme Inc. Profile</span>
                        <span className="block text-base font-bold tracking-wider font-mono mt-1">•••• •••• •••• 4242</span>
                      </div>
                      <span className="text-xl font-bold font-mono tracking-wide bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">VISA</span>
                    </div>

                    <div className="flex justify-between items-end mt-8 relative z-10">
                      <div>
                        <span className="block text-[9px] font-mono tracking-wider text-slate-550">EXPIRE DATE</span>
                        <span className="block text-xs font-mono font-bold mt-0.5">12 / 2029</span>
                      </div>
                      
                      <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[9px] font-mono font-bold tracking-wider">PREFERED</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => triggerToast('Checkout update modal launched!')}
                    className="w-full mt-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-400 cursor-pointer text-center"
                  >
                    Update Billing details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEVELOPER API KEYS */}
          {activeTab === 'api-keys' && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                      <KeyIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Live API Key tokens</h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Use API tokens to sync external clients or custom invoice platforms</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddApiKey}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neon-purple hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 rounded-xl text-xs font-bold font-mono tracking-wider text-white dark:shadow-[0_0_15px_rgba(0,243,255,0.2)] cursor-pointer"
                  >
                    <span>Generate Key</span>
                  </button>
                </div>

                {/* API Key list table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono text-slate-500 dark:text-slate-450 border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 border-b border-slate-100 dark:border-slate-850/40">
                        <th className="pb-3">Key Label</th>
                        <th className="pb-3">Created</th>
                        <th className="pb-3">Secret Value</th>
                        <th className="pb-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/30">
                      {apiKeys.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-slate-400 dark:text-slate-655 font-bold">
                            No Active Developer Keys Generated
                          </td>
                        </tr>
                      ) : (
                        apiKeys.map(key => (
                          <tr key={key.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 font-bold text-slate-800 dark:text-slate-200">{key.name}</td>
                            <td className="py-4 text-slate-400 dark:text-slate-500">{key.created}</td>
                            <td className="py-4 font-bold text-slate-700 dark:text-slate-350">{key.token}</td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-3.5">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(key.token.includes('...') ? stripeKey : key.token);
                                    triggerToast('Token copied to clipboard!');
                                  }}
                                  className="p-1 rounded text-slate-450 hover:text-neon-purple dark:text-slate-500 dark:hover:text-neon-cyan transition-colors cursor-pointer"
                                  title="Copy Key"
                                >
                                  <DocumentDuplicateIcon className="w-4.5 h-4.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteApiKey(key.id)}
                                  className="p-1 rounded text-slate-450 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                                  title="Revoke Key"
                                >
                                  <TrashIcon className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50 flex gap-3.5 items-start">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)] flex-shrink-0 mt-0.5">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Security Warning</h4>
                    <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 mt-1 font-sans">
                      Your API keys allow complete access to modify products, registers customers, and clear invoices records. Do not share live keys or upload them to client-side public folders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONNECTED INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
                <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-cyan/10 dark:text-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.15)]">
                    <CommandLineIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Integrations Marketplace</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Integrate InvoiceFlow with accounting databases, payment checkout networks, and notification platforms</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {integrations.map(app => (
                    <div key={app.id} className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-850/50 flex flex-col justify-between transition-all duration-300 group hover:border-neon-purple/40 dark:hover:border-neon-cyan/30">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 group-hover:scale-105 transition-transform duration-300">
                            {app.logo}
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wide ${
                            app.connected 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 dark:shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                              : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-550'
                          }`}>
                            {app.connected ? 'CONNECTED' : 'OFFLINE'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-4">{app.name}</h4>
                        <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 mt-1 font-sans font-medium">{app.desc}</p>
                      </div>

                      <button
                        onClick={() => handleToggleIntegration(app.id)}
                        className={`w-full mt-5 py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider cursor-pointer text-center border transition-all ${
                          app.connected
                            ? 'border-red-200 dark:border-red-950/30 text-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-500/10'
                            : 'border-slate-200 dark:border-slate-850 text-slate-650 dark:text-slate-350 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-900/60'
                        }`}
                      >
                        {app.connected ? 'Disconnect App' : 'Connect Integration'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
