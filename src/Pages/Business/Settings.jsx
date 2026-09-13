import { useEffect, useState } from "react";
import {
    getSettings,
    updateSettings,
} from "../../api/settings.service";

import {
    Cog6ToothIcon,
    DocumentTextIcon,
    ReceiptPercentIcon,
    CreditCardIcon,
    CubeIcon,
    BuildingOffice2Icon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getSettings();

                if (response.success) {
                    setSettings(response.settings);
                } else {
                    setError(
                        response.message || "Failed to load settings."
                    );
                }
            } catch (error) {
                setError(
                    error.message || "Failed to load settings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (section, field, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage("");
            setError("");

            const response = await updateSettings(settings);

            if (response.success) {
                setSettings(response.settings);
                setMessage("Settings saved successfully.");

                // Remove success message after a few seconds
                setTimeout(() => {
                    setMessage("");
                }, 4000);
            } else {
                setError(
                    response.message || "Failed to save settings."
                );
            }
        } catch (error) {
            setError(
                error.message || "Failed to save settings."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

                    <p className="text-sm text-gray-500">
                        Loading your settings...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !settings) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-8">
                <div className="mx-auto max-w-5xl rounded-xl border border-red-100 bg-red-50 p-6">
                    <div className="flex items-start gap-3">
                        <ExclamationCircleIcon className="h-6 w-6 shrink-0 text-red-500" />

                        <div>
                            <h2 className="font-semibold text-red-800">
                                Unable to load settings
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-8">
            <div className="mx-auto max-w-6xl">

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">

                    <div className="bg-purple-50 px-6 py-7 md:px-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                                    <Cog6ToothIcon className="h-6 w-6" />
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Settings
                                        </h1>

                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                            Business
                                        </span>
                                    </div>

                                    <p className="max-w-2xl text-sm leading-6 text-gray-600">
                                        Configure how InvoiceFlow handles
                                        invoices, receipts, payments,
                                        documents, and inventory for your
                                        business.
                                    </p>
                                </div>
                            </div>

                            <div className="hidden rounded-xl border border-purple-100 bg-white px-5 py-4 md:block">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Preferences
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    Business defaults
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* =====================================================
                    SUCCESS MESSAGE
                ====================================================== */}
                {message && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-5 py-4">
                        <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-600" />

                        <p className="text-sm font-medium text-green-700">
                            {message}
                        </p>
                    </div>
                )}

                {/* =====================================================
                    ERROR MESSAGE
                ====================================================== */}
                {error && settings && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4">
                        <ExclamationCircleIcon className="h-5 w-5 shrink-0 text-red-600" />

                        <p className="text-sm font-medium text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <div className="space-y-6">

                    {/* =================================================
                        INVOICE SETTINGS
                    ================================================== */}
                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5 md:px-7">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <DocumentTextIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Invoice Settings
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Set the default values used when
                                        creating invoices.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="p-6 md:p-7">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* Tax */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Tax Rate
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={
                                                settings.invoice.taxRate
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "invoice",
                                                    "taxRate",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            %
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        Default tax percentage applied to
                                        new invoices.
                                    </p>
                                </div>

                                {/* Discount */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Default Discount
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={
                                                settings.invoice.discountRate
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "invoice",
                                                    "discountRate",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            %
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        Default discount percentage for new
                                        invoices.
                                    </p>
                                </div>

                                {/* Payment Terms */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Payment Terms
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                settings.invoice.paymentTerms
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "invoice",
                                                    "paymentTerms",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            days
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-400">
                                        Number of days before an invoice
                                        becomes due.
                                    </p>
                                </div>

                                {/* Invoice Notes */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Default Invoice Note
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            settings.invoice.notes
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "invoice",
                                                "notes",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Thank you for your business."
                                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        RECEIPT SETTINGS
                    ================================================== */}
                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5 md:px-7">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <ReceiptPercentIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Receipt Settings
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Customize the default information
                                        shown on receipts.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="space-y-6 p-6 md:p-7">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Receipt Note
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        settings.receipt.notes
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "receipt",
                                            "notes",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Payment received with thanks."
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Receipt Footer
                                </label>

                                <textarea
                                    rows="4"
                                    value={
                                        settings.receipt.footer
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "receipt",
                                            "footer",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Thank you for shopping with us."
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                        </div>
                    </section>

                    {/* =================================================
                        DOCUMENT APPEARANCE
                    ================================================== */}
                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5 md:px-7">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <BuildingOffice2Icon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Document Appearance
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Choose what business information
                                        appears on invoices and other
                                        documents.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="p-6 md:p-7">
                            <div className="space-y-3">

                                {/* Logo */}
                                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/30">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Show business logo
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Display your business logo on
                                            generated documents.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            settings.document
                                                .showBusinessLogo
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "document",
                                                "showBusinessLogo",
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 accent-purple-600"
                                    />
                                </label>

                                {/* Address */}
                                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/30">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Show business address
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Display your registered business
                                            address.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            settings.document
                                                .showBusinessAddress
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "document",
                                                "showBusinessAddress",
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 accent-purple-600"
                                    />
                                </label>

                                {/* Phone */}
                                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/30">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Show business phone
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Display your business contact
                                            number.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            settings.document
                                                .showBusinessPhone
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "document",
                                                "showBusinessPhone",
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 accent-purple-600"
                                    />
                                </label>

                                {/* Email */}
                                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/30">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            Show business email
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Display your business email
                                            address.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            settings.document
                                                .showBusinessEmail
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "document",
                                                "showBusinessEmail",
                                                e.target.checked
                                            )
                                        }
                                        className="h-5 w-5 accent-purple-600"
                                    />
                                </label>

                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        PAYMENT INFORMATION
                    ================================================== */}
                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5 md:px-7">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <CreditCardIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Payment Information
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Add payment details that can appear
                                        on invoices.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="p-6 md:p-7">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* Bank */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Bank Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.payment.bankName
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "payment",
                                                "bankName",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Access Bank"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                                {/* Account Name */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Account Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            settings.payment.accountName
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "payment",
                                                "accountName",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. InvoiceFlow Technologies"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                                {/* Account Number */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Account Number
                                    </label>

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                            settings.payment.accountNumber
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "payment",
                                                "accountNumber",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter account number"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* =================================================
                        INVENTORY SETTINGS
                    ================================================== */}
                    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-6 py-5 md:px-7">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <CubeIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Inventory Settings
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Configure how InvoiceFlow manages
                                        your inventory.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="space-y-6 p-6 md:p-7">

                            {/* Low Stock */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Low Stock Threshold
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        settings.inventory
                                            .lowStockThreshold
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "inventory",
                                            "lowStockThreshold",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 md:max-w-md"
                                />

                                <div className="mt-3 rounded-xl bg-purple-50 p-4">
                                    <p className="text-sm font-medium text-purple-800">
                                        What does this mean?
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-purple-700">
                                        This is the number of units at which
                                        InvoiceFlow considers a product to be
                                        low in stock. For example, if you set
                                        this to <strong>5</strong>, products
                                        with 5 units or fewer remaining will
                                        be marked as low stock.
                                    </p>
                                </div>
                            </div>

                            {/* Negative Stock */}
                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 hover:bg-purple-50/30">
                                <div className="pr-6">
                                    <p className="text-sm font-medium text-gray-800">
                                        Allow negative stock
                                    </p>

                                    <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">
                                        Allow products to be sold even when
                                        the available inventory is insufficient.
                                        This may cause your inventory quantity
                                        to fall below zero.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={
                                        settings.inventory
                                            .allowNegativeStock
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "inventory",
                                            "allowNegativeStock",
                                            e.target.checked
                                        )
                                    }
                                    className="h-5 w-5 shrink-0 accent-purple-600"
                                />
                            </label>

                        </div>
                    </section>

                    {/* =================================================
                        SAVE BUTTON
                    ================================================== */}
                    <div className="flex justify-end pb-10">

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex min-w-[150px] items-center justify-center rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Saving...
                                </>
                            ) : (
                                "Save Settings"
                            )}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;