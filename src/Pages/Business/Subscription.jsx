import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../Context/AuthContext";
import PaymentApi from "../../api/payment.api";

import {
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Users,
  Package,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  Download,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Landmark,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Shield,
  AlertTriangle,
  X
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";

export default function Subscription() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Active Plan from user context, defaulting to 'free'
  const activePlanKey = (currentUser?.subscriptionPlan || "free").toLowerCase();

  // Selected Plan for Upgrade/Switching ('free' | 'basic' | 'premium')
  const [selectedPlanKey, setSelectedPlanKey] = useState(activePlanKey);

  // Billing Cycle State: 'Monthly' | 'Yearly'
  const [billingCycle, setBillingCycle] = useState("Monthly");

  // Dynamic status based on user context
  const getStatus =
    currentUser?.subscriptionPlan === "free"
      ? "Trial"
      : currentUser?.subscriptionStatus
      ? "Active"
      : "Expired";

  const [previewStatus, setPreviewStatus] = useState(getStatus);

  // Payment Method for Checkout
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("card");

  // Saved Payment Methods State
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([
    {
      id: "pm_1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiry: "12/28",
      holderName: currentUser
        ? `${currentUser.name || currentUser.firstName || "Alex"} ${currentUser.lastName || "Morgan"}`.trim()
        : "Alex Morgan",
      isDefault: true,
      bank: "Access Bank"
    },
    {
      id: "pm_2",
      type: "card",
      brand: "Mastercard",
      last4: "8819",
      expiry: "09/27",
      holderName: currentUser
        ? `${currentUser.name || currentUser.firstName || "Alex"} ${currentUser.lastName || "Morgan"}`.trim()
        : "Alex Morgan",
      isDefault: false,
      bank: "GTBank"
    }
  ]);

  const [selectedCardId, setSelectedCardId] = useState("pm_1");

  // Phone & Payment States
  const [phone, setPhone] = useState(currentUser?.phone || currentUser?.phoneNumber || "");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);

  // Form State for Adding / Editing Cards
  const [newCard, setNewCard] = useState({
    holderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    bank: "First Bank",
    isDefault: false
  });

  // Complete Plan Definitions in Naira (NGN)
  const PLANS = {
    free: {
      key: "free",
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      badgeVariant: "free",
      tagline: "Essential starter package for solopreneurs & new businesses.",
      features: [
        "Up to 15 invoices per month",
        "1 admin team user account",
        "50 inventory product items",
        "Standard invoice PDF generation",
        "Basic email customer support",
        "Paystack & card payment link integration"
      ],
      usage: {
        invoices: { used: 8, max: 15 },
        members: { used: 1, max: 1 },
        inventory: { used: 32, max: 50 }
      }
    },
    basic: {
      key: "basic",
      name: "Basic",
      monthlyPrice: 15000,
      yearlyPrice: 150000, // 2 months free
      badgeVariant: "basic",
      tagline: "Standard operations & growth features for small business teams.",
      features: [
        "Up to 100 invoices per month",
        "Up to 5 team member accounts",
        "250 inventory product items",
        "Basic financial reports & audit trail",
        "Priority email & chat support",
        "Paystack & Stripe payment gateway",
        "Automated payment reminders"
      ],
      usage: {
        invoices: { used: 42, max: 100 },
        members: { used: 3, max: 5 },
        inventory: { used: 180, max: 250 }
      }
    },
    premium: {
      key: "premium",
      name: "Premium",
      monthlyPrice: 45000,
      yearlyPrice: 450000, // 2 months free
      badgeVariant: "premium",
      tagline: "Advanced automation, unlimited limits & priority support.",
      features: [
        "Unlimited invoices & receipts",
        "Up to 25 team member accounts",
        "5,000 inventory product items",
        "Advanced AI financial insights & audit logs",
        "24/7 Priority VIP support",
        "Custom branding & invoice templates",
        "Multi-currency & tax automation",
        "API access & webhooks integration"
      ],
      usage: {
        invoices: { used: 248, max: 1000 },
        members: { used: 12, max: 25 },
        inventory: { used: 1250, max: 5000 }
      }
    }
  };

  const selectedPlanDetails = PLANS[selectedPlanKey] || PLANS.basic;

  // Price calculations in Naira
  const unitPrice =
    billingCycle === "Yearly"
      ? selectedPlanDetails.yearlyPrice
      : selectedPlanDetails.monthlyPrice;
  const discount = billingCycle === "Yearly" ? Math.round(unitPrice * 0.15) : 0;
  const subtotal = Math.max(0, unitPrice - discount);
  const taxRate = 0.075;
  const taxAmount = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  // Payment History State (in Naira)
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "tx-101",
      date: "Aug 01, 2026",
      amount: "₦15,000.00",
      status: "Paid",
      reference: "PAY-84920193",
      method: "Visa •••• 4242"
    },
    {
      id: "tx-102",
      date: "Jul 01, 2026",
      amount: "₦15,000.00",
      status: "Paid",
      reference: "PAY-73910482",
      method: "Visa •••• 4242"
    },
    {
      id: "tx-103",
      date: "Jun 01, 2026",
      amount: "₦15,000.00",
      status: "Paid",
      reference: "PAY-62849102",
      method: "Mastercard •••• 8819"
    },
    {
      id: "tx-104",
      date: "May 15, 2026",
      amount: "₦45,000.00",
      status: "Pending",
      reference: "PAY-51930281",
      method: "Bank Transfer"
    },
    {
      id: "tx-105",
      date: "Apr 12, 2026",
      amount: "₦15,000.00",
      status: "Failed",
      reference: "PAY-40928174",
      method: "Visa •••• 4242"
    }
  ]);

  const [statusFilter, setStatusFilter] = useState("All");

  const filteredHistory = paymentHistory.filter((item) => {
    if (statusFilter === "All") return true;
    return item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Set card default
  const handleSetDefaultCard = (id) => {
    setSavedPaymentMethods(
      savedPaymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id
      }))
    );
    setSelectedCardId(id);
  };

  // Delete card
  const handleDeleteCard = (id) => {
    if (savedPaymentMethods.length <= 1) {
      alert("You must keep at least one payment method registered.");
      return;
    }
    const updated = savedPaymentMethods.filter((pm) => pm.id !== id);
    setSavedPaymentMethods(updated);
    if (selectedCardId === id) {
      setSelectedCardId(updated[0].id);
    }
  };

  // Save Card Handler
  const handleSaveCardSubmit = (e) => {
    e.preventDefault();
    const cleanNum = newCard.cardNumber.replace(/\s+/g, "");
    const last4 = cleanNum.slice(-4) || "9999";
    const brand = cleanNum.startsWith("4") ? "Visa" : cleanNum.startsWith("5") ? "Mastercard" : "Verve";

    if (editingCardId) {
      setSavedPaymentMethods(
        savedPaymentMethods.map((pm) =>
          pm.id === editingCardId
            ? {
                ...pm,
                holderName: newCard.holderName || pm.holderName,
                expiry: newCard.expiry || pm.expiry,
                last4: cleanNum.length >= 4 ? last4 : pm.last4,
                brand: brand
              }
            : pm
        )
      );
    } else {
      const newMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        brand: brand,
        last4: last4,
        expiry: newCard.expiry || "12/29",
        holderName: newCard.holderName || "Alex Morgan",
        isDefault: newCard.isDefault || savedPaymentMethods.length === 0,
        bank: newCard.bank || "Guaranty Trust Bank"
      };

      let updated = [...savedPaymentMethods];
      if (newMethod.isDefault) {
        updated = updated.map((pm) => ({ ...pm, isDefault: false }));
      }
      updated.push(newMethod);
      setSavedPaymentMethods(updated);
      setSelectedCardId(newMethod.id);
    }

    setNewCard({ holderName: "", cardNumber: "", expiry: "", cvv: "", bank: "First Bank", isDefault: false });
    setEditingCardId(null);
    setIsAddCardModalOpen(false);
  };

  const handleEditCard = (pm) => {
    setEditingCardId(pm.id);
    setNewCard({
      holderName: pm.holderName,
      cardNumber: `•••• •••• •••• ${pm.last4}`,
      expiry: pm.expiry,
      cvv: "•••",
      bank: pm.bank || "First Bank",
      isDefault: pm.isDefault
    });
    setIsAddCardModalOpen(true);
  };

  // Payment Execution & Backend Call
  const handlePaymentSubmit = async () => {
    try {
      setIsProcessingPayment(true);
      setPaymentError("");

      const res = await PaymentApi.initiatePayment({
        amount: totalAmount,
        subscriptionPlan: selectedPlanKey,
        subscriptionType: billingCycle.toLowerCase(),
        phone: phone || currentUser?.phone || currentUser?.phoneNumber || "",
        callbackUrl: window.location.href
      });

      if (!res || res.error) {
        setPaymentError(res?.error || 'An error occurred while processing your payment request. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      console.log("Payment initiation response:", res);

      const authUrl = res?.data?.authorization_url || res?.authorization_url || res?.data?.data?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setPaymentError("Payment initiation succeeded, but no authorization URL was returned.");
      }
      setIsProcessingPayment(false);
      return res;
    } catch (err) {
      console.warn("Backend payment API error:", err);
      setPaymentError(err?.message || "Payment initiation failed. Please verify network or credentials.");
      setIsProcessingPayment(false);
    }
  };

  const selectedCard = savedPaymentMethods.find((p) => p.id === selectedCardId) || savedPaymentMethods[0];

  return (
    <div className="relative min-h-screen p-4 sm:p-6 md:p-10 overflow-hidden font-sans select-none w-full transition-colors duration-200 bg-slate-50 text-slate-900 dark:bg-[#0B0D10] dark:text-[#F3F4F6]">
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
                Subscription Management
              </h1>
              <Badge variant={previewStatus.toLowerCase()}>
                {previewStatus}
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-[#A1A7B0] text-sm mt-1">
              Select plan packages (Free, Basic, Premium), manage billing cycles, stored payment cards, and Paystack transactions.
            </p>
          </div>

          {/* Status Preview Buttons */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#171B21] p-1.5 rounded-2xl border border-slate-200/80 dark:border-[#272D35] shadow-sm">
            <span className="text-xs text-slate-400 dark:text-[#6F7782] font-medium px-2">Status:</span>
            {["Active", "Trial", "Expired"].map((st) => (
              <button
                key={st}
                className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all ${
                  previewStatus === st
                    ? st === "Active"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : st === "Trial"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-rose-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-[#A1A7B0] hover:bg-slate-100 dark:hover:bg-[#1D2229]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ERROR DISPLAY BANNER */}
        {paymentError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-900/80 dark:text-rose-200 rounded-3xl p-4 flex items-center justify-between gap-4 shadow-sm animate-fade-in transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Subscription / Payment Notice</h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{paymentError}</p>
              </div>
            </div>
            <button
              onClick={() => setPaymentError("")}
              className="text-rose-500 hover:text-rose-800 dark:hover:text-rose-100 p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors font-bold text-sm flex-shrink-0"
              aria-label="Dismiss error"
              title="Dismiss error banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* THREE PLAN SELECTION PACKAGES IN NAIRA (Free, Basic, Premium) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(PLANS).map((plan) => {
            const isSelected = selectedPlanKey === plan.key;
            const isActiveUserPlan = activePlanKey === plan.key;
            const planPrice = billingCycle === "Yearly" ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.key}
                onClick={() => setSelectedPlanKey(plan.key)}
                className={`bg-white border shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 relative transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/40 dark:border-neon-cyan dark:ring-neon-cyan/40 dark:shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                    : "border-slate-200/80 hover:border-purple-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Top Ambient Glow Line */}
                <div className="absolute -top-[1px] left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={plan.badgeVariant}>{plan.name}</Badge>
                    {isActiveUserPlan && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-purple border border-purple-200 dark:border-neon-purple/30">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        ₦{planPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        / {billingCycle === "Yearly" ? "year" : "month"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {plan.tagline}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {plan.features.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanKey(plan.key);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all ${
                      isSelected
                        ? "bg-[#7C3AED] text-white shadow-md hover:bg-[#6D28D9] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isActiveUserPlan
                      ? "Active Plan"
                      : isSelected
                      ? "Selected for Checkout"
                      : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SECTION – Current Subscription Details (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative transition-all duration-300">
              
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

              {/* Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] dark:text-neon-cyan">
                    Subscription Overview
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                    Current Subscription
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedPlanDetails.badgeVariant}>
                    {selectedPlanDetails.name}
                  </Badge>
                  <Badge variant={billingCycle.toLowerCase()}>
                    {billingCycle}
                  </Badge>
                  <Badge variant={previewStatus.toLowerCase()}>
                    {previewStatus}
                  </Badge>
                </div>
              </div>

              {/* Price & Billing Cycle Selector */}
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      ₦{unitPrice.toLocaleString()}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      / {billingCycle === "Yearly" ? "year" : "month"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {billingCycle === "Yearly"
                      ? "Billed annually (Includes 20% discount)"
                      : "Billed monthly. Upgrade or cancel anytime."}
                  </p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <button
                    onClick={() => setBillingCycle("Monthly")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                      billingCycle === "Monthly"
                        ? "bg-white dark:bg-[#7C3AED] text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("Yearly")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      billingCycle === "Yearly"
                        ? "bg-[#7C3AED] text-white shadow-sm dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Yearly
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Renewal & Payment Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Renewal Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">September 15, 2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Next Payment Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">September 15, 2026</p>
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="py-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Included Features ({selectedPlanDetails.name} Plan)
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlanDetails.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
                {selectedPlanKey === "free" ? (
                  <button
                    onClick={() => setSelectedPlanKey("basic")}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all duration-200 active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Basic Plan (₦15,000/mo)
                  </button>
                ) : selectedPlanKey === "basic" ? (
                  <button
                    onClick={() => setSelectedPlanKey("premium")}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all duration-200 active:scale-[0.99]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Premium (₦45,000/mo)
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanKey("basic")}
                    className="flex-1 py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                  >
                    Switch to Basic Plan
                  </button>
                )}

                <button
                  onClick={() => setIsManageModalOpen(true)}
                  className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Manage Subscription
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT SECTION – Billing Summary & Payment Selection (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative transition-all duration-300">
              
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Order Summary
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Review selected plan details & payment method.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Order breakdown */}
              <div className="py-5 space-y-3 border-b border-slate-100 dark:border-slate-800/80 text-sm">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    Selected Package
                    <Badge variant={selectedPlanDetails.badgeVariant}>{selectedPlanDetails.name}</Badge>
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">₦{unitPrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-2">
                    Billing Cycle
                    <Badge variant={billingCycle.toLowerCase()}>{billingCycle}</Badge>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                    {billingCycle === "Yearly" ? "12 Months" : "1 Month"}
                  </span>
                </div>

                {billingCycle === "Yearly" && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Annual Discount (15%)</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>VAT / Tax (7.5%)</span>
                  <span>+₦{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Phone Number Input */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              {/* Select Active Payment Method for Checkout */}
              <div className="py-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Payment Method
                  </span>
                  <button
                    onClick={() => {
                      setEditingCardId(null);
                      setNewCard({ holderName: "", cardNumber: "", expiry: "", cvv: "", bank: "First Bank", isDefault: false });
                      setIsAddCardModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#7C3AED] dark:text-neon-cyan hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Card
                  </button>
                </div>

                {/* Cards Selector */}
                <div className="space-y-2">
                  {savedPaymentMethods.map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => {
                        setSelectedCardId(pm.id);
                        setCheckoutPaymentMethod("card");
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedCardId === pm.id && checkoutPaymentMethod === "card"
                          ? "border-[#7C3AED] bg-purple-50/50 dark:border-neon-cyan dark:bg-neon-cyan/10"
                          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {pm.brand === "Visa" ? "VISA" : "MC"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{pm.brand} ending in {pm.last4}</span>
                            {pm.isDefault && <Badge variant="active" className="text-[10px] py-0 px-1.5">Default</Badge>}
                          </p>
                          <p className="text-[11px] text-slate-500">Expires {pm.expiry} • {pm.holderName}</p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedCardId === pm.id && checkoutPaymentMethod === "card"
                          ? "border-[#7C3AED] bg-[#7C3AED] text-white dark:border-neon-cyan dark:bg-neon-cyan dark:text-slate-950"
                          : "border-slate-300"
                      }`}>
                        {selectedCardId === pm.id && checkoutPaymentMethod === "card" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}

                  {/* Alternative Payment Options */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setCheckoutPaymentMethod("transfer")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition-all ${
                        checkoutPaymentMethod === "transfer"
                          ? "border-[#7C3AED] bg-purple-50 dark:border-neon-cyan dark:bg-neon-cyan/10 text-[#7C3AED] dark:text-neon-cyan"
                          : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Bank Transfer</span>
                    </button>

                    <button
                      onClick={() => setCheckoutPaymentMethod("ussd")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition-all ${
                        checkoutPaymentMethod === "ussd"
                          ? "border-[#7C3AED] bg-purple-50 dark:border-neon-cyan dark:bg-neon-cyan/10 text-[#7C3AED] dark:text-neon-cyan"
                          : "border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>USSD Payment</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="py-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Amount Due
                  </span>
                  <p className="text-2xl font-extrabold text-[#7C3AED] dark:text-neon-cyan">
                    ₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                  NGN (₦) Currency
                </span>
              </div>

              {/* Single Button Pay */}
              <div className="pt-6 space-y-4">
                <button
                  onClick={() => handlePaymentSubmit()}
                  disabled={isProcessingPayment}
                  className="w-full py-4 px-6 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Pay ₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Secure instant payment powered by <strong>Paystack</strong>.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* SAVED PAYMENT METHODS MANAGEMENT SECTION */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative transition-all duration-300 space-y-6">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#7C3AED] dark:text-neon-cyan" />
                Saved Payment Methods
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Manage your stored cards, update expiration dates, or add new payment credentials.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCardId(null);
                setNewCard({ holderName: "", cardNumber: "", expiry: "", cvv: "", bank: "First Bank", isDefault: false });
                setIsAddCardModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 shadow-sm dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPaymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 relative overflow-hidden transition-all hover:border-purple-200 dark:hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-sm">
                      {pm.brand.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {pm.brand} ending in {pm.last4}
                      </h4>
                      <p className="text-xs text-slate-400">{pm.bank || "Registered Bank"}</p>
                    </div>
                  </div>

                  {pm.isDefault ? (
                    <Badge variant="active">Default Card</Badge>
                  ) : (
                    <button
                      onClick={() => handleSetDefaultCard(pm.id)}
                      className="text-xs text-slate-500 hover:text-[#7C3AED] dark:hover:text-neon-cyan font-bold underline"
                    >
                      Make Default
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Card Holder</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{pm.holderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Expires</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{pm.expiry}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditCard(pm)}
                      className="p-1.5 text-slate-500 hover:text-[#7C3AED] hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors"
                      title="Edit Card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(pm.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* USAGE SECTION */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative transition-all duration-300">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Resource Usage & Quotas
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Current month utilization across active platform features.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Plan Quota:</span>
              <Badge variant={selectedPlanDetails.badgeVariant}>{selectedPlanDetails.name}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* Usage Card 1: Invoices */}
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Invoices Used</span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedPlanDetails.usage.invoices.used} / {selectedPlanDetails.usage.invoices.max}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C3AED] dark:bg-neon-cyan rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedPlanDetails.usage.invoices.used / selectedPlanDetails.usage.invoices.max) * 100
                      )}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    {Math.round(
                      (selectedPlanDetails.usage.invoices.used / selectedPlanDetails.usage.invoices.max) * 100
                    )}% consumed
                  </span>
                  <span>{selectedPlanDetails.usage.invoices.max - selectedPlanDetails.usage.invoices.used} remaining</span>
                </div>
              </div>
            </div>

            {/* Usage Card 2: Team Members */}
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Team Members</span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedPlanDetails.usage.members.used} / {selectedPlanDetails.usage.members.max}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedPlanDetails.usage.members.used / selectedPlanDetails.usage.members.max) * 100
                      )}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    {Math.round(
                      (selectedPlanDetails.usage.members.used / selectedPlanDetails.usage.members.max) * 100
                    )}% filled
                  </span>
                  <span>{selectedPlanDetails.usage.members.max - selectedPlanDetails.usage.members.used} seats left</span>
                </div>
              </div>
            </div>

            {/* Usage Card 3: Inventory Items */}
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Inventory Items</span>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedPlanDetails.usage.inventory.used} / {selectedPlanDetails.usage.inventory.max}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedPlanDetails.usage.inventory.used / selectedPlanDetails.usage.inventory.max) * 100
                      )}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    {Math.round(
                      (selectedPlanDetails.usage.inventory.used / selectedPlanDetails.usage.inventory.max) * 100
                    )}% recorded
                  </span>
                  <span>{selectedPlanDetails.usage.inventory.max - selectedPlanDetails.usage.inventory.used} slots left</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PAYMENT HISTORY SECTION */}
        <div className="bg-white border border-slate-200/80 shadow-sm dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative transition-all duration-300 space-y-6">
          
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent dark:via-neon-cyan/50 opacity-60"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Payment History
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Recent billing transactions and invoice receipts.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {["All", "Paid", "Pending", "Failed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                    statusFilter === filter
                      ? "bg-white dark:bg-[#7C3AED] text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Simple List / Table View */}
          <div className="overflow-x-auto">
            <div className="min-w-[680px] divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Header row */}
              <div className="grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 px-3">
                <div className="col-span-3">Payment Date</div>
                <div className="col-span-3">Reference / Method</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {/* Rows */}
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center py-4 px-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 rounded-2xl transition-colors"
                  >
                    <div className="col-span-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {item.date}
                    </div>

                    <div className="col-span-3">
                      <p className="font-mono text-xs text-slate-900 dark:text-white font-semibold">{item.reference}</p>
                      <p className="text-[11px] text-slate-400">{item.method}</p>
                    </div>

                    <div className="col-span-2 font-bold text-slate-900 dark:text-white">
                      {item.amount}
                    </div>

                    <div className="col-span-2">
                      <Badge variant={item.status.toLowerCase()}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => alert(`Downloading receipt for transaction ${item.reference}`)}
                        className="p-2 text-slate-500 hover:text-[#7C3AED] dark:hover:text-neon-cyan hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-bold"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-slate-500">
                  No payment transactions found matching the selected filter.
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* MODAL: ADD / EDIT PAYMENT METHOD */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-neon-purple/20 text-[#7C3AED] dark:text-neon-cyan flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingCardId ? "Edit Payment Method" : "Add Payment Method"}
                  </h3>
                  <p className="text-xs text-slate-400">Stored securely with Paystack encryption</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCardSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4532 0000 0000 0000"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] font-mono"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Expiration Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY (e.g. 08/29)"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">CVV / Security Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED] font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Access Bank, GTBank, Zenith"
                  value={newCard.bank}
                  onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="set-default"
                  checked={newCard.isDefault}
                  onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <label htmlFor="set-default" className="text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer">
                  Set as default card for auto-renewal payments
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCardModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 transition-all"
                >
                  {editingCardId ? "Save Changes" : "Add Card"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}



      {/* MANAGE SUBSCRIPTION MODAL */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-cyber-card border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Manage Subscription</h3>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              You are currently on the <strong>{selectedPlanDetails.name} Package ({billingCycle})</strong>. You can manage stored payment cards, view billing receipts, or cancel auto-renewal.
            </p>

            <div className="space-y-2 text-sm">
              <button
                onClick={() => {
                  setIsManageModalOpen(false);
                  setIsAddCardModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between text-xs transition-colors"
              >
                <span>Add / Manage Payment Cards</span>
                <CreditCard className="w-4 h-4 text-[#7C3AED] dark:text-neon-cyan" />
              </button>

              <button
                onClick={() => {
                  setPreviewStatus("Expired");
                  setIsManageModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold flex items-center justify-between text-xs transition-colors"
              >
                <span>Cancel Subscription Auto-Renewal</span>
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsManageModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
