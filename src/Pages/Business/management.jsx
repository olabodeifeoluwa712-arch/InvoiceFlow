import React, { useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import {
  UserGroupIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Management = () => {
  const { theme } = useTheme();

  // Toast notification state
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Preloaded mock database for Team Members
  const [members, setMembers] = useState([
    { id: 2, name: 'Marcus Lee', email: 'marcus@acmecorp.com', role: 'Admin', status: 'Active', lastActive: '15 min ago', joined: 'Mar 5, 2024', avatarBg: 'bg-neon-cyan/15 border-neon-cyan/20 text-neon-cyan' },
    { id: 3, name: 'Priya Patel', email: 'priya@acmecorp.com', role: 'Manager', status: 'Active', lastActive: '1 hr ago', joined: 'Apr 20, 2024', avatarBg: 'bg-blue-500/15 border-blue-500/20 text-blue-400' },
    { id: 4, name: 'Tom Rivera', email: 'tom@acmecorp.com', role: 'Accountant', status: 'Inactive', lastActive: '3 days ago', joined: 'Feb 8, 2024', avatarBg: 'bg-fuchsia-500/15 border-fuchsia-500/20 text-fuchsia-400' },
    { id: 5, name: 'Aisha Okonkwo', email: 'aisha@acmecorp.com', role: 'Viewer', status: 'Active', lastActive: '30 min ago', joined: 'May 1, 2024', avatarBg: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-450' },
    { id: 6, name: 'Dev Sharma', email: 'dev@acmecorp.com', role: 'Accountant', status: 'Pending', lastActive: 'Never', joined: 'May 27, 2026', avatarBg: 'bg-amber-500/15 border-amber-500/20 text-amber-450' }
  ]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Admin' });

  // Selected Member Details Modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRole, setEditRole] = useState('Admin');
  const [editStatus, setEditStatus] = useState('Active');

  // Stats computation
  const totalCount = members.length;
  const activeCount = members.filter(m => m.status === 'Active').length;
  const pendingCount = members.filter(m => m.status === 'Pending').length;
  const uniqueRoles = [...new Set(members.map(m => m.role))].length;

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handle invitation submission
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) {
      triggerToast('Please fill out all fields!', 'error');
      return;
    }
    
    // Simple email check
    if (!newMember.email.includes('@')) {
      triggerToast('Invalid email address!', 'error');
      return;
    }

    // Role colors mapping
    const avatarStyles = {
      'Super Admin': 'bg-purple-650/15 border-purple-550/20 text-neon-purple',
      'Admin': 'bg-neon-cyan/15 border-neon-cyan/20 text-neon-cyan',
      'Manager': 'bg-blue-500/15 border-blue-500/20 text-blue-400',
      'Accountant': 'bg-fuchsia-500/15 border-fuchsia-500/20 text-fuchsia-400',
      'Viewer': 'bg-emerald-500/15 border-emerald-500/20 text-emerald-450'
    };

    const newRow = {
      id: Date.now(),
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      status: 'Pending',
      lastActive: 'Never',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatarBg: avatarStyles[newMember.role] || 'bg-slate-500/15 border-slate-500/20 text-slate-400'
    };

    setMembers(prev => [...prev, newRow]);
    setIsInviteOpen(false);
    setNewMember({ name: '', email: '', role: 'Admin' });
    triggerToast(`Invitation sent to ${newRow.name}!`);
  };

  // Get initials for profile badge
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Handle member delete action
  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your team?`)) {
      setMembers(prev => prev.filter(m => m.id !== id));
      triggerToast(`${name} has been removed.`, 'error');
    }
  };

  // Handle member edit action
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setMembers(prev => prev.map(m => {
      if (m.id === selectedMember.id) {
        return { ...m, role: editRole, status: editStatus };
      }
      return m;
    }));
    setSelectedMember(null);
    setIsEditMode(false);
    triggerToast('Member settings updated!');
  };

  // Trigger export action
  const handleExport = () => {
    triggerToast('Exporting team list statement...');
  };

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">
      
      {/* Dynamic interactive toasts */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-float-1 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-neon-purple/10 border-neon-purple/30 text-white dark:bg-neon-cyan/10 dark:border-neon-cyan/30 dark:text-neon-cyan'}`}>
          <div className={`h-2 w-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-neon-purple dark:bg-neon-cyan'} animate-ping`}></div>
          <span className="font-bold tracking-wide text-sm font-mono">{toast.message}</span>
        </div>
      )}

      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-neon-purple/5 dark:bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>
      <div className="absolute bottom-1/4 -left-36 w-96 h-96 bg-neon-cyan/5 dark:bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none transition-all duration-300"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
              Team Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              Manage your team members, roles, and access levels
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Export button */}
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-400"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>Export</span>
            </button>

            {/* Invite Button */}
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]"
            >
              <PlusIcon className="w-5 h-5 stroke-[3]" />
              <span>Invite Member</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Metrics Card 1: Total Members */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Total Members</span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">{totalCount}</span>
                <span className="inline-block text-[11px] font-bold font-mono text-emerald-500 mt-2">+2 this month</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-50 text-neon-cyan dark:bg-neon-cyan/10 dark:shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                <UserGroupIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Metrics Card 2: Active Now */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-450 to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Active Now</span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">{activeCount}</span>
                <span className="inline-block text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 mt-2">Currently online</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-450 dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] relative">
                <CpuChipIcon className="w-6 h-6" />
                <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
              </div>
            </div>
          </div>

          {/* Metrics Card 3: Roles Defined */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Roles Defined</span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">{uniqueRoles}</span>
                <span className="inline-block text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 mt-2">Super Admin to Viewer</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:shadow-[0_0_15px_rgba(189,0,255,0.15)]">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Metrics Card 4: Pending Invites */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">Pending Invites</span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">{pendingCount}</span>
                <span className="inline-block text-[11px] font-bold font-mono text-amber-500 mt-2">Awaiting acceptance</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <EnvelopeIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* MAIN ALL MEMBERS TABULAR TABLE CARD */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65 transition-all duration-300"></div>

          {/* TABLE TOP ACTIONS: SEARCH & ROLE DROP */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">All Members</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-900 text-slate-550 border border-slate-200 dark:border-slate-800">
                {totalCount} total
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative group min-w-[240px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-neon-purple dark:group-focus-within:text-neon-cyan transition-colors">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50"
                />
              </div>

              {/* Roles Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-350 transition-all cursor-pointer min-w-[130px]"
                >
                  <span>{roleFilter}</span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${showRoleDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 z-40 w-44 rounded-2xl bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-xl py-2 animate-fade-in">
                    {['All Roles', 'Super Admin', 'Admin', 'Manager', 'Accountant', 'Viewer'].map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          setRoleFilter(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold font-mono hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors ${roleFilter === role ? 'text-neon-purple dark:text-neon-cyan bg-purple-50/20 dark:bg-neon-cyan/5' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABULAR MEMBER GRID */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50">
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Member</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Role</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Status</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Last Active</th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">Joined</th>
                  <th className="py-4 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-550 font-bold font-mono">
                      No matching team members found
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map(member => {
                    const initials = getInitials(member.name);
                    
                    // Dynamic styling tags for Roles
                    const roleBadgeStyles = {
                      'Super Admin': 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple dark:shadow-[0_0_8px_rgba(189,0,255,0.08)]',
                      'Admin': 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan dark:shadow-[0_0_8px_rgba(0,243,255,0.08)]',
                      'Manager': 'bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400',
                      'Accountant': 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-500 dark:text-fuchsia-400',
                      'Viewer': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    };

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors duration-250 group/row">
                        {/* Member avatar initials, name, and email */}
                        <td className="py-4 px-4 flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center border shadow-sm select-none ${member.avatarBg} dark:shadow-[0_0_10px_rgba(0,0,0,0.15)] group-hover/row:scale-105 transition-transform duration-300`}>
                            {initials}
                          </div>
                          <div>
                            <span className="block text-slate-850 dark:text-slate-100 font-bold text-sm group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors">
                              {member.name}
                            </span>
                            <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{member.email}</span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono border ${roleBadgeStyles[member.role] || 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            {member.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${
                              member.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                              member.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-455 dark:bg-slate-600'
                            }`} />
                            <span className={`text-xs font-bold font-mono ${
                              member.status === 'Active' ? 'text-emerald-600 dark:text-emerald-450' : 
                              member.status === 'Pending' ? 'text-amber-600 dark:text-amber-500' : 'text-slate-450 dark:text-slate-500'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        </td>

                        {/* Last Active */}
                        <td className="py-4 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                          {member.lastActive}
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                          {member.joined}
                        </td>

                        {/* Actions buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end items-center gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                            {/* View Action */}
                            <button 
                              onClick={() => {
                                setSelectedMember(member);
                                setEditRole(member.role);
                                setEditStatus(member.status);
                                setIsEditMode(false);
                              }}
                              className="text-slate-400 hover:text-neon-purple dark:text-slate-550 dark:hover:text-neon-cyan p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                              title="View Member details"
                            >
                              <EyeIcon className="w-4.5 h-4.5" />
                            </button>

                            {/* Edit Action */}
                            <button 
                              onClick={() => {
                                setSelectedMember(member);
                                setEditRole(member.role);
                                setEditStatus(member.status);
                                setIsEditMode(true);
                              }}
                              className="text-slate-400 hover:text-neon-purple dark:text-slate-550 dark:hover:text-neon-cyan p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                              title="Edit Member role"
                            >
                              <PencilIcon className="w-4.5 h-4.5" />
                            </button>

                            {/* Delete Action */}
                            <button 
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              className="text-slate-400 hover:text-red-500 dark:text-slate-550 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                              title="Remove Member"
                            >
                              <TrashIcon className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* BOTTOM GRID DETAIL CARDS: ACTIVE SESSIONS & ACTIVITY FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* CARD 1: ACTIVE CONNECTED DEVICES */}
          <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-40"></div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-50 text-neon-cyan dark:bg-neon-cyan/10 dark:shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                  <ComputerDesktopIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Active Sessions</h3>
              </div>
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-450 shadow-[0_0_8px_rgba(16,185,129,0.05)]">
                4 online
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Sarah Johnson', device: 'Chrome / Windows 11', ip: '192.168.1.15', active: true },
                { name: 'Marcus Lee', device: 'Safari / iPhone 15 Pro', ip: '172.56.21.90', active: true },
                { name: 'Priya Patel', device: 'Firefox / macOS Sequoia', ip: '82.165.99.124', active: true },
                { name: 'Aisha Okonkwo', device: 'Chrome / Ubuntu Linux', ip: '109.112.5.42', active: true }
              ].map((sess, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-550 dark:bg-slate-900 dark:text-slate-400 font-extrabold text-[10px] flex items-center justify-center">
                      {getInitials(sess.name)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{sess.name}</span>
                      <span className="block text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{sess.device} • {sess.ip}</span>
                    </div>
                  </div>
                  
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: RECENT TEAM ACTIVITY TIMELINE */}
          <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:shadow-[0_0_10px_rgba(189,0,255,0.1)]">
                <ClockIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Team Activity Feed</h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {[
                { user: 'Sarah Johnson', event: 'Approved invoice INV-005 records', time: '10 min ago' },
                { user: 'Marcus Lee', event: 'Modified global inventory settings', time: '1 hr ago' },
                { user: 'Dev Sharma', event: 'Accepted invitation as Accountant', time: '3 hrs ago' },
                { user: 'Priya Patel', event: 'Generated monthly statements reports', time: '5 hrs ago' },
                { user: 'Sarah Johnson', event: 'Added 12 items to catalog warehouse', time: 'Yesterday' }
              ].map((log, idx) => (
                <div key={idx} className="relative pl-6 border-l border-slate-200 dark:border-slate-850 pb-2 last:pb-0">
                  {/* Timeline point */}
                  <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-neon-purple dark:bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.6)]" />
                  
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">{log.user}</span>
                      <p className="text-[11px] font-mono text-slate-450 dark:text-slate-500 mt-0.5">{log.event}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-550 whitespace-nowrap">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL WINDOW 1: INVITE NEW MEMBER */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/40">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden ">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan"></div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">Invite Team Member</h3>
              <button 
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-550 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Member Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Member Email</label>
                <input
                  type="email"
                  placeholder="e.g. john@acmecorp.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-550 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">System Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Accountant</option>
                  {/* <option>Viewer</option> */}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: VIEW / EDIT MEMBER DETAILS */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/20 dark:bg-black/40">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden animate-float-1">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan"></div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Edit Access Level' : 'Member Details'}
              </h3>
              <button 
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-550 dark:hover:text-slate-300 dark:hover:bg-slate-900 cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {isEditMode ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60 mb-2">
                  <div className={`w-10 h-10 rounded-full font-extrabold text-sm flex items-center justify-center border ${selectedMember.avatarBg}`}>
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-slate-800 dark:text-slate-100">{selectedMember.name}</span>
                    <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{selectedMember.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">System Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Accountant</option>
                    <option>Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 font-sans text-sm font-medium">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900/60 mb-2">
                  <div className={`w-12 h-12 rounded-full font-extrabold text-base flex items-center justify-center border ${selectedMember.avatarBg}`}>
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <span className="block font-extrabold text-base text-slate-850 dark:text-slate-100">{selectedMember.name}</span>
                    <span className="block text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">{selectedMember.email}</span>
                  </div>
                </div>

                <div className="space-y-3.5 p-2 font-mono text-xs text-slate-650 dark:text-slate-400">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">ROLE LEVEL</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedMember.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">ACCOUNT STATUS</span>
                    <span className={`font-extrabold ${selectedMember.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {selectedMember.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">JOINED DATE</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedMember.joined}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="font-bold text-slate-400">LAST ACTIVE TIME</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedMember.lastActive}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 py-3 bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md text-center"
                  >
                    Edit Access Role
                  </button>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Management;
