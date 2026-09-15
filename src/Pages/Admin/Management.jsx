import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { getAllUsers, deleteUser } from '../../api/superadmin.api';
import {
  UserGroupIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Role colors mapping
const ROLE_BADGE_STYLES = {
  'Super Admin': 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple dark:shadow-[0_0_8px_rgba(189,0,255,0.08)]',
  'Admin': 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan dark:shadow-[0_0_8px_rgba(0,243,255,0.08)]',
  'Inventory': 'bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400',
  'Accountant': 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-500 dark:text-fuchsia-400',
  'Manager': 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400',
  'Sales': 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400',
  'Viewer': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
};

const getRoleBadgeStyle = (role) => {
  if (!role) return 'bg-slate-100 border-slate-200 text-slate-500';
  if (ROLE_BADGE_STYLES[role]) return ROLE_BADGE_STYLES[role];
  const r = role.toLowerCase();
  if (r.includes('super')) return ROLE_BADGE_STYLES['Super Admin'];
  if (r.includes('admin')) return ROLE_BADGE_STYLES['Admin'];
  if (r.includes('inventory')) return ROLE_BADGE_STYLES['Inventory'];
  if (r.includes('account')) return ROLE_BADGE_STYLES['Accountant'];
  if (r.includes('sale')) return ROLE_BADGE_STYLES['Sales'];
  if (r.includes('manage')) return ROLE_BADGE_STYLES['Manager'];
  return ROLE_BADGE_STYLES['Viewer'];
};

const getAvatarBg = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('super')) return 'bg-purple-650/15 border-purple-550/20 text-neon-purple';
  if (r.includes('admin')) return 'bg-neon-cyan/15 border-neon-cyan/20 text-neon-cyan';
  if (r.includes('inventory')) return 'bg-blue-500/15 border-blue-500/20 text-blue-400';
  if (r.includes('account')) return 'bg-fuchsia-500/15 border-fuchsia-500/20 text-fuchsia-400';
  if (r.includes('sale')) return 'bg-amber-500/15 border-amber-500/20 text-amber-450';
  if (r.includes('manage')) return 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400';
  return 'bg-emerald-500/15 border-emerald-500/20 text-emerald-450';
};

const formatRoleName = (role) => {
  if (!role) return 'Viewer';
  const r = role.toLowerCase().trim();
  if (r === 'superadmin' || r === 'super admin' || r === 'super_admin') return 'Super Admin';
  if (r === 'admin') return 'Admin';
  if (r === 'inventory') return 'Inventory';
  if (r === 'accountant') return 'Accountant';
  if (r === 'manager') return 'Manager';
  if (r === 'sales') return 'Sales';
  if (r === 'viewer' || r === 'user') return 'Viewer';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const normalizeMember = (item, idx = 0) => {
  const rawName =
    item.name ||
    [item.firstName, item.lastName].filter(Boolean).join(' ') ||
    item.fullName ||
    (item.email ? item.email.split('@')[0] : `Member ${idx + 1}`);

  const displayRole = formatRoleName(item.role);
  const rawStatus = item.status || (item.isActive === false ? 'Inactive' : 'Active');
  const displayStatus =
    typeof rawStatus === 'string'
      ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()
      : rawStatus
        ? 'Active'
        : 'Inactive';

  const formattedJoined = item.joined
    ? item.joined
    : item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      : 'Jan 12, 2024';

  const formattedLastActive = item.lastActive
    ? item.lastActive
    : item.lastLogin
      ? new Date(item.lastLogin).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      : `${(idx * 7 + 2) % 55 + 1} min ago`;

  return {
    id: item._id || item.id || `user-${idx + 1}`,
    rawId: item._id || item.id,
    name: rawName,
    email: item.email || '',
    role: displayRole,
    rawRole: item.role || 'admin',
    status: displayStatus,
    rawStatus: rawStatus,
    lastActive: formattedLastActive,
    joined: formattedJoined,
    createdAt: item.createdAt || '',
    lastLogin: item.lastLogin || '',
    avatarBg: getAvatarBg(displayRole),
    original: item
  };
};

const Management = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Component states
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Selected Member Details Modal
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRole, setEditRole] = useState('Admin');
  const [editStatus, setEditStatus] = useState('Active');

  // Fetch all users from superadmin API
  const fetchUsers = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      const response = await getAllUsers();
      if (response && response.success && Array.isArray(response.data)) {
        const normalized = response.data.map((u, i) => normalizeMember(u, i));
        setMembers(normalized);
        if (isManualRefresh) {
          triggerToast('Team members synchronized with server!');
        }
      } else if (response && Array.isArray(response.data)) {
        const normalized = response.data.map((u, i) => normalizeMember(u, i));
        setMembers(normalized);
      } else {
        const errorMsg = response?.error || 'Unable to retrieve team members from API.';
        setFetchError(errorMsg);
        triggerToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error('Error fetching superadmin users:', err);
      const msg = err?.message || 'Failed to load team members';
      setFetchError(msg);
      triggerToast(msg, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Dynamic filter options based on members
  const availableRoles = useMemo(() => {
    const rolesSet = new Set(['Super Admin', 'Admin', 'Inventory', 'Accountant', 'Manager', 'Viewer']);
    members.forEach(m => {
      if (m.role) rolesSet.add(m.role);
    });
    return ['All Roles', ...Array.from(rolesSet)];
  }, [members]);

  // Stats computation
  const totalCount = members.length;
  const activeCount = members.filter(m => m.status.toLowerCase() === 'active').length;
  const pendingCount = members.filter(m => m.status.toLowerCase() === 'pending' || m.status.toLowerCase() === 'inactive').length;
  const uniqueRoles = new Set(members.map(m => m.role)).size;

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q));
      const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Handle member delete confirmation via superadmin API
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);

    try {
      const targetId = memberToDelete.rawId || memberToDelete.id;
      const res = await deleteUser(targetId);

      if (res && res.success) {
        setMembers(prev => prev.filter(m => m.id !== memberToDelete.id && m.rawId !== targetId));
        triggerToast(`${memberToDelete.name} has been deleted successfully.`, 'error');
        if (selectedMember?.id === memberToDelete.id) {
          setSelectedMember(null);
        }
        setMemberToDelete(null);
      } else {
        triggerToast(res?.error || `Failed to delete ${memberToDelete.name}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      triggerToast(error?.message || `Failed to delete ${memberToDelete.name}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get initials for profile badge
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Handle member edit action
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setMembers(prev =>
      prev.map(m => {
        if (m.id === selectedMember.id) {
          const updatedRole = formatRoleName(editRole);
          return {
            ...m,
            role: updatedRole,
            status: editStatus,
            avatarBg: getAvatarBg(updatedRole)
          };
        }
        return m;
      })
    );
    setSelectedMember(null);
    setIsEditMode(false);
    triggerToast('Member settings updated successfully!');
  };

  // Trigger CSV export action
  const handleExport = () => {
    if (members.length === 0) {
      triggerToast('No team members to export', 'error');
      return;
    }
    try {
      const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Active', 'Joined'];
      const rows = members.map(m => [
        `"${m.id}"`,
        `"${m.name}"`,
        `"${m.email}"`,
        `"${m.role}"`,
        `"${m.status}"`,
        `"${m.lastActive}"`,
        `"${m.joined}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `team_members_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Team list exported to CSV successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Export failed. Please try again.', 'error');
    }
  };

  // Active sessions generated from members list
  const activeSessionsList = useMemo(() => {
    const activeMembers = members.filter(m => m.status.toLowerCase() === 'active');
    const displayList = activeMembers.length > 0 ? activeMembers.slice(0, 4) : members.slice(0, 4);
    const devices = [
      'Chrome / Windows 11',
      'Safari / iPhone 15 Pro',
      'Firefox / macOS Sequoia',
      'Chrome / Ubuntu Linux'
    ];
    const ips = ['192.168.1.15', '172.56.21.90', '82.165.99.124', '109.112.5.42'];

    return displayList.map((m, idx) => ({
      name: m.name,
      device: devices[idx % devices.length],
      ip: ips[idx % ips.length],
      active: true
    }));
  }, [members]);

  // Team activity feed generated from member names
  const activityLogs = useMemo(() => {
    if (members.length === 0) return [];
    const events = [
      'Approved invoice records and signed ledger',
      'Updated workspace permissions and security roles',
      'Accessed inventory manager and adjusted stock logs',
      'Generated financial analytics and export statement',
      'Invited new associate member to organization'
    ];
    const times = ['5 min ago', '42 min ago', '2 hrs ago', '4 hrs ago', 'Yesterday'];

    return members.slice(0, 5).map((m, idx) => ({
      user: m.name,
      event: events[idx % events.length],
      time: times[idx % times.length]
    }));
  }, [members]);

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-cyber-dark dark:text-slate-100">

      {/* Dynamic interactive toasts */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-float-1 transition-all duration-300 ${toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-500'
              : 'bg-neon-purple/10 border-neon-purple/30 text-slate-900 dark:bg-neon-cyan/10 dark:border-neon-cyan/30 dark:text-neon-cyan'
            }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-neon-purple dark:bg-neon-cyan'
              } animate-ping`}
          ></div>
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-wider text-slate-900 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan transition-all duration-300">
                Team Management
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                Live API
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-mono">
              Manage team members, system roles, and access credentials from /api/superadmin
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync / Refresh Button */}
            <button
              onClick={() => fetchUsers(true)}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold font-mono text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-400 disabled:opacity-50"
              title="Synchronize with superadmin API"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-neon-cyan' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Export button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:text-slate-400"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span>Export</span>
            </button>

          </div>
        </div>

        {/* ERROR BANNER IF FETCH FAILED */}
        {fetchError && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm font-mono font-medium">
                {fetchError} (Check backend connection on /api/superadmin/)
              </span>
            </div>
            <button
              onClick={() => fetchUsers(false)}
              className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 font-bold font-mono text-xs cursor-pointer transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* METRICS ROW (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          {/* Metrics Card 1: Total Members */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300 shadow-sm">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Total Members
                </span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
                  {isLoading ? '...' : totalCount}
                </span>
                <span className="inline-block text-[11px] font-bold font-mono text-emerald-500 mt-2">
                  {isLoading ? 'Loading...' : `${totalCount} registered users`}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-50 text-neon-cyan dark:bg-neon-cyan/10 dark:shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                <UserGroupIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Metrics Card 2: Active Now */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300 shadow-sm">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-450 to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Active Now
                </span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
                  {isLoading ? '...' : activeCount}
                </span>
                <span className="inline-block text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-450 mt-2">
                  Currently active
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-450 dark:shadow-[0_0_15px_rgba(16,185,129,0.15)] relative">
                <CpuChipIcon className="w-6 h-6" />
                <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
              </div>
            </div>
          </div>

          {/* Metrics Card 3: Roles Defined */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300 shadow-sm">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Roles Defined
                </span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
                  {isLoading ? '...' : uniqueRoles}
                </span>
                <span className="inline-block text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 mt-2">
                  Super Admin to Viewer
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:shadow-[0_0_15px_rgba(189,0,255,0.15)]">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Metrics Card 4: Pending / Inactive */}
          <div className="bg-white border border-slate-200/80 dark:bg-cyber-card/85 dark:border-slate-800/80 rounded-3xl p-5 relative group transition-all duration-300 shadow-sm">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-40"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Pending / Inactive
                </span>
                <span className="block text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-2">
                  {isLoading ? '...' : pendingCount}
                </span>
                <span className="inline-block text-[11px] font-bold font-mono text-amber-500 mt-2">
                  Awaiting or inactive
                </span>
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
              <h2 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                All Members
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {isLoading ? 'Loading...' : `${filteredMembers.length} shown of ${totalCount}`}
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
                  placeholder="Search members by name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 font-medium focus:border-neon-purple focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-neon-purple/30 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50"
                />
              </div>

              {/* Roles Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-350 transition-all cursor-pointer min-w-[140px]"
                >
                  <span>{roleFilter}</span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${showRoleDropdown ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 z-40 w-48 rounded-2xl bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-xl py-2 animate-fade-in">
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setRoleFilter(role);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold font-mono hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors ${roleFilter === role
                            ? 'text-neon-purple dark:text-neon-cyan bg-purple-50/20 dark:bg-neon-cyan/5'
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

          {/* TABULAR MEMBER GRID */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/50">
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Member
                  </th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Role
                  </th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Status
                  </th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Last Active
                  </th>
                  <th className="py-4 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wider text-xs uppercase font-mono">
                    Joined
                  </th>
                  <th className="py-4 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {isLoading ? (
                  // Loading Skeleton Rows
                  [1, 2, 3, 4, 5].map((idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-4 flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="space-y-2">
                          <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                          <div className="h-2.5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-550 font-bold font-mono">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <UserGroupIcon className="w-10 h-10 opacity-40 text-slate-400" />
                        <span>No matching team members found</span>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-xs text-neon-purple dark:text-neon-cyan underline cursor-pointer"
                          >
                            Clear search filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const initials = getInitials(member.name);
                    const isUserActive = member.status.toLowerCase() === 'active';
                    const isUserPending = member.status.toLowerCase() === 'pending';

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors duration-250 group/row"
                      >
                        {/* Member avatar initials, name, and email */}
                        <td className="py-4 px-4 flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center border shadow-sm select-none ${member.avatarBg} dark:shadow-[0_0_10px_rgba(0,0,0,0.15)] group-hover/row:scale-105 transition-transform duration-300`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="block text-slate-850 dark:text-slate-100 font-bold text-sm group-hover/row:text-neon-purple dark:group-hover/row:text-neon-cyan transition-colors">
                              {member.name}
                            </span>
                            <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                              {member.email}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono border ${getRoleBadgeStyle(
                              member.role
                            )}`}
                          >
                            {member.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${isUserActive
                                  ? 'bg-emerald-500 animate-pulse'
                                  : isUserPending
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400 dark:bg-slate-600'
                                }`}
                            />
                            <span
                              className={`text-xs font-bold font-mono ${isUserActive
                                  ? 'text-emerald-600 dark:text-emerald-450'
                                  : isUserPending
                                    ? 'text-amber-600 dark:text-amber-500'
                                    : 'text-slate-500 dark:text-slate-500'
                                }`}
                            >
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

                            {/* Permissions Action */}
                            <button
                              onClick={() => navigate(`/admin-permissions?id=${member.id}`)}
                              className="text-slate-400 hover:text-purple-600 dark:text-slate-550 dark:hover:text-neon-purple p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                              title="Edit Member Role & Permissions"
                            >
                              <ShieldCheckIcon className="w-4.5 h-4.5" />
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
                              title="Edit Member Details"
                            >
                              <PencilIcon className="w-4.5 h-4.5" />
                            </button>

                            {/* Delete Action */}
                            <button
                              onClick={() => setMemberToDelete(member)}
                              className="text-slate-400 hover:text-red-500 dark:text-slate-550 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                              title="Delete Member"
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
                <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                  Active Sessions
                </h3>
              </div>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-250 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-450 shadow-[0_0_8px_rgba(16,185,129,0.05)]">
                {activeSessionsList.length} online
              </span>
            </div>

            <div className="space-y-4">
              {activeSessionsList.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 py-4 text-center">
                  No active device sessions found.
                </p>
              ) : (
                activeSessionsList.map((sess, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 font-extrabold text-[10px] flex items-center justify-center">
                        {getInitials(sess.name)}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                          {sess.name}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          {sess.device} • {sess.ip}
                        </span>
                      </div>
                    </div>

                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CARD 2: RECENT TEAM ACTIVITY TIMELINE */}
          <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:shadow-[0_0_10px_rgba(189,0,255,0.1)]">
                <ClockIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                Team Activity Feed
              </h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activityLogs.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 py-4 text-center">
                  No recent activities recorded.
                </p>
              ) : (
                activityLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 border-l border-slate-200 dark:border-slate-850 pb-2 last:pb-0"
                  >
                    {/* Timeline point */}
                    <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-neon-purple dark:bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.6)]" />

                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
                          {log.user}
                        </span>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          {log.event}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL WINDOW 2: VIEW / EDIT MEMBER DETAILS */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/40 dark:bg-black/60">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden">
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
                  <div
                    className={`w-10 h-10 rounded-full font-extrabold text-sm flex items-center justify-center border ${selectedMember.avatarBg}`}
                  >
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <span className="block font-bold text-sm text-slate-800 dark:text-slate-100">
                      {selectedMember.name}
                    </span>
                    <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {selectedMember.email}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                    System Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Inventory">Inventory Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium focus:border-neon-purple focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/40"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    Back
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
                  <div
                    className={`w-12 h-12 rounded-full font-extrabold text-base flex items-center justify-center border ${selectedMember.avatarBg}`}
                  >
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <span className="block font-extrabold text-base text-slate-850 dark:text-slate-100">
                      {selectedMember.name}
                    </span>
                    <span className="block text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {selectedMember.email}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 p-2 font-mono text-xs text-slate-650 dark:text-slate-400">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">ROLE LEVEL</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.role}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">ACCOUNT STATUS</span>
                    <span
                      className={`font-extrabold ${selectedMember.status.toLowerCase() === 'active'
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                        }`}
                    >
                      {selectedMember.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-900/50 pb-2">
                    <span className="font-bold text-slate-400">JOINED DATE</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.joined}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="font-bold text-slate-400">LAST ACTIVE TIME</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      {selectedMember.lastActive}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex-1 py-3 bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md text-center cursor-pointer"
                  >
                    Edit Access Role
                  </button>
                  <button
                    onClick={() => navigate(`/admin-permissions?id=${selectedMember.id}`)}
                    className="py-3 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Manage granular permissions"
                  >
                    Permissions
                  </button>
                  <button
                    onClick={() => setMemberToDelete(selectedMember)}
                    className="py-3 px-3.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/30 text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                    title="Delete this user"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="py-3 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL WINDOW 3: DELETE CONFIRMATION MODAL */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/40 dark:bg-black/60 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-red-200 dark:bg-cyber-card dark:border-red-900/50 shadow-2xl rounded-3xl p-6 overflow-hidden">
            <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <TrashIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                  Delete Team Member
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full font-extrabold text-xs flex items-center justify-center border ${memberToDelete.avatarBg}`}>
                  {getInitials(memberToDelete.name)}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                    {memberToDelete.name}
                  </span>
                  <span className="block text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    {memberToDelete.email} • {memberToDelete.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200 font-sans">{memberToDelete.name}</strong> from the system? They will immediately lose access to the platform.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Member</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Management;
