import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import {
  BuildingOfficeIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CheckIcon,
  EyeIcon,
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// ── Currency Definitions ───────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', label: 'USD ($) — US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', label: 'EUR (€) — Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', label: 'GBP (£) — British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', label: 'CAD ($) — Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', flag: '🇦🇺', label: 'AUD ($) — Australian Dollar' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', label: 'NGN (₦) — Nigerian Naira' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', label: 'JPY (¥) — Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', label: 'INR (₹) — Indian Rupee' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', label: 'CHF — Swiss Franc' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', flag: '🇸🇬', label: 'SGD ($) — Singapore Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', label: 'AED — UAE Dirham' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', label: 'ZAR (R) — South African Rand' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', label: 'BRL (R$) — Brazilian Real' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', label: 'SEK (kr) — Swedish Krona' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', label: 'NZD ($) — New Zealand Dollar' }
];

const PAYMENT_TERMS_OPTIONS = [
  { value: 'Due on Receipt', label: 'Due on Receipt', days: 0, desc: 'Payment expected immediately upon receiving invoice' },
  { value: 'Net 7', label: 'Net 7 Days', days: 7, desc: 'Payment due within 7 days of invoice date' },
  { value: 'Net 14', label: 'Net 14 Days', days: 14, desc: 'Payment due within 14 days of invoice date' },
  { value: 'Net 30', label: 'Net 30 Days', days: 30, desc: 'Payment due within 30 days of invoice date (Standard)' },
  { value: 'Net 60', label: 'Net 60 Days', days: 60, desc: 'Payment due within 60 days of invoice date' },
  { value: 'Custom', label: 'Custom Term', days: null, desc: 'Specify custom payment window or agreement' }
];

const DEFAULT_TAX_RATES = [
  { id: 'tax-1', name: 'Standard VAT', rate: 10.0, isDefault: true, description: 'Standard value-added tax rate' },
  { id: 'tax-2', name: 'Reduced VAT', rate: 5.0, isDefault: false, description: 'Essential goods & services' },
  { id: 'tax-3', name: 'Zero Rated / Exempt', rate: 0.0, isDefault: false, description: 'Exports and tax-exempt items' },
  { id: 'tax-4', name: 'Sales Tax (State & Local)', rate: 8.25, isDefault: false, description: 'Standard regional sales tax' }
];

const INITIAL_PROFILE = {
  // Company Information
  companyName: 'Acme Technologies Inc.',
  businessEmail: 'billing@acmetechnologies.com',
  phoneNumber: '+1 (555) 234-5678',
  businessAddress: '100 Innovation Way, Suite 400\nSan Francisco, CA 94107\nUnited States',
  taxRegistrationNumber: 'US-EIN-94-3829104',
  website: 'https://acmetechnologies.com',
  logoUrl: '',
  primaryColor: '#8B7CF6',
  accentColor: '#6366F1',

  // Invoice Preferences
  currency: 'USD',
  currencySymbol: '$',
  paymentTerms: 'Net 30',
  customPaymentDays: 45,
  taxName: 'VAT',
  defaultTaxRate: 10.0,
  invoicePrefix: 'INV-',
  invoiceNotes: 'Thank you for your business. Please remit payment according to agreed payment terms.',
  
  // Tax Rates list
  taxRates: DEFAULT_TAX_RATES
};

export default function BusinessProfile() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  // State initialization from localStorage or defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('invoiceflow_business_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PROFILE, ...parsed };
      } catch (e) {
        console.error('Failed to parse business profile from localStorage', e);
      }
    }
    return INITIAL_PROFILE;
  });

  // UI States
  const [toast, setToast] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  // Tax Management States
  const [editingTax, setEditingTax] = useState(null);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [taxForm, setTaxForm] = useState({ name: '', rate: '', isDefault: false, description: '' });

  const currencyDropdownRef = useRef(null);

  // Toast trigger helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key handler for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isPreviewOpen) setIsPreviewOpen(false);
        if (isTaxModalOpen) setIsTaxModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, isTaxModalOpen]);

  // Form value change handler
  const handleFieldChange = (key, value) => {
    setProfile(prev => {
      const updated = { ...prev, [key]: value };
      
      // If currency changed, also sync currencySymbol
      if (key === 'currency') {
        const curr = CURRENCIES.find(c => c.code === value);
        if (curr) {
          updated.currencySymbol = curr.symbol;
        }
      }
      return updated;
    });

    // Clear validation error on change
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Image Upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        triggerToast('Please upload a valid image file (PNG, JPG, SVG, or WEBP).', 'error');
        return;
      }
      // Validate file size: 2MB limit
      if (file.size > 2 * 1024 * 1024) {
        triggerToast('Image size exceeds the 2MB limit.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({ ...prev, logoUrl: event.target.result }));
        triggerToast('Company logo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Logo handler
  const handleRemoveLogo = () => {
    setProfile(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerToast('Company logo removed.');
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!profile.companyName || !profile.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (profile.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }
    if (profile.defaultTaxRate < 0 || profile.defaultTaxRate > 100) {
      newErrors.defaultTaxRate = 'Tax rate must be between 0% and 100%';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes handler
  const handleSave = () => {
    if (!validateForm()) {
      triggerToast('Please fix the highlighted errors before saving.', 'error');
      return;
    }

    localStorage.setItem('invoiceflow_business_profile', JSON.stringify(profile));
    
    // Also sync to general settings if present
    try {
      const existingSettings = JSON.parse(localStorage.getItem('invoiceflow_business_settings') || '{}');
      const merged = {
        ...existingSettings,
        businessName: profile.companyName,
        businessEmail: profile.businessEmail,
        phoneNumber: profile.phoneNumber,
        address: profile.businessAddress,
        taxId: profile.taxRegistrationNumber,
        website: profile.website,
        logoUrl: profile.logoUrl,
        currency: `${profile.currency} — ${CURRENCIES.find(c => c.code === profile.currency)?.name || ''}`,
        taxRate: `${profile.defaultTaxRate}%`,
        paymentTerms: profile.paymentTerms
      };
      localStorage.setItem('invoiceflow_business_settings', JSON.stringify(merged));
    } catch (e) {
      console.warn('Could not sync to general settings', e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    triggerToast('Business profile and invoice preferences saved successfully!');
  };

  // Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all business profile settings to default values?')) {
      setProfile(INITIAL_PROFILE);
      localStorage.removeItem('invoiceflow_business_profile');
      triggerToast('Business profile reset to defaults.');
    }
  };

  // Tax Rate Management Handlers
  const handleOpenAddTax = () => {
    setEditingTax(null);
    setTaxForm({ name: '', rate: '', isDefault: false, description: '' });
    setIsTaxModalOpen(true);
  };

  const handleOpenEditTax = (tax) => {
    setEditingTax(tax);
    setTaxForm({ name: tax.name, rate: tax.rate.toString(), isDefault: tax.isDefault, description: tax.description || '' });
    setIsTaxModalOpen(true);
  };

  const handleSaveTaxRate = (e) => {
    e?.preventDefault();
    const rateNum = parseFloat(taxForm.rate);
    if (!taxForm.name.trim()) {
      triggerToast('Tax name is required.', 'error');
      return;
    }
    if (isNaN(rateNum) || rateNum < 0 || rateNum > 100) {
      triggerToast('Tax rate must be a valid percentage between 0 and 100.', 'error');
      return;
    }

    let updatedRates = [...profile.taxRates];

    if (editingTax) {
      // Editing existing
      updatedRates = updatedRates.map(t => {
        if (t.id === editingTax.id) {
          return { ...t, name: taxForm.name.trim(), rate: rateNum, isDefault: taxForm.isDefault, description: taxForm.description.trim() };
        }
        // If this one is set as default, unset other defaults
        if (taxForm.isDefault) {
          return { ...t, isDefault: false };
        }
        return t;
      });
    } else {
      // Adding new
      const newTax = {
        id: `tax-${Date.now()}`,
        name: taxForm.name.trim(),
        rate: rateNum,
        isDefault: taxForm.isDefault || profile.taxRates.length === 0,
        description: taxForm.description.trim()
      };
      if (newTax.isDefault) {
        updatedRates = updatedRates.map(t => ({ ...t, isDefault: false }));
      }
      updatedRates.push(newTax);
    }

    // If default is checked, sync with profile defaultTaxRate and taxName
    const activeDefault = updatedRates.find(t => t.isDefault) || updatedRates[0];
    
    setProfile(prev => ({
      ...prev,
      taxRates: updatedRates,
      ...(taxForm.isDefault && activeDefault ? { defaultTaxRate: activeDefault.rate, taxName: activeDefault.name } : {})
    }));

    setIsTaxModalOpen(false);
    triggerToast(editingTax ? 'Tax rate updated successfully!' : 'New tax rate added successfully!');
  };

  const handleSetDefaultTax = (taxId) => {
    const updatedRates = profile.taxRates.map(t => ({
      ...t,
      isDefault: t.id === taxId
    }));
    const newDefault = updatedRates.find(t => t.id === taxId);
    
    setProfile(prev => ({
      ...prev,
      taxRates: updatedRates,
      defaultTaxRate: newDefault ? newDefault.rate : prev.defaultTaxRate,
      taxName: newDefault ? newDefault.name : prev.taxName
    }));
    triggerToast(`Default tax set to ${newDefault?.name} (${newDefault?.rate}%).`);
  };

  const handleDeleteTaxRate = (taxId) => {
    const target = profile.taxRates.find(t => t.id === taxId);
    if (profile.taxRates.length <= 1) {
      triggerToast('You must have at least one tax rate configured.', 'error');
      return;
    }
    if (target?.isDefault) {
      triggerToast('Cannot delete the default tax rate. Please set another rate as default first.', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${target?.name}"?`)) {
      setProfile(prev => ({
        ...prev,
        taxRates: prev.taxRates.filter(t => t.id !== taxId)
      }));
      triggerToast('Tax rate removed.');
    }
  };

  // Filtered Currencies for Search
  const filteredCurrencies = useMemo(() => {
    if (!currencySearch.trim()) return CURRENCIES;
    const query = currencySearch.toLowerCase();
    return CURRENCIES.filter(
      c => c.code.toLowerCase().includes(query) ||
           c.name.toLowerCase().includes(query) ||
           c.symbol.toLowerCase().includes(query)
    );
  }, [currencySearch]);

  const selectedCurrencyObj = CURRENCIES.find(c => c.code === profile.currency) || CURRENCIES[0];

  // Helper for calculation in preview
  const sampleInvoiceData = useMemo(() => {
    const items = [
      { id: 1, desc: 'Enterprise Cloud Architecture & Security Consultation', qty: 1, rate: 2450.00, amount: 2450.00 },
      { id: 2, desc: 'Full-Stack Web Application Engineering (Sprint 14-16)', qty: 32, rate: 85.00, amount: 2720.00 },
      { id: 3, desc: 'Dedicated High-Availability Hosting & DevOps SLA Support', qty: 1, rate: 450.00, amount: 450.00 }
    ];

    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const taxRatePercent = parseFloat(profile.defaultTaxRate) || 0;
    const taxAmount = (subtotal * taxRatePercent) / 100;
    const grandTotal = subtotal + taxAmount;

    // Issue Date & Calculated Due Date
    const today = new Date();
    const formattedIssueDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
    let daysToAdd = 30;
    const termObj = PAYMENT_TERMS_OPTIONS.find(t => t.value === profile.paymentTerms);
    if (termObj && termObj.days !== null) {
      daysToAdd = termObj.days;
    } else if (profile.paymentTerms === 'Custom' && profile.customPaymentDays) {
      daysToAdd = parseInt(profile.customPaymentDays, 10) || 30;
    }

    const dueDate = new Date();
    dueDate.setDate(today.getDate() + daysToAdd);
    const formattedDueDate = daysToAdd === 0 ? 'Due Immediately on Receipt' : dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return {
      items,
      subtotal,
      taxAmount,
      grandTotal,
      formattedIssueDate,
      formattedDueDate,
      daysToAdd
    };
  }, [profile.defaultTaxRate, profile.paymentTerms, profile.customPaymentDays]);

  // Currency format helper for preview
  const formatMoney = (amount) => {
    const symbol = profile.currencySymbol || '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-h-screen p-4 sm:p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">
      
      {/* Toast popup */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-fade-in transition-all duration-300 ${
          toast.type === 'error'
            ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 backdrop-blur-md'
            : 'bg-white/95 border-purple-200 text-purple-700 dark:bg-cyber-card/95 dark:border-neon-purple/40 dark:text-neon-purple shadow-[0_10px_30px_rgba(139,124,246,0.2)] backdrop-blur-md'
        }`}>
          <div className={`h-2.5 w-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-neon-purple dark:bg-neon-cyan'} animate-ping`}></div>
          <span className="font-bold tracking-wide text-sm font-mono">{toast.message}</span>
        </div>
      )}

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* =========================================================================
            1. PAGE HEADER
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/40">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple dark:shadow-[0_0_15px_rgba(155,140,255,0.2)]">
                <BuildingOfficeIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Business Profile
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                  Manage your company information and invoice preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            {/* Reset Button */}
            <button 
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-mono tracking-wider transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] cursor-pointer border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-400 shadow-sm"
              title="Reset all settings to default"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Preview Invoice Button */}
            <button 
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] cursor-pointer border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-neon-purple/30 dark:bg-neon-purple/10 dark:text-neon-purple dark:hover:bg-neon-purple/20 shadow-sm"
            >
              <EyeIcon className="w-4 h-4 stroke-[2.2]" />
              <span>Preview Invoice</span>
            </button>

            {/* Primary Save Changes Button */}
            <button 
              type="button"
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md text-white ${
                isSaved 
                  ? 'bg-emerald-600 shadow-emerald-500/30' 
                  : 'bg-neon-purple hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:shadow-[0_0_20px_rgba(139,124,246,0.35)]'
              }`}
            >
              <CheckIcon className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN PROFILE GRID LAYOUT
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* ─────────────────────────────────────────────────────────────────────────
              LEFT COLUMN (2 COLS ON LG): COMPANY INFO & INVOICE PREFERENCES
             ───────────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* ── CARD 1: COMPANY INFORMATION ────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>
              
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                    <BuildingOfficeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Company Information</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Enter details displayed on headers of invoices and receipts</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Company Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Acme Technologies Inc."
                      value={profile.companyName}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder-slate-500 ${
                        errors.companyName 
                          ? 'border-red-500 focus:ring-red-500/30' 
                          : 'border-slate-200 focus:border-neon-purple focus:ring-neon-purple/20 dark:border-slate-800 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20'
                      }`}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-mono">
                      <ExclamationCircleIcon className="w-3.5 h-3.5" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Business Email */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Business Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
                      <EnvelopeIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="billing@company.com"
                      value={profile.businessEmail}
                      onChange={(e) => handleFieldChange('businessEmail', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder-slate-500 ${
                        errors.businessEmail 
                          ? 'border-red-500 focus:ring-red-500/30' 
                          : 'border-slate-200 focus:border-neon-purple focus:ring-neon-purple/20 dark:border-slate-800 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20'
                      }`}
                    />
                  </div>
                  {errors.businessEmail && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-mono">
                      <ExclamationCircleIcon className="w-3.5 h-3.5" />
                      {errors.businessEmail}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
                      <PhoneIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={profile.phoneNumber}
                      onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                    />
                  </div>
                </div>

                {/* Tax Registration Number (Tax ID / VAT / EIN) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Tax Registration Number (VAT / EIN / GST / Tax ID)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
                      <IdentificationIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. US-EIN-94-3829104 or GB 123 4567 89"
                      value={profile.taxRegistrationNumber}
                      onChange={(e) => handleFieldChange('taxRegistrationNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                    />
                  </div>
                </div>

                {/* Business Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Business Address
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Street Address, Suite/Floor, City, State/Province, Postal Code, Country"
                    value={profile.businessAddress}
                    onChange={(e) => handleFieldChange('businessAddress', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* ── CARD 2: INVOICE PREFERENCES ───────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                  <DocumentTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Invoice Preferences</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Defaults applied automatically to all newly created invoices</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Default Currency — Searchable Select */}
                <div className="relative" ref={currencyDropdownRef}>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Default Currency
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-base">{selectedCurrencyObj.flag}</span>
                      <span className="font-bold font-mono">{selectedCurrencyObj.code}</span>
                      <span className="text-slate-400 dark:text-slate-500">({selectedCurrencyObj.symbol})</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">— {selectedCurrencyObj.name}</span>
                    </span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu with Search */}
                  {currencyDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 rounded-2xl shadow-2xl p-2 overflow-hidden animate-fade-in max-h-72 flex flex-col">
                      <div className="relative mb-2 px-1">
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search currency code or country..."
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-neon-purple dark:focus:border-neon-cyan"
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto flex-1 space-y-0.5">
                        {filteredCurrencies.length === 0 ? (
                          <div className="text-center py-4 text-xs font-mono text-slate-400">No currency found</div>
                        ) : (
                          filteredCurrencies.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                handleFieldChange('currency', c.code);
                                setCurrencyDropdownOpen(false);
                                setCurrencySearch('');
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                                profile.currency === c.code 
                                  ? 'bg-purple-50 text-neon-purple font-bold dark:bg-neon-purple/15 dark:text-neon-purple' 
                                  : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/60'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-sm">{c.flag}</span>
                                <span className="font-bold font-mono">{c.code}</span>
                                <span className="text-slate-400">({c.symbol})</span>
                                <span className="truncate">{c.name}</span>
                              </span>
                              {profile.currency === c.code && <CheckIcon className="w-4 h-4 stroke-[3]" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Default Payment Terms */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Default Payment Terms
                  </label>
                  <select
                    value={profile.paymentTerms}
                    onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                  >
                    {PAYMENT_TERMS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Payment Days (if Custom is chosen) */}
                {profile.paymentTerms === 'Custom' && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-purple-50/50 dark:bg-neon-purple/5 border border-purple-100 dark:border-neon-purple/20 animate-fade-in">
                    <label className="block text-xs font-bold font-mono tracking-wider uppercase text-purple-900 dark:text-purple-300 mb-1.5">
                      Custom Payment Due Days
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={profile.customPaymentDays || 45}
                        onChange={(e) => handleFieldChange('customPaymentDays', parseInt(e.target.value, 10) || 30)}
                        className="w-32 bg-white dark:bg-slate-950/60 border border-purple-200 dark:border-neon-purple/40 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-purple/30"
                      />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
                        days after invoice issuance
                      </span>
                    </div>
                  </div>
                )}

                {/* Tax Name */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Tax Name / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VAT, Sales Tax, GST, HST"
                    value={profile.taxName}
                    onChange={(e) => handleFieldChange('taxName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                  />
                </div>

                {/* Default Tax Rate % */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Default Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="10.0"
                      value={profile.defaultTaxRate}
                      onChange={(e) => handleFieldChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                      className={`w-full pr-10 pl-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:outline-none focus:ring-2 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder-slate-500 ${
                        errors.defaultTaxRate 
                          ? 'border-red-500 focus:ring-red-500/30' 
                          : 'border-slate-200 focus:border-neon-purple focus:ring-neon-purple/20 dark:border-slate-800 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold font-mono text-sm">
                      %
                    </div>
                  </div>
                  {errors.defaultTaxRate && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-mono">
                      <ExclamationCircleIcon className="w-3.5 h-3.5" />
                      {errors.defaultTaxRate}
                    </p>
                  )}
                </div>

                {/* Invoice Prefix */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Invoice Number Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="INV-"
                    value={profile.invoicePrefix}
                    onChange={(e) => handleFieldChange('invoicePrefix', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-mono font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Company Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-550">
                      <GlobeAltIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={profile.website}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                    />
                  </div>
                </div>

                {/* Default Notes / Footer terms */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                    Default Invoice Notes / Payment Instructions
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Notes, bank wire instructions, or client terms printed at the bottom of invoices..."
                    value={profile.invoiceNotes}
                    onChange={(e) => handleFieldChange('invoiceNotes', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/20 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan dark:focus:ring-neon-cyan/20"
                  ></textarea>
                  
                  {/* Helper description text */}
                  <div className="flex items-start gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <InformationCircleIcon className="w-4 h-4 text-purple-600 dark:text-neon-purple flex-shrink-0 mt-0.5" />
                    <span>
                      These preferences will automatically apply to newly created invoices and receipts, but can still be adjusted individually per invoice.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ── CARD 3: TAX CONFIGURATION ─────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                    <ReceiptPercentIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Tax Configuration</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Manage multiple tax rates, standard deductions, and regional rules</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddTax}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-neon-purple/10 dark:text-neon-purple dark:hover:bg-neon-purple/20 border border-purple-200 dark:border-neon-purple/30 text-xs font-bold tracking-wider transition-all cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Tax Rate</span>
                </button>
              </div>

              {/* Tax Rates List */}
              <div className="space-y-3">
                {profile.taxRates.map((tax) => (
                  <div
                    key={tax.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                      tax.isDefault
                        ? 'bg-purple-50/40 border-purple-200 dark:bg-neon-purple/5 dark:border-neon-purple/30'
                        : 'bg-slate-50/70 border-slate-200/80 dark:bg-slate-950/20 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                        tax.isDefault
                          ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-neon-purple/20 dark:text-neon-purple dark:border-neon-purple/40'
                          : 'bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                      }`}>
                        {tax.rate}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{tax.name}</h4>
                          {tax.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-purple-100 text-purple-700 dark:bg-neon-purple/20 dark:text-neon-purple border border-purple-200 dark:border-neon-purple/30">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        {tax.description && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{tax.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {!tax.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultTax(tax.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                          title="Set as default rate"
                        >
                          Set Default
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleOpenEditTax(tax)}
                        className="p-2 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-neon-purple dark:hover:bg-neon-purple/10 transition-colors"
                        title="Edit tax rate"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTaxRate(tax.id)}
                        disabled={tax.isDefault}
                        className={`p-2 rounded-lg transition-colors ${
                          tax.isDefault 
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                        }`}
                        title={tax.isDefault ? "Cannot delete default rate" : "Delete tax rate"}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────────────────
              RIGHT COLUMN (1 COL ON LG): LOGO, BRANDING & QUICK ACTIONS
             ───────────────────────────────────────────────────────────────────────── */}
          <div className="space-y-6 md:space-y-8">
            
            {/* ── LOGO & BRAND CARD ─────────────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                  <PhotoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Business Logo</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">Appears on invoices and client receipts</p>
                </div>
              </div>

              {/* Logo Upload / Preview Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-250 dark:border-slate-800/80 rounded-2xl hover:border-neon-purple dark:hover:border-neon-cyan/80 bg-slate-50/60 dark:bg-slate-950/20 hover:bg-slate-100/40 dark:hover:bg-slate-900/10 cursor-pointer transition-all duration-300 group"
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  className="hidden"
                />

                {profile.logoUrl ? (
                  <div className="relative w-28 h-28 mb-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300 bg-white dark:bg-slate-900 p-2 flex items-center justify-center">
                    <img src={profile.logoUrl} alt="Company Logo Preview" className="max-w-full max-h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <ArrowUpTrayIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  /* Professional Logo Empty State Placeholder */
                  <div className="h-24 w-24 mb-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-[#8B7CF6] dark:to-[#6366F1] flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(124,31,255,0.25)] dark:shadow-[0_0_20px_rgba(139,124,246,0.3)] group-hover:scale-105 transition-transform duration-300">
                    <BuildingOfficeIcon className="h-10 w-10 text-white stroke-[1.8]" />
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">NO LOGO</span>
                  </div>
                )}

                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 text-center">
                  {profile.companyName || 'Your Business Name'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 text-center">
                  {profile.logoUrl ? 'Click to replace logo' : 'Click to upload or drag & drop'}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 text-center">
                  PNG, JPG, SVG, or WEBP (Max 2MB)
                </span>

                {/* Upload / Change Action Button */}
                <div className="flex items-center gap-2 mt-4">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-300 shadow-sm"
                  >
                    <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                    <span>{profile.logoUrl ? 'Change' : 'Upload'}</span>
                  </button>

                  {profile.logoUrl && (
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleRemoveLogo(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20 text-xs font-bold font-mono tracking-wider text-red-500 shadow-sm"
                      title="Remove custom logo"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Brand Accent Color Options */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60 space-y-3.5">
                <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Invoice Accent Colors
                </h4>
                
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Brand</span>
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="color"
                      value={profile.primaryColor}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-7 h-7 rounded-lg border border-white dark:border-slate-900 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">{profile.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Accent Tone</span>
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="color"
                      value={profile.accentColor}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      className="w-7 h-7 rounded-lg border border-white dark:border-slate-900 cursor-pointer shadow-sm"
                    />
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">{profile.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PREVIEW BANNER CARD ───────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-purple-500/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold font-mono tracking-wider text-purple-200">
                  <SparklesIcon className="w-3.5 h-3.5 text-purple-300" />
                  LIVE PREVIEW
                </div>

                <h3 className="text-lg font-extrabold tracking-wide">
                  See how clients view your invoices
                </h3>

                <p className="text-xs text-purple-200/80 leading-relaxed">
                  Preview your branding, contact info, default currency, and tax calculations rendered in the InvoiceFlow standard format.
                </p>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <EyeIcon className="w-4 h-4 stroke-[2.5] text-purple-600" />
                  <span>Preview Sample Invoice</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          TAX CONFIGURATION ADD / EDIT MODAL
         ========================================================================= */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/50">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden animate-fade-in">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-60"></div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                  <ReceiptPercentIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                    {editingTax ? 'Edit Tax Rate' : 'Add New Tax Rate'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    Configure tax percentage and application rules
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTaxModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTaxRate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Tax Name / Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard VAT, Sales Tax (State), GST 18%"
                  value={taxForm.name}
                  onChange={(e) => setTaxForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Tax Rate (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="10.0"
                    value={taxForm.rate}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, rate: e.target.value }))}
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold font-mono text-sm">
                    %
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5">
                  Description / Applicability
                </label>
                <input
                  type="text"
                  placeholder="e.g. Applies to digital services & software"
                  value={taxForm.description}
                  onChange={(e) => setTaxForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60">
                <input
                  type="checkbox"
                  id="taxIsDefault"
                  checked={taxForm.isDefault}
                  onChange={(e) => setTaxForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 text-neon-purple rounded border-slate-300 focus:ring-neon-purple dark:border-slate-700 dark:bg-slate-900"
                />
                <label htmlFor="taxIsDefault" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Set as default tax rate on new invoices
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-extrabold text-xs tracking-wider bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all shadow-md cursor-pointer"
                >
                  {editingTax ? 'Update Rate' : 'Save Tax Rate'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTaxModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          INVOICE PREVIEW MODAL
         ========================================================================= */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-slate-950/60 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPreviewOpen(false);
          }}
        >
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col my-auto max-h-[95vh] animate-fade-in">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-60"></div>

            {/* ── MODAL HEADER ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                  <EyeIcon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                      Invoice Preview
                    </h3>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      LIVE FORM SYNC
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    This is how your business information will appear on invoices.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                aria-label="Close invoice preview"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* ── MODAL BODY: INVOICE PAPER CONTAINER ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 dark:bg-cyber-dark/80">
              
              {/* Paper Document Container */}
              <div className="max-w-3xl mx-auto bg-white dark:bg-cyber-card border border-slate-200/90 dark:border-slate-800 shadow-xl rounded-2xl p-6 sm:p-10 space-y-8 transition-colors">
                
                {/* ── INVOICE HEADER ROW ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-8">
                  
                  {/* Company Branding & Contact Details */}
                  <div className="space-y-3 max-w-sm">
                    {profile.logoUrl ? (
                      <div className="h-14 max-w-[180px] flex items-center">
                        <img src={profile.logoUrl} alt="Company Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div 
                          style={{ backgroundColor: profile.primaryColor }}
                          className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md"
                        >
                          <BuildingOfficeIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                          {profile.companyName || 'Your Business Name'}
                        </span>
                      </div>
                    )}

                    {profile.logoUrl && (
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {profile.companyName || 'Your Business Name'}
                      </h2>
                    )}

                    {/* Contact items */}
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 font-medium leading-relaxed">
                      {profile.businessAddress ? (
                        <p className="whitespace-pre-line">{profile.businessAddress}</p>
                      ) : (
                        <p className="italic text-slate-400">Address: 100 Main St, City, Country</p>
                      )}

                      <div className="pt-1 space-y-0.5 font-mono text-[11px]">
                        {profile.businessEmail && (
                          <p>Email: <span className="text-slate-700 dark:text-slate-300">{profile.businessEmail}</span></p>
                        )}
                        {profile.phoneNumber && (
                          <p>Phone: <span className="text-slate-700 dark:text-slate-300">{profile.phoneNumber}</span></p>
                        )}
                        {profile.taxRegistrationNumber && (
                          <p>Tax Reg / VAT: <span className="text-slate-700 dark:text-slate-300 font-bold">{profile.taxRegistrationNumber}</span></p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Meta Column */}
                  <div className="sm:text-right space-y-2">
                    <h1 
                      style={{ color: profile.primaryColor }} 
                      className="text-3xl sm:text-4xl font-black tracking-wider uppercase font-display"
                    >
                      INVOICE
                    </h1>
                    
                    <div className="space-y-1 text-xs font-mono">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        Invoice No: <span className="text-purple-600 dark:text-neon-purple">{profile.invoicePrefix || 'INV-'}000124</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Issue Date: <span className="text-slate-700 dark:text-slate-300">{sampleInvoiceData.formattedIssueDate}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Due Date: <span className="font-bold text-slate-900 dark:text-slate-100">{sampleInvoiceData.formattedDueDate}</span>
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                        STATUS: PENDING PAYMENT
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── BILL TO SECTION ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <span className="block text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                      Billed To
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      Acme Global Technologies Inc.
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Attn: Sarah Jenkins (VP Operations)
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      100 Enterprise Boulevard, Suite 400<br />
                      San Francisco, CA 94105, United States
                    </p>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                      billing@acmeglobal.com
                    </p>
                  </div>

                  <div className="sm:text-right flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5">
                        Payment Terms
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {profile.paymentTerms === 'Custom' ? `Custom (${profile.customPaymentDays} Days)` : profile.paymentTerms}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {sampleInvoiceData.daysToAdd === 0 ? 'Due immediately upon receipt' : `Payment due within ${sampleInvoiceData.daysToAdd} days of invoice date`}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 font-mono text-xs">
                      <span className="text-slate-400 dark:text-slate-500">Currency: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCurrencyObj.name} ({profile.currency})</span>
                    </div>
                  </div>
                </div>

                {/* ── INVOICE ITEMS TABLE ── */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                        <th className="py-3 px-2">Description</th>
                        <th className="py-3 px-2 text-center w-20">Qty</th>
                        <th className="py-3 px-2 text-right w-28">Rate</th>
                        <th className="py-3 px-2 text-right w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {sampleInvoiceData.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="py-3.5 px-2 font-medium text-slate-800 dark:text-slate-200">
                            {item.desc}
                          </td>
                          <td className="py-3.5 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                            {item.qty}
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono text-slate-600 dark:text-slate-400">
                            {formatMoney(item.rate)}
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                            {formatMoney(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── SUMMARY CALCULATIONS & NOTES ── */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  
                  {/* Left: Notes and payment details */}
                  <div className="sm:col-span-7 space-y-3">
                    <span className="block text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                      Invoice Notes & Instructions
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/60 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900/50">
                      {profile.invoiceNotes || 'Thank you for your business. Please remit payment via bank transfer.'}
                    </p>
                  </div>

                  {/* Right: Subtotal, Tax, and Total */}
                  <div className="sm:col-span-5 space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formatMoney(sampleInvoiceData.subtotal)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span>{profile.taxName || 'Tax'} ({profile.defaultTaxRate}%):</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{formatMoney(sampleInvoiceData.taxAmount)}</span>
                    </div>

                    <div className="border-t-2 border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Total Due:</span>
                      <span 
                        style={{ color: profile.primaryColor }}
                        className="text-xl font-extrabold tracking-tight"
                      >
                        {formatMoney(sampleInvoiceData.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── INVOICE FOOTER ── */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Thank you for your business.
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    Generated via InvoiceFlow · {profile.website || 'invoiceflow.app'}
                  </p>
                </div>

              </div>

            </div>

            {/* ── MODAL FOOTER ── */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Currency: <span className="font-bold text-slate-700 dark:text-slate-300">{profile.currency} ({profile.currencySymbol})</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSave();
                    setIsPreviewOpen(false);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all shadow-md cursor-pointer"
                >
                  <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
