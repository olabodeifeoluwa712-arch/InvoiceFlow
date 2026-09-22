import React, { useState, useEffect, useCallback } from 'react';
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
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import businessApi, { getTeam, addTeam, removeTeam, updateTeam } from '../../api/team.api';

const management = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Toast notification state
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Preloaded mock database for Team Members
  const [members, setMembers] = useState([
    { id: 2, name: 'Marcus Lee', email: 'marcus@acmecorp.com', role: 'Admin', status: 'Active', lastActive: '15 min ago', joined: 'Mar 5, 2024', avatarBg: 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' },
    { id: 3, name: 'Priya Patel', email: 'priya@acmecorp.com', role: 'inventory', status: 'Active', lastActive: '1 hr ago', joined: 'Apr 20, 2024', avatarBg: 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300' },
    { id: 4, name: 'Tom Rivera', email: 'tom@acmecorp.com', role: 'Accountant', status: 'Inactive', lastActive: '3 days ago', joined: 'Feb 8, 2024', avatarBg: 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' },
    { id: 5, name: 'Aisha Okonkwo', email: 'aisha@acmecorp.com', role: 'Viewer', status: 'Active', lastActive: '30 min ago', joined: 'May 1, 2024', avatarBg: 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' },
    { id: 6, name: 'Dev Sharma', email: 'dev@acmecorp.com', role: 'Accountant', status: 'Pending', lastActive: 'Never', joined: 'May 27, 2026', avatarBg: 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch team members from team.api (/admin/team)
  const fetchTeamMembers = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const res = await getTeam();

      if (res && (res.status || res.success) && Array.isArray(res.data) && res.data.length > 0) {
        const avatarStyles = {
          'Super Admin': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
          'Admin': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
          'inventory': 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
          'Accountant': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
          'Viewer': 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
        };

        const formatted = res.data.map((item, idx) => ({
          id: item._id || item.id || idx + 1,
          name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || item.email?.split('@')[0] || `Member ${idx + 1}`,
          email: item.email || '',
          role: item.role || 'Admin',
          status: item.status || (item.isActive === false ? 'Inactive' : 'Active'),
          lastActive: item.lastActive || 'Recently',
          joined: item.joined || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 12, 2024'),
          avatarBg: avatarStyles[item.role] || 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
        }));

        setMembers(formatted);

        if (isManualRefresh) {
          triggerToast('Team members synchronized with team.api!');
        }
      } else if (isManualRefresh) {
        triggerToast('Team members list updated!');
      }
    } catch (err) {
      console.error('Failed to load team members from team.api:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [showPassword, setShowPassword] = useState(false);

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
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handle invitation submission via team.api
  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    if (!newMember.name.trim() || !newMember.email.trim() || !newMember.password.trim()) {
      triggerToast('Please fill out all fields including password!', 'error');
      return;
    }

    if (!newMember.email.includes('@')) {
      triggerToast('Invalid email address!', 'error');
      return;
    }

    if (newMember.password.length < 6) {
      triggerToast('Password must be at least 6 characters long!', 'error');
      return;
    }

    const avatarStyles = {
      'Super Admin': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
      'Admin': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
      'inventory': 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
      'Accountant': 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
      'Viewer': 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
    };

    const payload = {
      email: newMember.email.trim(),
      password: newMember.password,
      role: newMember.role,
      name: newMember.name.trim()
    };

    try {
      await addTeam(payload);
    } catch (err) {
      console.error('Failed to save to team.api:', err);
    }

    const newRow = {
      id: Date.now(),
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      status: 'Pending',
      lastActive: 'Never',
      joined: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      avatarBg:
        avatarStyles[newMember.role] ||
        'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
    };

    setMembers(prev => [newRow, ...prev]);
    setIsInviteOpen(false);
    setNewMember({ name: '', email: '', password: '', role: 'Admin' });
    setShowPassword(false);
    triggerToast(`Invitation sent to ${newRow.name} via team.api!`);
  };

  // Get initials for profile badge
  const getInitials = (name) => {
    const parts = name.split(' ');

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  // Handle member delete action via team.api
  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your team?`)) {
      try {
        await removeTeam({ id });
      } catch (err) {
        console.error('Failed to remove from team.api:', err);
      }

      setMembers(prev => prev.filter(m => m.id !== id));
      triggerToast(`${name} has been removed.`, 'error');
    }
  };

  // Handle member edit action via team.api
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (selectedMember) {
      try {
        await updateTeam({
          id: selectedMember.id,
          role: editRole,
          status: editStatus
        });
      } catch (err) {
        console.error('Failed to update team.api:', err);
      }

      setMembers(prev =>
        prev.map(m => {
          if (m.id === selectedMember.id) {
            return {
              ...m,
              role: editRole,
              status: editStatus
            };
          }

          return m;
        })
      );
    }

    setSelectedMember(null);
    setIsEditMode(false);
    triggerToast('Member settings updated via team.api!');
  };

  // Trigger export action
  const handleExport = () => {
    triggerToast('Exporting team list statement...');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 p-6 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:p-10 select-none">

      {/* Dynamic interactive toasts */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-xl transition-all duration-300 ${
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400'
              : 'border-purple-200 bg-purple-50 text-[#7C3AED] dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-400'
          }`}
        >
          <div
            className={`h-2 w-2 animate-ping rounded-full ${
              toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-[#7C3AED] dark:bg-purple-400'
            }`}
          ></div>

          <span className="font-mono text-sm font-bold tracking-wide">
            {toast.message}
          </span>
        </div>
      )}

      {/* Decorative Glow Blobs */}
      <div className="pointer-events-none absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-purple-100/40 blur-[120px] transition-all duration-300 dark:bg-purple-900/10"></div>
      <div className="pointer-events-none absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-purple-100/30 blur-[120px] transition-all duration-300 dark:bg-purple-900/10"></div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-6 md:space-y-8">

        {/* HEADER BLOCK */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <div className="flex items-center gap-3">

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Team Management
              </h1>

              <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-mono text-xs font-bold text-[#7C3AED] dark:border-purple-900/50 dark:bg-purple-900/30 dark:text-purple-400">
                Live API
              </span>

            </div>

            <p className="mt-1 text-sm font-mono text-slate-500 dark:text-slate-400">
              Manage your team members, roles, and access levels via team.api (/admin/team)
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Sync / Refresh Button */}
            <button
              onClick={() => fetchTeamMembers(true)}
              disabled={isLoading || isRefreshing}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs font-bold tracking-wider text-slate-600 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              title="Synchronize with team.api"
            >
              <ArrowPathIcon
                className={`h-4 w-4 ${
                  isRefreshing
                    ? 'animate-spin text-[#7C3AED] dark:text-purple-400'
                    : ''
                }`}
              />

              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Export button */}
            <button
              onClick={handleExport}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-mono font-bold tracking-wider text-slate-600 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-50 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span>Export</span>
            </button>

            {/* Invite Button */}
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 font-extrabold tracking-wider text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-[0.98]"
            >
              <PlusIcon className="h-5 w-5 stroke-[3]" />
              <span>Invite Member</span>
            </button>

          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">

          {/* Total Members */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="flex items-start justify-between">

              <div>
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total Members
                </span>

                <span className="mt-2 block font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {totalCount}
                </span>

                <span className="mt-2 inline-block font-mono text-[11px] font-bold text-emerald-500">
                  +2 this month
                </span>
              </div>

              <div className="rounded-2xl bg-purple-50 p-3 text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400">
                <UserGroupIcon className="h-6 w-6" />
              </div>

            </div>
          </div>

          {/* Active Now */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-emerald-200 dark:bg-emerald-900/50"></div>

            <div className="flex items-start justify-between">

              <div>
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Active Now
                </span>

                <span className="mt-2 block font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeCount}
                </span>

                <span className="mt-2 inline-block font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Currently online
                </span>
              </div>

              <div className="relative rounded-2xl bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400">

                <CpuChipIcon className="h-6 w-6" />

                <span className="absolute right-3.5 top-3.5 h-2 w-2 animate-ping rounded-full bg-emerald-500 dark:bg-emerald-400"></span>

              </div>

            </div>
          </div>

          {/* Roles Defined */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="flex items-start justify-between">

              <div>
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Roles Defined
                </span>

                <span className="mt-2 block font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {uniqueRoles}
                </span>

                <span className="mt-2 inline-block font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Super Admin to Viewer
                </span>
              </div>

              <div className="rounded-2xl bg-purple-50 p-3 text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>

            </div>
          </div>

          {/* Pending Invites */}
          <div className="group relative rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-amber-200 dark:bg-amber-900/50"></div>

            <div className="flex items-start justify-between">

              <div>
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Pending Invites
                </span>

                <span className="mt-2 block font-mono text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {pendingCount}
                </span>

                <span className="mt-2 inline-block font-mono text-[11px] font-bold text-amber-500">
                  Awaiting acceptance
                </span>
              </div>

              <div className="rounded-2xl bg-amber-50 p-3 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400">
                <EnvelopeIcon className="h-6 w-6" />
              </div>

            </div>
          </div>

        </div>

        {/* MAIN MEMBERS TABLE */}
        <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

          <div className="absolute left-10 right-10 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

          {/* TABLE TOP ACTIONS */}
          <div className="mb-6 flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                All Members
              </h2>

              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                {totalCount} total
              </span>

            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">

              {/* Search Bar */}
              <div className="group relative min-w-[240px]">

                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-[#7C3AED] dark:text-slate-500 dark:group-focus-within:text-purple-400">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </span>

                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-[#7C3AED] focus:outline-none focus:ring-1 focus:ring-purple-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                />

              </div>

              {/* Roles Dropdown */}
              <div className="relative">

                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex min-w-[130px] cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs font-bold tracking-wider text-slate-600 transition-all dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  <span>{roleFilter}</span>

                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      showRoleDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 z-40 mt-2 w-44 animate-fade-in rounded-2xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">

                    {['All Roles', 'Super Admin', 'Admin', 'inventory', 'Accountant', 'Viewer'].map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          setRoleFilter(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left font-mono text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          roleFilter === role
                            ? 'bg-purple-50 text-[#7C3AED] dark:bg-purple-900/20 dark:text-purple-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {role}
                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-left">

              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800">

                  <th className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Member
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Role
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Last Active
                  </th>

                  <th className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Joined
                  </th>

                  <th className="px-4 py-4 text-right"></th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredMembers.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center font-mono font-bold text-slate-400 dark:text-slate-500"
                    >
                      No matching team members found
                    </td>
                  </tr>

                ) : (

                  filteredMembers.map(member => {

                    const initials = getInitials(member.name);

                    const roleBadgeStyles = {
                      'Super Admin': 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
                      'Admin': 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
                      'inventory': 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
                      'Accountant': 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400',
                      'Viewer': 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                    };

                    return (
                      <tr
                        key={member.id}
                        className="group/row transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-950/50"
                      >

                        {/* Member */}
                        <td className="flex items-center gap-3.5 px-4 py-4">

                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-extrabold shadow-sm transition-transform duration-300 group-hover/row:scale-105 ${member.avatarBg}`}
                          >
                            {initials}
                          </div>

                          <div>

                            <span className="block text-sm font-bold text-slate-800 transition-colors group-hover/row:text-[#7C3AED] dark:text-slate-100 dark:group-hover/row:text-purple-400">
                              {member.name}
                            </span>

                            <span className="mt-0.5 block font-mono text-[11px] text-slate-400 dark:text-slate-500">
                              {member.email}
                            </span>

                          </div>

                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                              roleBadgeStyles[member.role] ||
                              'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {member.role}
                          </span>

                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5">

                            <span
                              className={`h-2 w-2 rounded-full ${
                                member.status === 'Active'
                                  ? 'animate-pulse bg-emerald-500'
                                  : member.status === 'Pending'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400 dark:bg-slate-600'
                              }`}
                            />

                            <span
                              className={`font-mono text-xs font-bold ${
                                member.status === 'Active'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : member.status === 'Pending'
                                    ? 'text-amber-600 dark:text-amber-500'
                                    : 'text-slate-500 dark:text-slate-500'
                              }`}
                            >
                              {member.status}
                            </span>

                          </div>

                        </td>

                        {/* Last Active */}
                        <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          {member.lastActive}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          {member.joined}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right">

                          <div className="flex items-center justify-end gap-3 opacity-0 transition-opacity duration-300 group-hover/row:opacity-100">

                            <button
                              onClick={() => {
                                setSelectedMember(member);
                                setEditRole(member.role);
                                setEditStatus(member.status);
                                setIsEditMode(false);
                              }}
                              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-[#7C3AED] dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              title="View Member details"
                            >
                              <EyeIcon className="h-4.5 w-4.5" />
                            </button>

                            <button
                              onClick={() => navigate(`/admin-permissions?id=${member.id}`)}
                              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-[#7C3AED] dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              title="Edit Member Role & Permissions"
                            >
                              <ShieldCheckIcon className="h-4.5 w-4.5" />
                            </button>

                            <button
                              onClick={() => navigate(`/admin-permissions?id=${member.id}`)}
                              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-[#7C3AED] dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-purple-400"
                              title="Edit Member Details"
                            >
                              <PencilIcon className="h-4.5 w-4.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-red-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-red-400"
                              title="Remove Member"
                            >
                              <TrashIcon className="h-4.5 w-4.5" />
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

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">

          {/* ACTIVE SESSIONS */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-10 right-10 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-purple-50 p-2 text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400">
                  <ComputerDesktopIcon className="h-5 w-5" />
                </div>

                <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                  Active Sessions
                </h3>

              </div>

              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
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

                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-950"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {getInitials(sess.name)}
                    </div>

                    <div>

                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        {sess.name}
                      </span>

                      <span className="mt-0.5 block font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {sess.device} • {sess.ip}
                      </span>

                    </div>

                  </div>

                  <span className="relative mr-2 flex h-2 w-2">

                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>

                  </span>

                </div>

              ))}

            </div>
          </div>

          {/* TEAM ACTIVITY */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-10 right-10 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-xl bg-purple-50 p-2 text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400">
                <ClockIcon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                Team Activity Feed
              </h3>

            </div>

            <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1">

              {[
                { user: 'Sarah Johnson', event: 'Approved invoice INV-005 records', time: '10 min ago' },
                { user: 'Marcus Lee', event: 'Modified global inventory settings', time: '1 hr ago' },
                { user: 'Dev Sharma', event: 'Accepted invitation as Accountant', time: '3 hrs ago' },
                { user: 'Priya Patel', event: 'Generated monthly statements reports', time: '5 hrs ago' },
                { user: 'Sarah Johnson', event: 'Added 12 items to catalog warehouse', time: 'Yesterday' }
              ].map((log, idx) => (

                <div
                  key={idx}
                  className="relative border-l border-slate-200 pb-2 pl-6 last:pb-0 dark:border-slate-800"
                >

                  <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-[#7C3AED] dark:bg-purple-400"></span>

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <span className="font-sans text-xs font-bold text-slate-800 dark:text-slate-200">
                        {log.user}
                      </span>

                      <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-500">
                        {log.event}
                      </p>

                    </div>

                    <span className="whitespace-nowrap font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      {log.time}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          </div>

        </div>

      </div>

      {/* INVITE NEW MEMBER MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-md dark:bg-black/40">

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="mb-6 flex items-center justify-between">

              <h3 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                Invite Team Member
              </h3>

              <button
                onClick={() => setIsInviteOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">

              <div>

                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Member Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember(prev => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  required
                />

              </div>

              <div>

                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Member Email
                </label>

                <input
                  type="email"
                  placeholder="e.g. john@acmecorp.com"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember(prev => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  required
                />

              </div>

              <div>

                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Member Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Set account password"
                    value={newMember.password}
                    onChange={(e) =>
                      setNewMember(prev => ({
                        ...prev,
                        password: e.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                </div>
              </div>

              <div>

                <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  System Role
                </label>

                <select
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember(prev => ({
                      ...prev,
                      role: e.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                >
                  <option value="inventory">Inventory Manager</option>
                  <option value="accountant">Accountant</option>
                </select>

              </div>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 font-mono text-xs font-bold tracking-wider text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-[#7C3AED] py-3 text-xs font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-[#6D28D9] disabled:opacity-50"
                >
                  Send Invitation
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW / EDIT MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-md dark:bg-black/40">

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

            <div className="absolute left-8 right-8 top-0 h-px bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="mb-6 flex items-center justify-between">

              <h3 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Edit Access Level' : 'Member Details'}
              </h3>

              <button
                onClick={() => setSelectedMember(null)}
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

            </div>

            {isEditMode ? (

              <form onSubmit={handleSaveEdit} className="space-y-4">

                <div className="mb-2 flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">

                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-extrabold ${selectedMember.avatarBg}`}>
                    {getInitials(selectedMember.name)}
                  </div>

                  <div>
                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                      {selectedMember.name}
                    </span>

                    <span className="mt-0.5 block font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {selectedMember.email}
                    </span>
                  </div>

                </div>

                <div>

                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    System Role
                  </label>

                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  >
                    <option>Admin</option>
                    <option>inventory</option>
                    <option>Accountant</option>
                    <option>Viewer</option>
                  </select>

                </div>

                <div>

                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Account Status
                  </label>

                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition-all focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-purple-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-purple-500 dark:focus:ring-purple-900/30"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Pending</option>
                  </select>

                </div>

                <div className="flex gap-3 pt-4">

                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 font-mono text-xs font-bold tracking-wider text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#7C3AED] py-3 text-xs font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-[#6D28D9]"
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            ) : (

              <div className="space-y-4 font-sans text-sm font-medium">

                <div className="mb-2 flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border text-base font-extrabold ${selectedMember.avatarBg}`}>
                    {getInitials(selectedMember.name)}
                  </div>

                  <div>
                    <span className="block text-base font-extrabold text-slate-800 dark:text-slate-100">
                      {selectedMember.name}
                    </span>

                    <span className="mt-0.5 block font-mono text-xs text-slate-400 dark:text-slate-500">
                      {selectedMember.email}
                    </span>
                  </div>

                </div>

                <div className="space-y-3.5 p-2 font-mono text-xs text-slate-500 dark:text-slate-400">

                  <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="font-bold text-slate-400">ROLE LEVEL</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.role}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="font-bold text-slate-400">ACCOUNT STATUS</span>

                    <span
                      className={`font-extrabold ${
                        selectedMember.status === 'Active'
                          ? 'text-emerald-500'
                          : 'text-slate-500'
                      }`}
                    >
                      {selectedMember.status}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="font-bold text-slate-400">JOINED DATE</span>

                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.joined}
                    </span>
                  </div>

                  <div className="flex justify-between pb-1">

                    <span className="font-bold text-slate-400">
                      LAST ACTIVE TIME
                    </span>

                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.lastActive}
                    </span>

                  </div>

                </div>

                <div className="flex gap-3 pt-4">

                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 rounded-xl bg-[#7C3AED] py-3 text-center text-xs font-extrabold tracking-wider text-white shadow-md transition-all hover:bg-[#6D28D9]"
                  >
                    Edit Access Role
                  </button>

                  <button
                    onClick={() => setSelectedMember(null)}
                    className="flex-1 rounded-xl border border-slate-200 py-3 font-mono text-xs font-bold tracking-wider text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
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

export default management;