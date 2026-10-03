import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { MagnifyingGlassIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// ── Inline SVG brand icons ────────────────────────────────────────────────────
const StripeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c1.379 3.793-.764 7.218-5.38 7.218h-2.745l-1.377 8.729h3.367c.458 0 .85-.334.922-.787l.038-.196.733-4.647.047-.256a.932.932 0 01.922-.787h.58c3.76 0 6.701-1.528 7.561-5.946.36-1.847.173-3.388-.706-4.47-.267-.33-.587-.615-.955-.858-.001.002-.001.002-.4.54z"/>
  </svg>
);

const QuickBooksIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292l-4.5-4.5 1.458-1.458 3.042 3.04 6.959-6.959 1.458 1.458-8.417 8.419z"/>
  </svg>
);

const XeroIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.673 15.797l-2.219-2.22-2.22 2.22a.773.773 0 01-1.092-1.092l2.22-2.22-2.22-2.219a.773.773 0 011.092-1.092l2.22 2.22 2.219-2.22a.773.773 0 011.092 1.092l-2.22 2.219 2.22 2.22a.773.773 0 01-1.092 1.092zm6.343.461c-1.862 0-3.375-1.513-3.375-3.375s1.513-3.375 3.375-3.375S20.045 10.92 20.045 12.883c0 1.862-1.513 3.375-3.375 3.375zm0-5.203c-1.01 0-1.828.819-1.828 1.828s.819 1.828 1.828 1.828 1.829-.819 1.829-1.828-.819-1.828-1.829-1.828z"/>
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/>
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 9.404l-4.5 4.5H16.5c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5v2.438l4.5-4.5-4.5-4.5V4.28C8.485 4.28 4.78 7.985 4.78 12.5S8.485 20.72 13 20.72s8.22-3.705 8.22-8.22h-2.438l4.5-4.5-4.5-4.5v2.904z"/>
  </svg>
);

const HubSpotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M18.164 7.93V5.084a2.198 2.198 0 001.274-1.976V3.06A2.198 2.198 0 0017.24.86h-.049a2.198 2.198 0 00-2.196 2.199v.048a2.198 2.198 0 001.275 1.976V7.93a6.234 6.234 0 00-2.965 1.3L7.09 5.038a2.463 2.463 0 00.059-.516 2.473 2.473 0 10-2.473 2.473c.444 0 .857-.124 1.212-.334l6.122 4.131a6.234 6.234 0 00-.823 3.096 6.234 6.234 0 00.846 3.13l-1.87 1.87a2.119 2.119 0 00-.576-.085 2.131 2.131 0 102.131 2.131 2.119 2.119 0 00-.085-.577l1.852-1.851a6.268 6.268 0 003.724 1.22 6.285 6.285 0 006.284-6.284 6.285 6.285 0 00-4.33-5.982z"/>
  </svg>
);

const MailchimpIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
);

const TwilioIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 20.4c-4.632 0-8.4-3.768-8.4-8.4S7.368 3.6 12 3.6s8.4 3.768 8.4 8.4-3.768 8.4-8.4 8.4zm-2.952-8.4a2.952 2.952 0 11-5.904 0 2.952 2.952 0 015.904 0zm8.856 0a2.952 2.952 0 11-5.904 0 2.952 2.952 0 015.904 0z"/>
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M15.337.5c-.072 0-.144.072-.144.072s-.216.072-.504.144c-.072-.216-.144-.432-.288-.648C14.04.284 13.536 0 12.96 0c-.072 0-.144 0-.216.072-.072-.072-.144-.072-.216-.072C10.296 0 9.432 1.8 9.216 3.456c-.936.288-1.512.432-1.512.432-.432.144-.432.144-.504.576-.072.288-1.44 11.124-1.44 11.124L15.84 17.28V.5h-.503zm-1.08 1.656v.072c-.648.216-1.368.432-2.088.648.216-.792.576-1.584 1.08-2.088.216.36.432.864.576 1.44l.432-.072zm-1.584-1.44c.072 0 .144 0 .216.072-.576.576-.936 1.44-1.152 2.304-.576.144-1.08.288-1.656.432C11.232 2.232 12.168.716 12.673.716zm8.28 3.24c-.432-.072-1.08-.072-1.728-.072-.072-1.08-.36-2.016-.792-2.736.936.432 1.584 1.584 2.52 2.808zm-9.576 8.064c.072.576.504.864.936.864.432 0 .72-.288.72-.72 0-.72-.72-.936-1.08-1.224-.864-.648-1.224-1.44-1.08-2.304.216-1.296 1.296-2.16 2.664-2.232h.072c.72 0 1.44.216 2.016.648l-.36 1.152c-.432-.288-.936-.504-1.512-.504s-.936.288-.936.72c0 .576.648.864 1.008 1.08.936.576 1.44 1.368 1.296 2.448-.216 1.44-1.368 2.304-2.88 2.304-.864 0-1.656-.288-2.16-.792l.5-1.44h-.204z"/>
  </svg>
);

const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M4.585 20.415l2.033-3.498H22.5l-2.033 3.498zm3.833-6.582L6.385 11.33 13.918 0l2.033 3.498zm13.832 3.084H8.415l-4.085-7.08 2.033-3.498z"/>
  </svg>
);

const FreshBooksIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

// ── Main integrations dataset ─────────────────────────────────────────────────
const INTEGRATIONS_DATA = [
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    description: 'Accept payments and manage subscriptions seamlessly.',
    icon: StripeIcon,
    iconBg: 'bg-[#635bff]',
    connected: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'Payments',
    description: 'Global online payments and checkout options.',
    icon: PayPalIcon,
    iconBg: 'bg-[#009cde]',
    connected: true,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Accounting',
    description: 'Sync invoices and expenses to your books.',
    icon: QuickBooksIcon,
    iconBg: 'bg-[#2ca01c]',
    connected: true,
  },
  {
    id: 'xero',
    name: 'Xero',
    category: 'Accounting',
    description: 'Cloud accounting and real-time reconciliation.',
    icon: XeroIcon,
    iconBg: 'bg-[#13b5ea]',
    connected: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Get real-time notifications in your channels.',
    icon: SlackIcon,
    iconBg: 'bg-[#4a154b]',
    connected: true,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Developer',
    description: 'Automate workflows across 5,000+ apps.',
    icon: ZapierIcon,
    iconBg: 'bg-[#ff4a00]',
    connected: false,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    description: 'Sync customers and deals with your CRM.',
    icon: HubSpotIcon,
    iconBg: 'bg-[#ff7a59]',
    connected: false,
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Communication',
    description: 'Email marketing and audience automation.',
    icon: MailchimpIcon,
    iconBg: 'bg-[#ffe01b]',
    connected: false,
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Communication',
    description: 'Send SMS reminders and notifications.',
    icon: TwilioIcon,
    iconBg: 'bg-[#f22f46]',
    connected: false,
  },
];

const MARKETPLACE_DATA = [
  { id: 'shopify', name: 'Shopify', category: 'E-Commerce', description: 'Sync product catalog and orders from your Shopify store.', icon: ShopifyIcon, iconBg: 'bg-[#95bf47]' },
  { id: 'gdrive', name: 'Google Drive', category: 'Storage', description: 'Attach invoices and files directly from Drive.', icon: GoogleDriveIcon, iconBg: 'bg-[#4285f4]' },
  { id: 'freshbooks', name: 'FreshBooks', category: 'Accounting', description: 'Import expense logs and time-tracking data.', icon: FreshBooksIcon, iconBg: 'bg-[#1abc9c]' },
];

const CATEGORIES = ['All', 'Payments', 'Accounting', 'CRM', 'Communication', 'Developer'];

// ── Custom animated toggle switch ────────────────────────────────────────────
const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    aria-checked={checked}
    role="switch"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none ${
      checked
        ? 'bg-neon-cyan dark:shadow-[0_0_10px_rgba(0,243,255,0.45)]'
        : 'bg-slate-300 dark:bg-slate-700'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// ── Integration card ──────────────────────────────────────────────────────────
const IntegrationCard = ({ integration, onToggle }) => {
  const Icon = integration.icon;
  return (
    <div className="relative flex flex-col bg-white border border-slate-200/80 dark:bg-cyber-card/90 dark:border-slate-800/80 rounded-3xl p-5 transition-all duration-300 hover:border-neon-cyan/30 dark:hover:border-neon-cyan/40 group">
      <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent dark:via-neon-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header row: icon + name + category + toggle */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${integration.iconBg}`}>
            <Icon />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-wide">
              {integration.name}
            </h3>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-400">
              {integration.category}
            </span>
          </div>
        </div>
        <ToggleSwitch checked={integration.connected} onChange={() => onToggle(integration.id)} />
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-sans flex-1 mb-4">
        {integration.description}
      </p>

      {/* Status badge */}
      <div>
        {integration.connected ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400 dark:shadow-[0_0_10px_rgba(16,185,129,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            Connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-slate-100 border border-slate-200 text-slate-500 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            Not Connected
          </span>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const AdminIntegrations = () => {
  const { theme } = useTheme();

  const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (id) => {
    setIntegrations(prev =>
      prev.map(intg => {
        if (intg.id === id) {
          const next = !intg.connected;
          triggerToast(
            `${intg.name} ${next ? 'connected successfully!' : 'disconnected.'}`,
            next ? 'success' : 'warn'
          );
          return { ...intg, connected: next };
        }
        return intg;
      })
    );
  };

  const handleMarketplaceInstall = (item) => {
    const alreadyExists = integrations.find(i => i.id === item.id);
    if (alreadyExists) {
      triggerToast(`${item.name} is already in your integrations.`, 'warn');
      return;
    }
    setIntegrations(prev => [
      ...prev,
      { ...item, icon: item.icon, connected: true },
    ]);
    setShowMarketplace(false);
    triggerToast(`${item.name} installed and connected!`);
  };

  const connectedCount = integrations.filter(i => i.connected).length;

  const filtered = integrations.filter(intg => {
    const matchCat =
      activeCategory === 'All' ||
      (activeCategory === 'Connected' ? intg.connected : intg.category === activeCategory);
    const matchSearch =
      searchQuery.trim() === '' ||
      intg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intg.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filterTabs = [
    { label: 'All', key: 'All' },
    { label: `Connected ${connectedCount}`, key: 'Connected' },
    ...CATEGORIES.slice(1).map(c => ({ label: c, key: c })),
  ];

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border transition-all duration-300 ${
            toast.type === 'warn'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
              : 'bg-neon-purple/10 border-neon-purple/30 text-slate-900 dark:bg-neon-cyan/10 dark:border-neon-cyan/30 dark:text-neon-cyan'
          }`}
        >
          <span className={`h-2 w-2 rounded-full animate-ping ${toast.type === 'warn' ? 'bg-amber-500' : 'bg-neon-purple dark:bg-neon-cyan'}`} />
          <span className="font-bold tracking-wide text-sm font-mono">{toast.message}</span>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Integrations
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              Connect InvoiceFlow with your favorite tools and services
            </p>
          </div>

          {/* Browse Marketplace CTA */}
          <button
            onClick={() => setShowMarketplace(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-cyan text-slate-950 hover:bg-neon-cyan/90 dark:shadow-[0_0_20px_rgba(0,243,255,0.35)] dark:hover:shadow-[0_0_28px_rgba(0,243,255,0.5)]"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5 stroke-[2.5]" />
            <span>Browse Marketplace</span>
          </button>
        </div>

        {/* ── Category filter pills + search ── */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Pills — scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 scrollbar-none">
            {filterTabs.map(tab => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wider border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-neon-purple text-white border-neon-purple shadow-md dark:bg-neon-purple dark:shadow-[0_0_14px_rgba(189,0,255,0.4)]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-cyber-card/50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative group flex-shrink-0 w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple/30 transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
            />
          </div>
        </div>

        {/* ── Integrations grid ── */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-12 text-center relative">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40" />
            <p className="text-sm font-bold font-mono text-slate-400 dark:text-slate-550">
              No integrations match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map(intg => (
              <IntegrationCard key={intg.id} integration={intg} onToggle={handleToggle} />
            ))}
          </div>
        )}

      </div>

      {/* ── Browse Marketplace Modal ── */}
      {showMarketplace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/50">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                  Integration Marketplace
                </h3>
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                  Discover and install new service connections
                </p>
              </div>
              <button
                onClick={() => setShowMarketplace(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MARKETPLACE_DATA.map(item => {
                const Icon = item.icon;
                const alreadyInstalled = integrations.some(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 hover:border-neon-cyan/40 transition-all duration-300 group"
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow ${item.iconBg} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{item.name}</span>
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{item.category}</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-450 dark:text-slate-500 leading-relaxed flex-1 mb-3">
                      {item.description}
                    </p>
                    <button
                      onClick={() => handleMarketplaceInstall(item)}
                      disabled={alreadyInstalled}
                      className={`w-full py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider transition-all cursor-pointer ${
                        alreadyInstalled
                          ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                          : 'bg-neon-cyan text-slate-950 hover:bg-neon-cyan/85 shadow dark:shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                      }`}
                    >
                      {alreadyInstalled ? 'Already Installed' : 'Install'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIntegrations;
