import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { useAuth } from '../../Context/AuthContext';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  InformationCircleIcon,
  SparklesIcon,
  DocumentTextIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// ── Default Mock Team Members ──────────────────────────────────────────────────
const DEFAULT_MEMBERS = [
  {
    id: '2',
    name: 'Marcus Lee',
    email: 'marcus@acmecorp.com',
    role: 'Admin',
    status: 'Active',
    joined: 'Mar 5, 2024',
    avatarBg: 'bg-purple-100 text-purple-700 dark:bg-neon-purple/15 dark:text-neon-purple'
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya@acmecorp.com',
    role: 'Accountant',
    status: 'Active',
    joined: 'Apr 20, 2024',
    avatarBg: 'bg-cyan-100 text-cyan-700 dark:bg-neon-cyan/15 dark:text-neon-cyan'
  },
  {
    id: '4',
    name: 'Tom Rivera',
    email: 'tom@acmecorp.com',
    role: 'Sales',
    status: 'Suspended',
    joined: 'Feb 8, 2024',
    avatarBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
  },
  {
    id: '5',
    name: 'Aisha Okonkwo',
    email: 'aisha@acmecorp.com',
    role: 'Viewer',
    status: 'Active',
    joined: 'May 1, 2024',
    avatarBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
  },
  {
    id: '6',
    name: 'Dev Sharma',
    email: 'dev@acmecorp.com',
    role: 'Accountant',
    status: 'Invited',
    joined: 'May 27, 2026',
    avatarBg: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-400'
  }
];

// ── Roles Definition & Defaults ────────────────────────────────────────────────
const ROLE_DEFINITIONS = [
  {
    id: 'Admin',
    name: 'Admin',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-neon-purple/10 dark:text-neon-purple dark:border-neon-purple/30',
    description: 'Can manage most areas of the business, including team members, invoices, customers, and business settings.'
  },
  {
    id: 'Accountant',
    name: 'Accountant',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-neon-cyan/10 dark:text-neon-cyan dark:border-neon-cyan/30',
    description: 'Can manage invoices, payments, expenses, financial records, and reports.'
  },
  {
    id: 'Sales',
    name: 'Sales',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
    description: 'Can create and manage customers and invoices but has limited access to financial settings and team management.'
  },
  {
    id: 'Viewer',
    name: 'Viewer',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
    description: 'Can only view permitted business information and cannot create, edit, or delete records.'
  }
];

// ── Permission Modules & Schema ────────────────────────────────────────────────
const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Squares2X2Icon,
    description: 'Access to business overview, high-level metrics, and activity stream',
    permissions: [
      { id: 'dashboard_view', name: 'View Dashboard', isView: true }
    ]
  },
  {
    id: 'invoices',
    title: 'Invoices',
    icon: DocumentTextIcon,
    description: 'Manage client billing, create draft invoices, and track payments',
    permissions: [
      { id: 'invoices_view', name: 'View Invoices', isView: true },
      { id: 'invoices_create', name: 'Create Invoices', dependsOn: 'invoices_view' },
      { id: 'invoices_edit', name: 'Edit Invoices', dependsOn: 'invoices_view' },
      { id: 'invoices_delete', name: 'Delete Invoices', dependsOn: 'invoices_view' }
    ]
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: UsersIcon,
    description: 'Customer profiles, contact records, and client billing histories',
    permissions: [
      { id: 'customers_view', name: 'View Customers', isView: true },
      { id: 'customers_create', name: 'Create Customers', dependsOn: 'customers_view' },
      { id: 'customers_edit', name: 'Edit Customers', dependsOn: 'customers_view' },
      { id: 'customers_delete', name: 'Delete Customers', dependsOn: 'customers_view' }
    ]
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: CreditCardIcon,
    description: 'Payment records, reconciliation, and payment transaction logs',
    permissions: [
      { id: 'payments_view', name: 'View Payments', isView: true },
      { id: 'payments_create', name: 'Create Payments', dependsOn: 'payments_view' },
      { id: 'payments_edit', name: 'Edit Payments', dependsOn: 'payments_view' },
      { id: 'payments_delete', name: 'Delete Payments', dependsOn: 'payments_view' }
    ]
  },
  {
    id: 'expenses',
    title: 'Expenses',
    icon: BanknotesIcon,
    description: 'Business operational expenses, receipts, and vendor payments',
    permissions: [
      { id: 'expenses_view', name: 'View Expenses', isView: true },
      { id: 'expenses_create', name: 'Create Expenses', dependsOn: 'expenses_view' },
      { id: 'expenses_edit', name: 'Edit Expenses', dependsOn: 'expenses_view' },
      { id: 'expenses_delete', name: 'Delete Expenses', dependsOn: 'expenses_view' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: ChartBarIcon,
    description: 'Financial balance statements, profit & loss, and exportable analytics',
    permissions: [
      { id: 'reports_view', name: 'View Financial Reports', isView: true },
      { id: 'reports_export', name: 'Export Reports', dependsOn: 'reports_view' }
    ]
  },
  {
    id: 'team',
    title: 'Team Management',
    icon: UserGroupIcon,
    description: 'Staff member administration and role assignments',
    permissions: [
      { id: 'team_view', name: 'View Team Members', isView: true },
      { id: 'team_edit', name: 'Edit Team Members', dependsOn: 'team_view' },
      { id: 'team_remove', name: 'Remove Team Members', dependsOn: 'team_view' }
    ]
  },
  {
    id: 'settings',
    title: 'Business Settings',
    icon: Cog6ToothIcon,
    description: 'Company information, tax configurations, and payment gateways',
    permissions: [
      { id: 'settings_view', name: 'View Business Settings', isView: true },
      { id: 'settings_edit_profile', name: 'Edit Business Profile', dependsOn: 'settings_view' },
      { id: 'settings_gateways', name: 'Manage Payment Gateways', dependsOn: 'settings_view' }
    ]
  }
];

// ── Default Role Permissions Matrix ───────────────────────────────────────────
const ROLE_DEFAULT_PERMISSIONS = {
  Admin: {
    dashboard_view: true,
    invoices_view: true, invoices_create: true, invoices_edit: true, invoices_delete: true,
    customers_view: true, customers_create: true, customers_edit: true, customers_delete: true,
    payments_view: true, payments_create: true, payments_edit: true, payments_delete: true,
    expenses_view: true, expenses_create: true, expenses_edit: true, expenses_delete: true,
    reports_view: true, reports_export: true,
    team_view: true, team_edit: true, team_remove: true,
    settings_view: true, settings_edit_profile: true, settings_gateways: true
  },
  Accountant: {
    dashboard_view: true,
    invoices_view: true, invoices_create: true, invoices_edit: true, invoices_delete: false,
    customers_view: true, customers_create: false, customers_edit: false, customers_delete: false,
    payments_view: true, payments_create: true, payments_edit: true, payments_delete: false,
    expenses_view: true, expenses_create: true, expenses_edit: true, expenses_delete: true,
    reports_view: true, reports_export: true,
    team_view: false, team_edit: false, team_remove: false,
    settings_view: true, settings_edit_profile: false, settings_gateways: false
  },
  Sales: {
    dashboard_view: true,
    invoices_view: true, invoices_create: true, invoices_edit: true, invoices_delete: false,
    customers_view: true, customers_create: true, customers_edit: true, customers_delete: false,
    payments_view: true, payments_create: false, payments_edit: false, payments_delete: false,
    expenses_view: false, expenses_create: false, expenses_edit: false, expenses_delete: false,
    reports_view: false, reports_export: false,
    team_view: false, team_edit: false, team_remove: false,
    settings_view: false, settings_edit_profile: false, settings_gateways: false
  },
  Viewer: {
    dashboard_view: true,
    invoices_view: true, invoices_create: false, invoices_edit: false, invoices_delete: false,
    customers_view: true, customers_create: false, customers_edit: false, customers_delete: false,
    payments_view: true, payments_create: false, payments_edit: false, payments_delete: false,
    expenses_view: true, expenses_create: false, expenses_edit: false, expenses_delete: false,
    reports_view: true, reports_export: false,
    team_view: false, team_edit: false, team_remove: false,
    settings_view: false, settings_edit_profile: false, settings_gateways: false
  }
};

export default function Permissions() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Loading state simulation
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);

  // All team members loaded from localStorage or default
  const [membersList, setMembersList] = useState(() => {
    const saved = localStorage.getItem('invoiceflow_team_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse members', e);
      }
    }
    return DEFAULT_MEMBERS;
  });

  // Current selected member ID
  const selectedMemberId = searchParams.get('id') || membersList[0]?.id || '2';

  // Resolved Member
  const member = useMemo(() => {
    return membersList.find(m => String(m.id) === String(selectedMemberId));
  }, [membersList, selectedMemberId]);

  // Form states
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('Active');
  const [permissions, setPermissions] = useState(ROLE_DEFAULT_PERMISSIONS.Admin);

  // Baseline state for tracking unsaved changes
  const [baselineState, setBaselineState] = useState(null);

  // Trigger Toast helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initialize and load member data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (member) {
        const savedPermsKey = `invoiceflow_perms_${member.id}`;
        const savedPerms = localStorage.getItem(savedPermsKey);
        let activePerms = ROLE_DEFAULT_PERMISSIONS[member.role] || ROLE_DEFAULT_PERMISSIONS.Admin;
        
        if (savedPerms) {
          try {
            activePerms = { ...activePerms, ...JSON.parse(savedPerms) };
          } catch (e) {
            console.error('Failed to parse custom perms', e);
          }
        }

        setRole(member.role);
        setStatus(member.status);
        setPermissions(activePerms);

        setBaselineState({
          role: member.role,
          status: member.status,
          permissions: JSON.stringify(activePerms)
        });
      }
      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [selectedMemberId, member]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!baselineState) return false;
    return (
      baselineState.role !== role ||
      baselineState.status !== status ||
      baselineState.permissions !== JSON.stringify(permissions)
    );
  }, [baselineState, role, status, permissions]);

  // Check if current permissions deviate from the selected role's defaults
  const isCustomizedFromRole = useMemo(() => {
    const defaultForRole = ROLE_DEFAULT_PERMISSIONS[role] || {};
    for (const key in defaultForRole) {
      if (Boolean(permissions[key]) !== Boolean(defaultForRole[key])) {
        return true;
      }
    }
    return false;
  }, [role, permissions]);

  // Role selection change handler
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    const defaults = ROLE_DEFAULT_PERMISSIONS[newRole] || {};
    setPermissions({ ...defaults });
    triggerToast(`Applied default permissions for ${newRole} role.`);
  };

  // Reset to role defaults
  const handleResetToRoleDefaults = () => {
    const defaults = ROLE_DEFAULT_PERMISSIONS[role] || {};
    setPermissions({ ...defaults });
    triggerToast(`Permissions reset to ${role} defaults.`);
  };

  // Permission toggle handler with hierarchy logic
  const handleTogglePermission = (permId, isView, moduleDef) => {
    setPermissions(prev => {
      const currentVal = Boolean(prev[permId]);
      const nextVal = !currentVal;
      const updated = { ...prev, [permId]: nextVal };

      // Hierarchy Rule 1: If View permission is turned OFF, turn OFF all dependent permissions in this module
      if (isView && !nextVal) {
        moduleDef.permissions.forEach(p => {
          if (p.id !== permId) {
            updated[p.id] = false;
          }
        });
      }

      // Hierarchy Rule 2: If a Create/Edit/Delete permission is turned ON, automatically enable View permission
      if (!isView && nextVal) {
        const viewPerm = moduleDef.permissions.find(p => p.isView);
        if (viewPerm) {
          updated[viewPerm.id] = true;
        }
      }

      return updated;
    });
  };

  // Module level bulk toggle
  const handleToggleModuleAll = (moduleDef, enable) => {
    setPermissions(prev => {
      const updated = { ...prev };
      moduleDef.permissions.forEach(p => {
        updated[p.id] = enable;
      });
      return updated;
    });
  };

  // Save changes handler
  const handleSaveChanges = () => {
    if (!member) return;
    setIsSaving(true);

    setTimeout(() => {
      try {
        // Update member in members list
        const updatedList = membersList.map(m => {
          if (String(m.id) === String(member.id)) {
            return { ...m, role, status };
          }
          return m;
        });

        setMembersList(updatedList);
        localStorage.setItem('invoiceflow_team_members', JSON.stringify(updatedList));

        // Save permissions
        localStorage.setItem(`invoiceflow_perms_${member.id}`, JSON.stringify(permissions));

        // Update baseline
        setBaselineState({
          role,
          status,
          permissions: JSON.stringify(permissions)
        });

        setIsSaving(false);
        triggerToast('Team member updated successfully.');
      } catch (err) {
        setIsSaving(false);
        triggerToast('Failed to save changes. Please try again.', 'error');
      }
    }, 600);
  };

  // Suspended status toggle click with confirmation check
  const handleStatusSelect = (newStatus) => {
    if (newStatus === 'Suspended' && status !== 'Suspended') {
      setShowSuspendModal(true);
    } else {
      setStatus(newStatus);
    }
  };

  const confirmSuspend = () => {
    setStatus('Suspended');
    setShowSuspendModal(false);
    triggerToast(`${member?.name}'s account access will be suspended.`, 'error');
  };

  // Remove member handler
  const handleConfirmRemoveMember = () => {
    const updatedList = membersList.filter(m => String(m.id) !== String(member.id));
    setMembersList(updatedList);
    localStorage.setItem('invoiceflow_team_members', JSON.stringify(updatedList));
    localStorage.removeItem(`invoiceflow_perms_${member?.id}`);
    setShowRemoveModal(false);
    triggerToast(`${member?.name} has been removed from the team.`, 'error');
    setTimeout(() => {
      navigate('/business-management');
    }, 1200);
  };

  // Navigation interceptor for unsaved changes
  const handleSafeNavigate = (targetPath) => {
    if (hasUnsavedChanges) {
      setPendingNavigationPath(targetPath);
      setShowUnsavedModal(true);
    } else {
      navigate(targetPath);
    }
  };

  const handleDiscardAndNavigate = () => {
    setShowUnsavedModal(false);
    if (pendingNavigationPath) {
      navigate(pendingNavigationPath);
    } else {
      navigate('/business-management');
    }
  };

  // Initials generator
  const getInitials = (name) => {
    if (!name) return 'TM';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  // Status badge styling helper
  const renderStatusBadge = (s) => {
    switch (s) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'Invited':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <ClockIcon className="w-3.5 h-3.5 animate-pulse" />
            Invited
          </span>
        );
      case 'Suspended':
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
            <NoSymbolIcon className="w-3.5 h-3.5" />
            Suspended
          </span>
        );
      default:
        return <span className="text-xs font-mono text-slate-500">{s}</span>;
    }
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

      <div className="relative z-10 max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* =========================================================================
            BREADCRUMBS & TOP NAV
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Breadcrumb Navigation */}
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
              <button 
                onClick={() => handleSafeNavigate('/business-settings')} 
                className="hover:text-purple-600 dark:hover:text-neon-purple transition-colors cursor-pointer"
              >
                Settings
              </button>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <button 
                onClick={() => handleSafeNavigate('/business-management')} 
                className="hover:text-purple-600 dark:hover:text-neon-purple transition-colors cursor-pointer"
              >
                Team Management
              </button>
              <ChevronRightIcon className="w-3.5 h-3.5" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Edit Team Member</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Edit Team Member
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Manage this team member's role, permissions, and access to your business.
            </p>
          </div>

          {/* Back Button & Member Switcher */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSafeNavigate('/business-management')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-900 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Team</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            LOADING STATE SKELETON
           ========================================================================= */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            {/* Member Profile Skeleton */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 dark:bg-cyber-card/85 dark:border-slate-800/80 h-32 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/3"></div>
              </div>
            </div>
            {/* Role card skeleton */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 dark:bg-cyber-card/85 dark:border-slate-800/80 h-64"></div>
            {/* Permissions skeleton */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 dark:bg-cyber-card/85 dark:border-slate-800/80 h-96"></div>
          </div>
        ) : !member ? (
          /* =========================================================================
              EMPTY / NOT FOUND STATE
             ========================================================================= */
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center dark:bg-cyber-card/85 dark:border-slate-800/80 relative overflow-hidden shadow-sm">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40"></div>
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 mx-auto flex items-center justify-center mb-4">
              <UserCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              Team Member Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              The requested team member could not be found or may have been removed.
            </p>
            <button
              onClick={() => navigate('/business-management')}
              className="px-6 py-2.5 rounded-xl bg-neon-purple text-white font-bold text-xs hover:bg-neon-purple/90 transition-all shadow-md cursor-pointer"
            >
              Return to Team Management
            </button>
          </div>
        ) : (
          /* =========================================================================
              MAIN MEMBER PERMISSIONS CONTENT
             ========================================================================= */
          <div className="space-y-6 md:space-y-8">
            
            {/* ── CARD 1: TEAM MEMBER PROFILE CARD ─────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-6 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                {/* Left Profile Info */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center font-extrabold text-xl sm:text-2xl border shadow-sm ${member.avatarBg}`}>
                    {getInitials(member.name)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg sm:text-xl font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                        {member.name}
                      </h2>
                      {renderStatusBadge(status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-550 flex-shrink-0" />
                      <span>{member.email}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 dark:text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        Joined {member.joined}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheckIcon className="w-3.5 h-3.5 text-purple-600 dark:text-neon-purple" />
                        Role: <strong className="text-slate-700 dark:text-slate-300">{role}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Member Switcher Dropdown (for testing and quick switching) */}
                <div className="self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800/60">
                  <div className="text-right">
                    <span className="block text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1">
                      Switch Member
                    </span>
                    <select
                      value={member.id}
                      onChange={(e) => {
                        if (hasUnsavedChanges) {
                          if (window.confirm('You have unsaved changes. Discard them to switch members?')) {
                            setSearchParams({ id: e.target.value });
                          }
                        } else {
                          setSearchParams({ id: e.target.value });
                        }
                      }}
                      className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-200 focus:outline-none focus:border-neon-purple cursor-pointer"
                    >
                      {membersList.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* ── CARD 2: ROLE MANAGEMENT ───────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                    Role &amp; Access
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    Choose the team member's role. Their default permissions will be updated based on the selected role.
                  </p>
                </div>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLE_DEFINITIONS.map(r => {
                  const isSelected = role === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/50 dark:border-neon-purple dark:bg-neon-purple/10 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-950/20 dark:hover:bg-slate-900/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-wide">
                              {r.name}
                            </span>
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${r.badgeClass}`}>
                              {r.id.toUpperCase()}
                            </span>
                          </div>

                          {/* Radio Icon Indicator */}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-600 text-white dark:border-neon-purple dark:bg-neon-purple dark:text-slate-950'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}>
                            {isSelected && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CARD 3: CUSTOM PERMISSIONS ────────────────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>

              {/* Header with Customization indicator & Reset button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50 text-neon-purple dark:bg-neon-purple/10 dark:text-neon-purple">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                        Permissions
                      </h3>
                      {isCustomizedFromRole ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                          <SparklesIcon className="w-3 h-3 text-amber-500" />
                          CUSTOMIZED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          ROLE DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                      Customize what this team member can access. Permissions can be adjusted independently of their default role.
                    </p>
                  </div>
                </div>

                {isCustomizedFromRole && (
                  <button
                    type="button"
                    onClick={handleResetToRoleDefaults}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-300 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer self-start sm:self-auto border border-slate-200 dark:border-slate-700"
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                    <span>Reset to Role Defaults</span>
                  </button>
                )}
              </div>

              {/* Permission Modules List */}
              <div className="space-y-5">
                {PERMISSION_MODULES.map(module => {
                  const Icon = module.icon;
                  const viewPerm = module.permissions.find(p => p.isView);
                  const isViewEnabled = viewPerm ? Boolean(permissions[viewPerm.id]) : true;

                  const allModulePermsEnabled = module.permissions.every(p => Boolean(permissions[p.id]));
                  const someModulePermsEnabled = module.permissions.some(p => Boolean(permissions[p.id]));

                  return (
                    <div 
                      key={module.id} 
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 transition-colors"
                    >
                      {/* Module Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white text-purple-600 border border-slate-200 dark:bg-slate-900 dark:text-neon-purple dark:border-slate-800">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              {module.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Module Quick Select Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] font-mono">
                          <button
                            type="button"
                            onClick={() => handleToggleModuleAll(module, true)}
                            className="text-purple-600 dark:text-neon-purple hover:underline font-bold cursor-pointer"
                          >
                            Allow All
                          </button>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <button
                            type="button"
                            onClick={() => handleToggleModuleAll(module, false)}
                            className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                          >
                            Disable
                          </button>
                        </div>
                      </div>

                      {/* Permissions Rows Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {module.permissions.map(perm => {
                          const isEnabled = Boolean(permissions[perm.id]);
                          const isDependentDisabled = perm.dependsOn && !isViewEnabled;

                          return (
                            <div
                              key={perm.id}
                              onClick={() => {
                                if (!isDependentDisabled) {
                                  handleTogglePermission(perm.id, Boolean(perm.isView), module);
                                }
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                isDependentDisabled
                                  ? 'opacity-40 bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 cursor-not-allowed'
                                  : isEnabled
                                  ? 'bg-purple-50/40 border-purple-200 dark:bg-neon-purple/10 dark:border-neon-purple/30 cursor-pointer'
                                  : 'bg-white border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <span className={`block text-xs font-bold truncate ${
                                  isEnabled ? 'text-purple-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                  {perm.name}
                                </span>
                                {perm.isView && (
                                  <span className="text-[9px] font-mono text-purple-600 dark:text-neon-purple block mt-0.5 font-semibold uppercase tracking-wider">
                                    Base View Access
                                  </span>
                                )}
                              </div>

                              {/* Custom Toggle Switch */}
                              <div 
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                  isEnabled ? 'bg-purple-600 dark:bg-neon-purple' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                              >
                                <span 
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                                  }`} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* ── CARD 4: ACCOUNT ACCESS & DANGER ZONE ──────────────────────────── */}
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 dark:shadow-2xl rounded-3xl p-5 sm:p-7 relative transition-all duration-300">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40"></div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <NoSymbolIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide text-slate-900 dark:text-slate-100">
                    Account Access
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    Manage member active access status or revoke business membership
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Account Status Control */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Account Status
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Temporarily suspend this team member's access to the business dashboard.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusSelect('Active')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider border transition-all cursor-pointer ${
                        status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusSelect('Suspended')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider border transition-all cursor-pointer ${
                        status === 'Suspended'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Suspend Access
                    </button>
                  </div>
                </div>

                {/* Remove Team Member Destructive Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/30 dark:bg-red-950/10 border border-red-200/60 dark:border-red-900/30">
                  <div>
                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400">
                      Remove Team Member
                    </h4>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70 font-medium mt-0.5">
                      Removing this member will revoke their access to this business. This action may affect their ability to access business data.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowRemoveModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Remove Member</span>
                  </button>
                </div>

              </div>

            </div>

            {/* =========================================================================
                STICKY PAGE ACTIONS BAR
               ========================================================================= */}
            <div className="sticky bottom-4 z-40 bg-white/95 dark:bg-cyber-card/95 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                {hasUnsavedChanges ? (
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    You have unsaved changes
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    All changes saved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => handleSafeNavigate('/business-management')}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider transition-all shadow-md ${
                    !hasUnsavedChanges
                      ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none'
                      : isSaving
                      ? 'bg-neon-purple text-white opacity-80 cursor-wait'
                      : 'bg-neon-purple text-white hover:bg-neon-purple/90 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 cursor-pointer'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 stroke-[2.5]" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          SUSPENSION CONFIRMATION WARNING MODAL
         ========================================================================= */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Suspend Account Access?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Confirm temporary access restriction
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Are you sure you want to suspend access for <strong>{member?.name}</strong>? They will be immediately blocked from signing in or viewing any business records until reactivated.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmSuspend}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          REMOVE TEAM MEMBER CONFIRMATION MODAL
         ========================================================================= */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <TrashIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Remove Team Member?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Revoke membership permanently
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Are you sure you want to remove <strong>{member?.name}</strong> from your business? They will immediately lose access to your business data.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRemoveMember}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          UNSAVED CHANGES CONFIRMATION MODAL
         ========================================================================= */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60 animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 dark:bg-cyber-card dark:border-slate-800 shadow-2xl rounded-3xl p-6 overflow-hidden">
            <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Discard unsaved changes?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Confirm navigation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              You have unsaved changes. Are you sure you want to leave without saving them?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowUnsavedModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-neon-purple text-white font-extrabold text-xs tracking-wider transition-all shadow-md cursor-pointer"
              >
                Keep Editing
              </button>

              <button
                type="button"
                onClick={handleDiscardAndNavigate}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold font-mono tracking-wider text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}