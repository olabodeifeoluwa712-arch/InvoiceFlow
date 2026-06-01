import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PauseCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CubeIcon,
  TruckIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

// ── Initial business profiles ─────────────────────────────────────────────────
const INITIAL_BUSINESS_PROFILES = [
  {
    id: 'BIZ-001',
    company: 'SoundTech Co.',
    contact: 'Lena Marsh',
    countryCode: 'US',
    country: 'United States',
    email: 'lena@soundtech.io',
    phone: '+1 415 555 0101',
    products: 3,
    leadTime: '7d',
    since: 'Jan 2022',
    status: 'Active',
    avatarBg: 'bg-purple-100 text-purple-600 dark:bg-neon-purple/15 dark:text-neon-purple',
  },
  {
    id: 'BIZ-002',
    company: 'ConnectPro Ltd.',
    contact: 'James Okoro',
    countryCode: 'GB',
    country: 'United Kingdom',
    email: 'james@connectpro.co.uk',
    phone: '+44 20 7946 0958',
    products: 5,
    leadTime: '14d',
    since: 'Mar 2021',
    status: 'Active',
    avatarBg: 'bg-cyan-100 text-cyan-600 dark:bg-neon-cyan/15 dark:text-neon-cyan',
  },
  {
    id: 'BIZ-003',
    company: 'HID Solutions',
    contact: 'Sara Cho',
    countryCode: 'US',
    country: 'United States',
    email: 'sara@hidsolutions.com',
    phone: '+1 312 555 0199',
    products: 2,
    leadTime: '10d',
    since: 'Jun 2023',
    status: 'Active',
    avatarBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  {
    id: 'BIZ-004',
    company: 'KeyCraft Inc.',
    contact: 'David Reinholt',
    countryCode: 'DE',
    country: 'Germany',
    email: 'd.reinholt@keycraft.de',
    phone: '+49 30 12345678',
    products: 1,
    leadTime: '21d',
    since: 'Nov 2022',
    status: 'Active',
    avatarBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  },
  {
    id: 'BIZ-005',
    company: 'VisionTech',
    contact: 'Amy Lin',
    countryCode: 'HK',
    country: 'Hong Kong',
    email: 'amy@visiontech.hk',
    phone: '+852 2345 6789',
    products: 2,
    leadTime: '18d',
    since: 'Feb 2023',
    status: 'On Hold',
    avatarBg: 'bg-rose-100 text-rose-600 dark:bg-neon-pink/15 dark:text-neon-pink',
  },
  {
    id: 'BIZ-006',
    company: 'LumiHome',
    contact: 'Carlos Vega',
    countryCode: 'ES',
    country: 'Spain',
    email: 'carlos@lumihome.es',
    phone: '+34 91 555 0123',
    products: 1,
    leadTime: '12d',
    since: 'Sep 2022',
    status: 'Active',
    avatarBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  },
  {
    id: 'BIZ-007',
    company: 'NovaParts GmbH',
    contact: 'Frieda Braun',
    countryCode: 'DE',
    country: 'Germany',
    email: 'frieda@novaparts.de',
    phone: '+49 89 998877',
    products: 4,
    leadTime: '9d',
    since: 'Aug 2023',
    status: 'Pending',
    avatarBg: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400',
  },
  {
    id: 'BIZ-008',
    company: 'BrightLine Co.',
    contact: 'Tayo Adebayo',
    countryCode: 'NG',
    country: 'Nigeria',
    email: 'tayo@brightline.ng',
    phone: '+234 801 234 5678',
    products: 2,
    leadTime: '16d',
    since: 'Jan 2024',
    status: 'Pending',
    avatarBg: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
  },
  {
    id: 'BIZ-009',
    company: 'SilkRoad Traders',
    contact: 'Wei Zhang',
    countryCode: 'CN',
    country: 'China',
    email: 'wei@silkroadtraders.cn',
    phone: '+86 21 5555 7890',
    products: 8,
    leadTime: '25d',
    since: 'May 2024',
    status: 'Rejected',
    avatarBg: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  },
];

// ── Status Badge Component ────────────────────────────────────────────────────
const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    Active: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400',
    'On Hold': 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-400',
    Pending: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-neon-purple/10 dark:border-neon-purple/25 dark:text-neon-purple',
    Rejected: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-400',
  };
  const dotColors = {
    Active: 'bg-emerald-500',
    'On Hold': 'bg-amber-500',
    Pending: 'bg-purple-500 dark:bg-neon-purple animate-pulse',
    Rejected: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-bold font-mono tracking-wide ${size === 'sm' ? 'text-[10px]' : 'text-xs'} ${styles[status] || styles.Pending}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status] || dotColors.Pending}`} />
      {status}
    </span>
  );
};

// ── Business Profile Card ─────────────────────────────────────────────────────
const BusinessProfileCard = ({ profile, onView, onAccept, onDismiss }) => {
  return (
    <div
      className="relative bg-white border border-slate-200/80 dark:bg-cyber-card/90 dark:border-slate-800/80 rounded-3xl p-5 transition-all duration-300 hover:border-neon-purple/30 dark:hover:border-neon-cyan/30 group"
    >
      <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent dark:via-neon-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top row: icon + company + status */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onView(profile)}>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-sm ${profile.avatarBg}`}>
            <BuildingOfficeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-wide group-hover:text-neon-purple dark:group-hover:text-neon-cyan transition-colors">
              {profile.company}
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              {profile.id}
            </span>
          </div>
        </div>
        <StatusBadge status={profile.status} />
      </div>

      {/* Contact details */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
            {profile.countryCode}
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{profile.contact}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">·</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{profile.country}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-550 flex-shrink-0" />
          <span className="truncate font-medium">{profile.email}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <PhoneIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-550 flex-shrink-0" />
          <span className="font-medium">{profile.phone}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-stretch justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="text-center flex-1">
          <span className="block text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">{profile.products}</span>
          <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold mt-0.5">Products</span>
        </div>
        <div className="w-px bg-slate-100 dark:bg-slate-800/50" />
        <div className="text-center flex-1">
          <span className="block text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">{profile.leadTime}</span>
          <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold mt-0.5">Lead Time</span>
        </div>
        <div className="w-px bg-slate-100 dark:bg-slate-800/50" />
        <div className="text-center flex-1">
          <span className="block text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">{profile.since}</span>
          <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold mt-0.5">Since</span>
        </div>
      </div>

      {/* Accept & Dismiss Buttons */}
      <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <button
          onClick={(e) => { e.stopPropagation(); onAccept(profile.id); }}
          disabled={profile.status === 'Active'}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-wider border transition-all ${
            profile.status === 'Active'
              ? 'border-slate-200 text-slate-400 bg-slate-50 dark:border-slate-800 dark:text-slate-600 dark:bg-slate-900/30 cursor-not-allowed'
              : 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10 cursor-pointer'
          }`}
        >
          <CheckIcon className="w-3.5 h-3.5" />
          Accept
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(profile); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold tracking-wider border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
          Dismiss
        </button>
      </div>
    </div>
  );
};

// ── Main Admin Settings Component ─────────────────────────────────────────────
const Settings = () => {
  const { theme } = useTheme();
  const [profiles, setProfiles] = useState(INITIAL_BUSINESS_PROFILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Stats
  const totalCount = profiles.length;
  const activeCount = profiles.filter(s => s.status === 'Active').length;
  const pendingCount = profiles.filter(s => s.status === 'Pending').length;
  const onHoldCount = profiles.filter(s => s.status === 'On Hold').length;
  const rejectedCount = profiles.filter(s => s.status === 'Rejected').length;

  // Filter + search
  const filtered = profiles.filter(s => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Actions
  const handleApprove = (id) => {
    setProfiles(prev => prev.map(s => s.id === id ? { ...s, status: 'Active' } : s));
    const name = profiles.find(s => s.id === id)?.company;
    triggerToast(`${name} has been approved!`);
    setSelectedProfile(null);
  };

  const handleReject = (id) => {
    if (!rejectionNote.trim()) {
      triggerToast('Please provide a reason for rejection.', 'error');
      return;
    }
    setProfiles(prev => prev.map(s => s.id === id ? { ...s, status: 'Rejected' } : s));
    const name = profiles.find(s => s.id === id)?.company;
    triggerToast(`${name} has been rejected.`, 'error');
    setSelectedProfile(null);
    setRejectionNote('');
  };

  const handleHold = (id) => {
    setProfiles(prev => prev.map(s => s.id === id ? { ...s, status: 'On Hold' } : s));
    const name = profiles.find(s => s.id === id)?.company;
    triggerToast(`${name} placed on hold.`, 'warn');
    setSelectedProfile(null);
  };

  const handleReactivate = (id) => {
    setProfiles(prev => prev.map(s => s.id === id ? { ...s, status: 'Active' } : s));
    const name = profiles.find(s => s.id === id)?.company;
    triggerToast(`${name} reactivated!`);
    setSelectedProfile(null);
  };

  const handleDismiss = (profile) => {
    setProfiles(prev => prev.filter(s => s.id !== profile.id));
    triggerToast(`${profile.company} has been dismissed.`, 'error');
  };

  const handleEdit = (profile) => {
    setEditingProfile({ ...profile });
  };

  const handleEditSave = () => {
    if (editingProfile) {
      setProfiles(prev => prev.map(s => s.id === editingProfile.id ? editingProfile : s));
      triggerToast(`${editingProfile.company} updated successfully!`);
      setEditingProfile(null);
    }
  };

  const statusFilters = ['All', 'Active', 'Pending', 'On Hold', 'Rejected'];

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">

      {/* Ambient glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border transition-all duration-300 ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
          toast.type === 'warn' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
          'bg-neon-purple/10 border-neon-purple/30 text-slate-900 dark:bg-neon-cyan/10 dark:border-neon-cyan/30 dark:text-neon-cyan'
        }`}>
          <span className={`h-2 w-2 rounded-full animate-ping ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'warn' ? 'bg-amber-500' : 'bg-neon-purple dark:bg-neon-cyan'
          }`} />
          <span className="font-bold tracking-wide text-sm font-mono">{toast.message}</span>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Business Profiles
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              Review and approve business owner registrations
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-neon-purple/30 bg-purple-50 dark:bg-neon-purple/10 text-neon-purple font-bold text-xs font-mono tracking-wider">
                <ClockIcon className="w-4 h-4" />
                {pendingCount} Pending Review
              </span>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Profiles', value: totalCount, accent: 'via-neon-cyan', icon: UserCircleIcon, iconBg: 'bg-cyan-50 text-neon-cyan dark:bg-neon-cyan/10 dark:shadow-[0_0_12px_rgba(0,243,255,0.12)]' },
            { label: 'Active', value: activeCount, accent: 'via-emerald-500', icon: CheckCircleIcon, iconBg: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:shadow-[0_0_12px_rgba(16,185,129,0.12)]' },
            { label: 'Pending', value: pendingCount, accent: 'via-neon-purple', icon: ClockIcon, iconBg: 'bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:shadow-[0_0_12px_rgba(189,0,255,0.12)]' },
            { label: 'On Hold', value: onHoldCount, accent: 'via-amber-500', icon: PauseCircleIcon, iconBg: 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:shadow-[0_0_12px_rgba(245,158,11,0.12)]' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative transition-all duration-300">
                <div className={`absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent ${stat.accent} to-transparent opacity-40`} />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">{stat.label}</span>
                    <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">{stat.value}</span>
                  </div>
                  <div className={`p-2.5 rounded-2xl ${stat.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {statusFilters.map(sf => {
              const isActive = statusFilter === sf;
              let count = '';
              if (sf === 'Active') count = ` ${activeCount}`;
              else if (sf === 'Pending') count = ` ${pendingCount}`;
              else if (sf === 'On Hold') count = ` ${onHoldCount}`;
              else if (sf === 'Rejected') count = ` ${rejectedCount}`;
              return (
                <button
                  key={sf}
                  onClick={() => setStatusFilter(sf)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wider border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-neon-purple text-white border-neon-purple shadow-md dark:shadow-[0_0_14px_rgba(189,0,255,0.4)]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-cyber-card/50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                  }`}
                >
                  {sf}{count}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative group flex-shrink-0 w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors" />
            <input
              type="text"
              placeholder="Search business profiles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple/30 transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
            />
          </div>
        </div>

        {/* ── Business Profile Cards Grid ── */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-12 text-center relative">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40" />
            <p className="text-sm font-bold font-mono text-slate-400 dark:text-slate-550">
              No business profiles match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map(p => (
              <BusinessProfileCard key={p.id} profile={p} onView={setSelectedProfile} onAccept={handleApprove} onDismiss={handleDismiss} />
            ))}
          </div>
        )}
      </div>

      {/* ── Business Profile Detail / Approval Modal ── */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/50">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-60" />

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-sm ${selectedProfile.avatarBg}`}>
                  <BuildingOfficeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">{selectedProfile.company}</h3>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tracking-wider">{selectedProfile.id}</span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedProfile(null); setRejectionNote(''); }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60 mb-5">
              <span className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</span>
              <StatusBadge status={selectedProfile.status} size="md" />
            </div>

            {/* Contact Details Section */}
            <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60">
              <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-3">Contact Information</h4>
              
              <div className="flex items-center gap-3">
                <UserCircleIcon className="w-4 h-4 text-slate-400 dark:text-slate-550 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedProfile.contact}</span>
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-widest">
                  {selectedProfile.countryCode}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPinIcon className="w-4 h-4 text-slate-400 dark:text-slate-550 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400">{selectedProfile.country}</span>
              </div>

              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-4 h-4 text-slate-400 dark:text-slate-550 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{selectedProfile.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-slate-400 dark:text-slate-550 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{selectedProfile.phone}</span>
              </div>
            </div>

            {/* Business Profile Metrics */}
            <div className="flex items-stretch justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60 mb-6">
              <div className="text-center flex-1">
                <CubeIcon className="w-4 h-4 mx-auto text-slate-400 dark:text-slate-550 mb-1" />
                <span className="block text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{selectedProfile.products}</span>
                <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold">Products</span>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800/50" />
              <div className="text-center flex-1">
                <TruckIcon className="w-4 h-4 mx-auto text-slate-400 dark:text-slate-550 mb-1" />
                <span className="block text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{selectedProfile.leadTime}</span>
                <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold">Lead Time</span>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800/50" />
              <div className="text-center flex-1">
                <CalendarDaysIcon className="w-4 h-4 mx-auto text-slate-400 dark:text-slate-550 mb-1" />
                <span className="block text-lg font-extrabold text-slate-900 dark:text-slate-100 font-mono">{selectedProfile.since}</span>
                <span className="block text-[9px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase font-bold">Since</span>
              </div>
            </div>

            {/* Rejection Notes (if about to reject) */}
            {(selectedProfile.status === 'Pending' || selectedProfile.status === 'On Hold') && (
              <div className="mb-5">
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Rejection Reason (required to reject)</label>
                <textarea
                  rows="2"
                  placeholder="Provide a reason if rejecting this profile..."
                  value={rejectionNote}
                  onChange={e => setRejectionNote(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                />
              </div>
            )}

            {/* Action Buttons — context-dependent */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* Pending → Approve / Hold / Reject */}
              {selectedProfile.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-xs tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleHold(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wider border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
                  >
                    <PauseCircleIcon className="w-4 h-4" />
                    Hold
                  </button>
                  <button
                    onClick={() => handleReject(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wider border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}

              {/* On Hold → Approve / Reject */}
              {selectedProfile.status === 'On Hold' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-xs tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wider border border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}

              {/* Active → Put On Hold */}
              {selectedProfile.status === 'Active' && (
                <>
                  <button
                    onClick={() => handleHold(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs tracking-wider border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
                  >
                    <PauseCircleIcon className="w-4 h-4" />
                    Suspend Profile
                  </button>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </>
              )}

              {/* Rejected → Reactivate */}
              {selectedProfile.status === 'Rejected' && (
                <>
                  <button
                    onClick={() => handleReactivate(selectedProfile.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-xs tracking-wider bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />
                    Reactivate
                  </button>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/50">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-60" />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-sm border shadow-sm ${editingProfile.avatarBg}`}>
                  <PencilSquareIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">Edit Profile</h3>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 tracking-wider">{editingProfile.id}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Company Name', key: 'company' },
                { label: 'Contact Person', key: 'contact' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Country', key: 'country' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={editingProfile[field.key]}
                    onChange={e => setEditingProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={handleEditSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-extrabold text-xs tracking-wider bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all shadow-md cursor-pointer"
              >
                <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                Save Changes
              </button>
              <button
                onClick={() => setEditingProfile(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
