import React from "react";

const variantStyles = {
  default: "bg-[#8B7CF6] text-white hover:bg-[#9B8CFF] dark:bg-[#8B7CF6] dark:text-white dark:hover:bg-[#9B8CFF]",
  secondary: "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-[#1D2229] dark:text-[#F3F4F6] dark:border-[#272D35]",
  destructive: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/20",
  outline: "text-slate-700 border border-slate-200 dark:text-[#A1A7B0] dark:border-[#272D35]",

  // Specific domain badges requested by user
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/25",
  trial: "bg-amber-50 text-amber-700 border border-amber-200/80 font-medium dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/25",
  expired: "bg-rose-50 text-rose-700 border border-rose-200/80 font-medium dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/25",
  free: "bg-slate-100 text-slate-600 border border-slate-200 font-medium dark:bg-[#171B21] dark:text-[#A1A7B0] dark:border-[#272D35]",
  basic: "bg-slate-100 text-slate-700 border border-slate-300 font-semibold dark:bg-[#171B21] dark:text-[#F3F4F6] dark:border-[#272D35]",
  premium: "bg-gradient-to-r from-[#8B7CF6] to-indigo-600 text-white shadow-sm font-semibold dark:from-[#8B7CF6] dark:to-indigo-500",
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/25",
  pending: "bg-amber-50 text-amber-700 border border-amber-200/80 font-medium dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-500/25",
  failed: "bg-rose-50 text-rose-700 border border-rose-200/80 font-medium dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-500/25",
  monthly: "bg-purple-50 text-[#7C3AED] border border-purple-200/80 font-medium dark:bg-purple-950/30 dark:text-[#8B7CF6] dark:border-purple-500/25",
  yearly: "bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-semibold dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-500/25",
};

export function Badge({ className = "", variant = "default", children, ...props }) {
  const selectedStyle = variantStyles[variant.toLowerCase()] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B7CF6] focus:ring-offset-2 ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
