import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import api from "../../api/http";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);

  const [invoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");

  const [lineItems, setLineItems] = useState([
    {
      id: Date.now(),
      product: null,
      qty: 1,
      price: 0,
    },
  ]);

  const [productSearch, setProductSearch] = useState({});
  const [openProductDropdown, setOpenProductDropdown] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const customerDropdownRef = useRef(null);
  const productDropdownRefs = useRef({});

  /*
   * ---------------------------------------------------------
   * FETCH CUSTOMERS + PRODUCTS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [customerResponse, productResponse] = await Promise.all([
          api.get("/customers"),
          api.get("/inventory/get-products"),
        ]);

        setCustomers(customerResponse.customers || []);
        setProducts(productResponse.products || []);
      } catch (err) {
        console.error("Failed to load invoice data:", err);

        setError(
          err?.message ||
            "Unable to load customers and products. Please try again."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchInvoiceData();
  }, []);

  /*
   * ---------------------------------------------------------
   * CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target)
      ) {
        setCustomerOpen(false);
      }

      if (
        openProductDropdown !== null &&
        productDropdownRefs.current[openProductDropdown] &&
        !productDropdownRefs.current[openProductDropdown].contains(
          event.target
        )
      ) {
        setOpenProductDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProductDropdown]);

  /*
   * ---------------------------------------------------------
   * CUSTOMER SEARCH
   * ---------------------------------------------------------
   */

  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();

    if (!search) {
      return customers;
    }

    return customers.filter((item) => {
      return (
        item.displayName?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search)
      );
    });
  }, [customers, customerSearch]);

  /*
   * ---------------------------------------------------------
   * PRODUCT SEARCH
   * ---------------------------------------------------------
   */

  const getFilteredProducts = (itemId) => {
    const search = (productSearch[itemId] || "").trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search)
      );
    });
  };

  /*
   * ---------------------------------------------------------
   * LINE ITEM FUNCTIONS
   * ---------------------------------------------------------
   */

  const addLineItem = () => {
    const newId = Date.now() + Math.random();

    setLineItems((prev) => [
      ...prev,
      {
        id: newId,
        product: null,
        qty: 1,
        price: 0,
      },
    ]);
  };

  const removeLineItem = (id) => {
    setLineItems((prev) => {
      if (prev.length === 1) {
        return prev;
      }

      return prev.filter((item) => item.id !== id);
    });

    setProductSearch((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    if (openProductDropdown === id) {
      setOpenProductDropdown(null);
    }
  };

  const updateQuantity = (id, value) => {
    const quantity = Math.max(1, Number(value) || 1);

    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: quantity,
            }
          : item
      )
    );
  };

  const selectProduct = (itemId, product) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              product,
              price: Number(product.unitPrice || 0),
              qty: 1,
            }
          : item
      )
    );

    setProductSearch((prev) => ({
      ...prev,
      [itemId]: "",
    }));

    setOpenProductDropdown(null);
  };

  /*
   * ---------------------------------------------------------
   * TOTALS
   * ---------------------------------------------------------
   */

  const subtotal = useMemo(() => {
    return lineItems.reduce((total, item) => {
      if (!item.product) return total;

      return total + Number(item.qty) * Number(item.price);
    }, 0);
  }, [lineItems]);

  // Default InvoiceFlow tax rate.
  // Backend settings remain the final source of truth.
  const taxRate = 7.5;

  const discountRate = 0;

  const discount = subtotal * (discountRate / 100);

  const taxableAmount = subtotal - discount;

  const taxAmount = taxableAmount * (taxRate / 100);

  const totalAmount = taxableAmount + taxAmount;

  const itemsCount = lineItems.reduce((total, item) => {
    return total + (item.product ? Number(item.qty) : 0);
  }, 0);

  /*
   * ---------------------------------------------------------
   * FORMAT MONEY
   * ---------------------------------------------------------
   */

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");

  if (!customer) {
    setError("Please select a customer.");
    return;
  }

  if (!dueDate) {
    setError("Please select a due date.");
    return;
  }

  const incompleteItem = lineItems.some((item) => !item.product);

  if (incompleteItem) {
    setError("Please select a product for every invoice item.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      customer: customer._id,
      items: lineItems.map((item) => ({
        product: item.product._id,
        quantity: Number(item.qty),
      })),
      dueDate,
    };

    const response = await api.post("/invoices", payload);

    const createdInvoice = response.invoice;

    if (createdInvoice?._id) {
      navigate(`/business-view-invoices/${createdInvoice._id}`);
    }
  } catch (err) {
    console.error("Invoice creation error:", err);

    setError(
      err?.message ||
        "Unable to create invoice. Please check your information and try again."
    );
  } finally {
    setLoading(false);
  }
};
  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#faf9fc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#7c3aed]/20 border-t-[#7c3aed]" />
          <p className="text-sm text-gray-500">
            Preparing your invoice workspace...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#faf9fc] px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Create Invoice
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-[#7c3aed]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                Draft · Saved automatically
              </span>
            </div>

            <p className="mt-1.5 text-sm text-gray-500">
              Create a professional invoice for your customer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/business-invoices")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Manage Invoices
          </button>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-red-400 hover:text-red-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* =====================================================
            MAIN WORKSPACE
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_330px]">
            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="min-w-0 space-y-6">
              {/* ===============================================
                  INVOICE INFORMATION
              ================================================ */}

              <section className="rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                      <UserIcon className="h-5 w-5 text-[#7c3aed]" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Invoice Information
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Choose the customer and set the invoice dates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-5 md:grid-cols-3">
                    {/* CUSTOMER */}

                    <div
                      ref={customerDropdownRef}
                      className="relative md:col-span-2"
                    >
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Customer
                      </label>

                      <button
                        type="button"
                        onClick={() => setCustomerOpen((prev) => !prev)}
                        className={`flex w-full items-center justify-between rounded-xl border bg-white px-3.5 py-3 text-left transition ${
                          customerOpen
                            ? "border-[#7c3aed] ring-4 ring-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                            <UserIcon className="h-4.5 w-4.5 text-gray-500" />
                          </div>

                          {customer ? (
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {customer.displayName}
                              </p>

                              <p className="truncate text-xs text-gray-500">
                                {customer.email || customer.phone || "Customer"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Search and select a customer
                            </span>
                          )}
                        </div>

                        <ChevronDownIcon
                          className={`h-5 w-5 shrink-0 text-gray-400 transition ${
                            customerOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {customerOpen && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                          <div className="border-b border-gray-100 p-3">
                            <div className="relative">
                              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />

                              <input
                                autoFocus
                                type="text"
                                value={customerSearch}
                                onChange={(e) =>
                                  setCustomerSearch(e.target.value)
                                }
                                placeholder="Search customer..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#7c3aed] focus:bg-white"
                              />
                            </div>
                          </div>

                          <div className="max-h-64 overflow-y-auto p-1.5">
                            {filteredCustomers.length > 0 ? (
                              filteredCustomers.map((item) => {
                                const selected =
                                  customer?._id === item._id;

                                return (
                                  <button
                                    key={item._id}
                                    type="button"
                                    onClick={() => {
                                      setCustomer(item);
                                      setCustomerSearch("");
                                      setCustomerOpen(false);
                                    }}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-purple-50"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                                        {item.displayName
                                          ?.charAt(0)
                                          ?.toUpperCase()}
                                      </div>

                                      <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                          {item.displayName}
                                        </p>

                                        <p className="truncate text-xs text-gray-500">
                                          {item.email ||
                                            item.phone ||
                                            "No contact information"}
                                        </p>
                                      </div>
                                    </div>

                                    {selected && (
                                      <CheckIcon className="h-5 w-5 shrink-0 text-[#7c3aed]" />
                                    )}
                                  </button>
                                );
                              })
                            ) : (
                              <div className="px-4 py-8 text-center">
                                <UserIcon className="mx-auto h-8 w-8 text-gray-300" />

                                <p className="mt-2 text-sm font-medium text-gray-600">
                                  No customers found
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Try a different search.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* INVOICE DATE */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Invoice Date
                      </label>

                      <div className="relative">
                        <CalendarDaysIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                          type="date"
                          value={invoiceDate}
                          readOnly
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-600 outline-none"
                        />
                      </div>
                    </div>

                    {/* DUE DATE */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Due Date
                      </label>

                      <div className="relative">
                        <CalendarDaysIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                          type="date"
                          value={dueDate}
                          min={invoiceDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===============================================
                  INVOICE ITEMS
              ================================================ */}

              <section className="rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                      <CubeIcon className="h-5 w-5 text-[#7c3aed]" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">
                        Invoice Items
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Add the products or services being billed.
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {itemsCount} {itemsCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="p-6">
                  {/* TABLE HEADER */}

                  <div className="hidden grid-cols-[minmax(0,1fr)_90px_125px_125px_42px] gap-4 border-b border-gray-100 px-2 pb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
                    <span>Product</span>
                    <span>Quantity</span>
                    <span>Unit Price</span>
                    <span className="text-right">Amount</span>
                    <span />
                  </div>

                  {/* ITEMS */}

                  <div className="divide-y divide-gray-100">
                    {lineItems.map((item) => {
                      const lineTotal =
                        Number(item.qty || 0) * Number(item.price || 0);

                      const filteredProducts = getFilteredProducts(item.id);

                      return (
                        <div
                          key={item.id}
                          className="relative grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_90px_125px_125px_42px] md:items-center"
                        >
                          {/* PRODUCT */}

                          <div
                            ref={(element) => {
                              productDropdownRefs.current[item.id] =
                                element;
                            }}
                            className="relative"
                          >
                            <label className="mb-1.5 block text-xs font-medium text-gray-500 md:hidden">
                              Product
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenProductDropdown(
                                  openProductDropdown === item.id
                                    ? null
                                    : item.id
                                )
                              }
                              className={`flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-left transition ${
                                openProductDropdown === item.id
                                  ? "border-[#7c3aed] ring-4 ring-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                                  <CubeIcon className="h-4 w-4 text-gray-400" />
                                </div>

                                {item.product ? (
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-800">
                                      {item.product.name}
                                    </p>

                                    <p className="truncate text-[11px] text-gray-400">
                                      {item.product.sku} ·{" "}
                                      {item.product.quantity ?? 0} in stock
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    Search product...
                                  </span>
                                )}
                              </div>

                              <ChevronDownIcon
                                className={`h-4.5 w-4.5 shrink-0 text-gray-400 transition ${
                                  openProductDropdown === item.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {openProductDropdown === item.id && (
                              <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-30 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                                <div className="border-b border-gray-100 p-3">
                                  <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                                    <input
                                      autoFocus
                                      type="text"
                                      value={productSearch[item.id] || ""}
                                      onChange={(e) =>
                                        setProductSearch((prev) => ({
                                          ...prev,
                                          [item.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Search product or SKU..."
                                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#7c3aed] focus:bg-white"
                                    />
                                  </div>
                                </div>

                                <div className="max-h-64 overflow-y-auto p-1.5">
                                  {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => {
                                      const selected =
                                        item.product?._id === product._id;

                                      const stock = Number(
                                        product.quantity || 0
                                      );

                                      return (
                                        <button
                                          key={product._id}
                                          type="button"
                                          onClick={() =>
                                            selectProduct(
                                              item.id,
                                              product
                                            )
                                          }
                                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-purple-50"
                                        >
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                              {product.name}
                                            </p>

                                            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                                              <span>
                                                SKU: {product.sku}
                                              </span>

                                              <span>•</span>

                                              <span>
                                                {stock} in stock
                                              </span>
                                            </div>
                                          </div>

                                          <div className="ml-4 flex shrink-0 items-center gap-3">
                                            <span className="text-sm font-medium text-gray-700">
                                              {formatMoney(
                                                product.unitPrice
                                              )}
                                            </span>

                                            {selected && (
                                              <CheckIcon className="h-5 w-5 text-[#7c3aed]" />
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="px-4 py-8 text-center">
                                      <CubeIcon className="mx-auto h-8 w-8 text-gray-300" />

                                      <p className="mt-2 text-sm font-medium text-gray-600">
                                        No products found
                                      </p>

                                      <p className="mt-1 text-xs text-gray-400">
                                        Try searching by name or SKU.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* QUANTITY */}

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500 md:hidden">
                              Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) =>
                                updateQuantity(item.id, e.target.value)
                              }
                              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-50"
                            />
                          </div>

                          {/* UNIT PRICE */}

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500 md:hidden">
                              Unit Price
                            </label>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700">
                              {formatMoney(item.price)}
                            </div>
                          </div>

                          {/* LINE TOTAL */}

                          <div className="text-left md:text-right">
                            <label className="mb-1.5 block text-xs font-medium text-gray-500 md:hidden">
                              Amount
                            </label>

                            <p className="text-sm font-semibold text-gray-900">
                              {formatMoney(lineTotal)}
                            </p>
                          </div>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length === 1}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Remove item"
                          >
                            <TrashIcon className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD ITEM */}

                  <button
                    type="button"
                    onClick={addLineItem}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#7c3aed] transition hover:bg-purple-50"
                  >
                    <PlusIcon className="h-4.5 w-4.5" />
                    Add another product
                  </button>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDE — STICKY SUMMARY
            ================================================== */}

            <aside className="xl:sticky xl:top-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                {/* SUMMARY HEADER */}

                <div className="border-b border-gray-100 bg-gradient-to-br from-purple-50/80 to-white px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Invoice Summary
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Live calculation
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-purple-100">
                      <span className="text-sm font-bold text-[#7c3aed]">
                        ₦
                      </span>
                    </div>
                  </div>
                </div>

                {/* SUMMARY CONTENT */}

                <div className="px-6 py-5">
                  <div className="space-y-4">
                    {/* ITEMS */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Items
                      </span>

                      <span className="font-medium text-gray-800">
                        {itemsCount}
                      </span>
                    </div>

                    {/* SUBTOTAL */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-gray-800">
                        {formatMoney(subtotal)}
                      </span>
                    </div>

                    {/* DISCOUNT */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Discount
                      </span>

                      <span className="font-medium text-gray-800">
                        {discount > 0
                          ? `-${formatMoney(discount)}`
                          : formatMoney(0)}
                      </span>
                    </div>

                    {/* TAX */}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Tax ({taxRate}%)
                      </span>

                      <span className="font-medium text-gray-800">
                        {formatMoney(taxAmount)}
                      </span>
                    </div>
                  </div>

                  {/* DIVIDER */}

                  <div className="my-5 border-t border-dashed border-gray-200" />

                  {/* TOTAL */}

                  <div className="rounded-xl bg-gray-50 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Total
                      </span>

                      <span className="text-xl font-bold tracking-tight text-gray-900">
                        {formatMoney(totalAmount)}
                      </span>
                    </div>

                    <p className="mt-1 text-right text-[11px] text-gray-400">
                      Nigerian Naira (NGN)
                    </p>
                  </div>

                  {/* CUSTOMER STATUS */}

                  <div className="mt-5 rounded-xl border border-gray-100 px-4 py-3.5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-800">
                      {customer?.displayName || "No customer selected"}
                    </p>
                  </div>

                  {/* CREATE BUTTON */}

                  <button
                    type="submit"
                    disabled={loading || !customer || !dueDate}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6d28d9] focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating Invoice...
                      </>
                    ) : (
                      <>
                        Create Invoice
                        <span className="text-base">→</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
                    This invoice will be created as a draft and can be
                    reviewed before sending.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;