import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import api from "../../api/http";

const INVOICEFLOW_PURPLE = "#7C3AED";
const DARK = "#222222";
const MEDIUM_GRAY = "#555555";
const LIGHT_GRAY = "#F5F5F5";
const BORDER_GRAY = "#D1D5DB";

const formatNumber = (amount) => {
  return Number(amount || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatMoney = (amount, currency = "NGN") => {
  return `${currency} ${formatNumber(amount)}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getBusinessAddress = (business) => {
  if (!business?.address) return "";

  return [
    business.address.street,
    business.address.city,
    business.address.state,
    business.address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const SeeInvoices = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const businessAddress = useMemo(() => {
    return getBusinessAddress(invoice?.business);
  }, [invoice]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("1. Invoice ID:", id);
        console.log("2. Requesting:", `/invoices/${id}`);

        const response = await api.get(`/invoices/${id}`);

        console.log("3. Invoice response:", response);

        setInvoice(response.invoice);
      } catch (err) {
        console.error("4. Fetch invoice error:", err);

        setError(
          err?.message ||
            "Unable to load this invoice."
        );
      } finally {
        console.log("5. Finished fetching invoice");
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    } else {
      console.log("No invoice ID found");
      setLoading(false);
      setError("Invoice ID is missing.");
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const response = await api.get(`/invoices/${id}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${
        invoice?.invoiceNumber || id
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice PDF download error:", err);

      setError(
        err?.message ||
          "Unable to download the invoice PDF."
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-[#7C3AED] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center max-w-md w-full shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Unable to load invoice
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {error || "Invoice could not be found."}
          </p>

          <button
            onClick={() =>
              navigate("/business-invoices")
            }
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            .invoice-document,
            .invoice-document * {
              visibility: visible !important;
            }

            .no-print {
              display: none !important;
            }

            .invoice-preview-wrapper {
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
            }

            .invoice-document {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 53px !important;
              background: white !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

        {/* ACTION BAR */}
        <div className="no-print sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">

            <button
              onClick={() =>
                navigate("/business-invoices")
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#7C3AED] dark:hover:text-purple-400 transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Invoices
            </button>

            <div className="flex items-center gap-3">

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950 transition"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-60 transition"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />

                {downloading
                  ? "Downloading..."
                  : "Download PDF"}
              </button>

              <button
                disabled
                title="Email sending will be connected later"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium opacity-60 cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Send Invoice
              </button>

            </div>
          </div>
        </div>

        {/* PREVIEW AREA */}
        <main className="invoice-preview-wrapper py-10 px-6 bg-slate-50 dark:bg-slate-950">

          {/* INVOICE DOCUMENT — ALWAYS WHITE */}
          <div className="invoice-document mx-auto w-full max-w-[794px] min-h-[1123px] bg-white shadow-[0_8px_35px_rgba(0,0,0,0.08)] border border-slate-200 dark:border-slate-800 rounded-sm px-[53px] py-[53px]">

            {/* HEADER */}
            <header>
              <div className="flex items-start justify-between">

                <div>
                  <h1
                    className="font-bold tracking-tight"
                    style={{
                      color: INVOICEFLOW_PURPLE,
                      fontSize: "32px",
                      lineHeight: 1,
                    }}
                  >
                    INVOICEFLOW
                  </h1>

                  <p
                    className="mt-2 text-[12px]"
                    style={{ color: DARK }}
                  >
                    Business invoicing & management platform
                  </p>
                </div>

                <div
                  className="font-bold text-right"
                  style={{
                    color: INVOICEFLOW_PURPLE,
                    fontSize: "34px",
                    lineHeight: 1,
                  }}
                >
                  INVOICE
                </div>

              </div>

              <div
                className="mt-6"
                style={{
                  borderTop: `1px solid ${BORDER_GRAY}`,
                }}
              />
            </header>

            {/* MERCHANT + INVOICE INFORMATION */}
            <section className="mt-8 grid grid-cols-[1fr_230px] gap-10">

              <div>
                <p
                  className="font-bold text-[12px]"
                  style={{ color: DARK }}
                >
                  MERCHANT
                </p>

                <h2
                  className="mt-3 font-bold text-[16px]"
                  style={{ color: DARK }}
                >
                  {invoice.business?.name || "—"}
                </h2>

                {businessAddress && (
                  <p
                    className="mt-2 text-[11px] leading-5 max-w-[300px]"
                    style={{ color: MEDIUM_GRAY }}
                  >
                    {businessAddress}
                  </p>
                )}

                {invoice.business?.email && (
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: MEDIUM_GRAY }}
                  >
                    {invoice.business.email}
                  </p>
                )}

                {invoice.business?.contactNumber && (
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: MEDIUM_GRAY }}
                  >
                    {invoice.business.contactNumber}
                  </p>
                )}
              </div>

              <div className="space-y-4">

                <InfoRow
                  label="INVOICE NO"
                  value={invoice.invoiceNumber}
                />

                <InfoRow
                  label="ISSUE DATE"
                  value={formatDate(invoice.invoiceDate)}
                />

                <InfoRow
                  label="DUE DATE"
                  value={formatDate(invoice.dueDate)}
                />

              </div>
            </section>

            {/* CUSTOMER */}
            <section className="mt-10">

              <p
                className="font-bold text-[12px]"
                style={{ color: DARK }}
              >
                INVOICE TO
              </p>

              <h2
                className="mt-3 font-bold text-[16px]"
                style={{ color: DARK }}
              >
                {invoice.customer?.displayName || "—"}
              </h2>

              {invoice.customer?.email && (
                <p
                  className="mt-2 text-[11px]"
                  style={{ color: MEDIUM_GRAY }}
                >
                  {invoice.customer.email}
                </p>
              )}

              {invoice.customer?.phone && (
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: MEDIUM_GRAY }}
                >
                  {invoice.customer.phone}
                </p>
              )}

              {invoice.customer?.address && (
                <p
                  className="mt-1 text-[11px] max-w-[330px]"
                  style={{ color: MEDIUM_GRAY }}
                >
                  {invoice.customer.address}
                </p>
              )}

            </section>

            {/* PRODUCT TABLE */}
            <section className="mt-12">

              {/* TABLE HEADER */}
              <div
                className="grid grid-cols-[35px_1fr_55px_75px_85px] items-center h-[36px] px-3 rounded-t-md text-white text-[11px] font-bold"
                style={{
                  backgroundColor: INVOICEFLOW_PURPLE,
                }}
              >
                <span>NO</span>

                <span>DESCRIPTION</span>

                <span className="text-right">
                  QTY
                </span>

                <span className="text-right">
                  PRICE
                </span>

                <span className="text-right">
                  TOTAL
                </span>
              </div>

              {/* PRODUCT ITEMS */}
              <div
                style={{
                  minHeight: "220px",
                  borderBottom: `1px solid ${BORDER_GRAY}`,
                }}
              >
                {invoice.items?.map((item, index) => (
                  <div
                    key={`${item.product}-${index}`}
                    className="grid grid-cols-[35px_1fr_55px_75px_85px] items-center min-h-[36px] px-3 text-[11px]"
                    style={{
                      backgroundColor:
                        index % 2 === 1
                          ? LIGHT_GRAY
                          : "white",

                      borderBottom:
                        index !==
                        invoice.items.length - 1
                          ? `1px solid ${BORDER_GRAY}`
                          : "none",
                    }}
                  >
                    <span style={{ color: DARK }}>
                      {index + 1}
                    </span>

                    <div className="pr-3 min-w-0">
                      <p
                        className="font-medium truncate"
                        style={{ color: DARK }}
                      >
                        {item.productName}
                      </p>

                      {item.sku && (
                        <p
                          className="text-[9px] mt-0.5"
                          style={{
                            color: MEDIUM_GRAY,
                          }}
                        >
                          SKU: {item.sku}
                        </p>
                      )}
                    </div>

                    <span
                      className="text-right"
                      style={{ color: DARK }}
                    >
                      {item.quantity}
                    </span>

                    {/* PRICE — NO CURRENCY */}
                    <span
                      className="text-right"
                      style={{ color: DARK }}
                    >
                      {formatNumber(item.unitPrice)}
                    </span>

                    {/* LINE TOTAL — NO CURRENCY */}
                    <span
                      className="text-right font-medium"
                      style={{ color: DARK }}
                    >
                      {formatNumber(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* TOTALS */}
            <section className="mt-5">

              <div
                className="border-t"
                style={{
                  borderColor: BORDER_GRAY,
                }}
              />

              <div className="ml-auto w-[280px] pt-4">

                <TotalRow
                  label="Subtotal"
                  value={formatMoney(
                    invoice.subtotal,
                    invoice.currency
                  )}
                />

                {Number(invoice.discount || 0) > 0 && (
                  <TotalRow
                    label={`Discount${
                      Number(invoice.discountRate || 0) > 0
                        ? ` (${invoice.discountRate}%)`
                        : ""
                    }`}
                    value={`- ${formatMoney(
                      invoice.discount,
                      invoice.currency
                    )}`}
                  />
                )}

                {Number(invoice.taxAmount || 0) > 0 && (
                  <TotalRow
                    label={`Tax${
                      Number(invoice.taxRate || 0) > 0
                        ? ` (${invoice.taxRate}%)`
                        : ""
                    }`}
                    value={formatMoney(
                      invoice.taxAmount,
                      invoice.currency
                    )}
                  />
                )}

                <div
                  className="border-t mt-3 pt-3 flex items-center justify-between"
                  style={{
                    borderColor: BORDER_GRAY,
                  }}
                >
                  <span
                    className="font-bold text-[14px]"
                    style={{
                      color: INVOICEFLOW_PURPLE,
                    }}
                  >
                    TOTAL
                  </span>

                  <span
                    className="font-bold text-[14px]"
                    style={{
                      color: INVOICEFLOW_PURPLE,
                    }}
                  >
                    {formatMoney(
                      invoice.totalAmount,
                      invoice.currency
                    )}
                  </span>
                </div>

              </div>
            </section>

            {/* PAYMENT / NOTES */}
            <section className="mt-12 max-w-[350px]">

              <p
                className="font-bold text-[11px]"
                style={{ color: DARK }}
              >
                PAYMENT / NOTES
              </p>

              <p
                className="mt-3 text-[11px] leading-5"
                style={{ color: MEDIUM_GRAY }}
              >
                {invoice.notes ||
                  "Thank you for your business."}
              </p>

            </section>

            {/* FOOTER */}
            <footer className="mt-16 pt-4 border-t border-gray-300">

              <div className="flex items-center justify-between">

                <span
                  className="font-bold text-[10px]"
                  style={{
                    color: INVOICEFLOW_PURPLE,
                  }}
                >
                  INVOICEFLOW™
                </span>

                <span
                  className="text-[9px]"
                  style={{ color: MEDIUM_GRAY }}
                >
                  Powered by InvoiceFlow — Business
                  invoicing made simple.
                </span>

              </div>

            </footer>

          </div>
        </main>
      </div>
    </>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[85px_1fr] gap-3 text-[10px]">
    <span
      className="font-bold"
      style={{ color: DARK }}
    >
      {label}
    </span>

    <span
      className="text-right"
      style={{ color: MEDIUM_GRAY }}
    >
      {value || "—"}
    </span>
  </div>
);

const TotalRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 text-[11px]">
    <span style={{ color: MEDIUM_GRAY }}>
      {label}
    </span>

    <span
      className="font-medium"
      style={{ color: DARK }}
    >
      {value}
    </span>
  </div>
);

export default SeeInvoices;