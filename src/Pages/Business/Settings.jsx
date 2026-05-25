import React from "react";

const inputClassName =
  "h-[62px] w-full rounded-[17px] border border-[#DDE2EA] bg-[#F8FAFC] px-[18px] text-[#020617] outline-none transition-colors duration-300 focus:border-[#7C1FFF] focus:ring-1 focus:ring-[#7C1FFF]/25 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-neon-cyan/80 dark:focus:ring-neon-cyan/50";

const labelClassName = "flex flex-col gap-2.5";
const cardClassName =
  "relative max-w-[1008px] overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.10)] transition-all duration-300 dark:border-slate-800/80 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:shadow-2xl";
const glowLineClassName =
  "absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-40 transition-all duration-300 dark:via-neon-cyan dark:opacity-65";

const Settings = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] px-[22px] py-[30px] font-sans text-[15px] text-[#020617] transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100">
      <div className="absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-purple/10"></div>
      <div className="absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-cyan/10"></div>

      <header className="relative z-10 mb-8">
        <h1 className="m-0 font-extrabold leading-tight text-slate-900 transition-all duration-300 dark:bg-gradient-to-r dark:from-neon-cyan dark:via-slate-100 dark:to-neon-purple dark:bg-clip-text dark:text-transparent dark:text-glow-cyan">
          Settings
        </h1>
        <p className="mt-1 mb-0 leading-[1.35] text-[#99A1AF] dark:text-slate-400">
          Manage your account and invoice preferences
        </p>
      </header>

      <div className="relative z-10 flex flex-col gap-7">
        <section className={cardClassName}>
          <div className={glowLineClassName}></div>
          <div className="px-[30px] pt-6 pb-[25px]">
            <h2 className="m-0 font-extrabold leading-tight text-slate-900 dark:text-slate-100">Business Profile</h2>
            <p className="mt-1 mb-0 leading-[1.45] text-[#8E97AA] dark:text-slate-500">
              Your company information used on invoices and receipts.
            </p>
          </div>

          <hr className="m-0 border-0 border-t border-[#EEF0F4] dark:border-slate-800/60" />

          <form className="px-[30px] pt-7 pb-[30px]">
            <div className="grid grid-cols-1 gap-x-6 gap-y-[22px] md:grid-cols-2">
              <label className={labelClassName} htmlFor="business-name">
                <span className="font-medium text-slate-700 dark:text-slate-300">Business Name</span>
                <input
                  id="business-name"
                  name="businessName"
                  type="text"
                  defaultValue="Acme Corp"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="business-email">
                <span className="font-medium text-slate-700 dark:text-slate-300">Business Email</span>
                <input
                  id="business-email"
                  name="businessEmail"
                  type="email"
                  defaultValue="billing@acmecorp.com"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="tax-id">
                <span className="font-medium text-slate-700 dark:text-slate-300">Tax ID / EIN</span>
                <input
                  id="tax-id"
                  name="taxId"
                  type="text"
                  defaultValue="12-3456789"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="business-address">
                <span className="font-medium text-slate-700 dark:text-slate-300">Business Address</span>
                <input
                  id="business-address"
                  name="businessAddress"
                  type="text"
                  defaultValue="123 Market St, San Francisco, CA 94103"
                  className={inputClassName}
                />
              </label>
            </div>

            <button
              type="button"
              className="mt-[30px] inline-flex h-[51px] min-w-[190px] cursor-pointer items-center justify-center rounded-[17px] border-0 bg-[#7C1FFF] font-extrabold text-white shadow-[0_8px_16px_rgba(124,31,255,0.28)] transition-all duration-300 hover:bg-[#6817e7] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className={cardClassName}>
          <div className={glowLineClassName}></div>
          <div className="px-[30px] pt-6 pb-[25px]">
            <h2 className="m-0 font-extrabold leading-tight text-slate-900 dark:text-slate-100">Invoice Defaults</h2>
            <p className="mt-1 mb-0 leading-[1.45] text-[#8E97AA] dark:text-slate-500">
              Default values applied when creating new invoices.
            </p>
          </div>

          <hr className="m-0 border-0 border-t border-[#EEF0F4] dark:border-slate-800/60" />

          <form className="px-[30px] pt-7 pb-[30px]">
            <div className="grid grid-cols-1 gap-x-6 gap-y-[22px] md:grid-cols-2">
              <label className={labelClassName} htmlFor="tax-rate">
                <span className="font-medium text-slate-700 dark:text-slate-300">Default Tax Rate (%)</span>
                <input
                  id="tax-rate"
                  name="taxRate"
                  type="text"
                  defaultValue="8.5"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="payment-terms">
                <span className="font-medium text-slate-700 dark:text-slate-300">Payment Terms (days)</span>
                <input
                  id="payment-terms"
                  name="paymentTerms"
                  type="text"
                  defaultValue="30"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="invoice-prefix">
                <span className="font-medium text-slate-700 dark:text-slate-300">Invoice Number Prefix</span>
                <input
                  id="invoice-prefix"
                  name="invoicePrefix"
                  type="text"
                  defaultValue="INV"
                  className={inputClassName}
                />
              </label>

              <label className={labelClassName} htmlFor="invoice-footer-note">
                <span className="font-medium text-slate-700 dark:text-slate-300">Invoice Footer Note</span>
                <input
                  id="invoice-footer-note"
                  name="invoiceFooterNote"
                  type="text"
                  defaultValue="Thank you for your business."
                  className={inputClassName}
                />
              </label>
            </div>

            <button
              type="button"
              className="mt-[30px] inline-flex h-[51px] min-w-[190px] cursor-pointer items-center justify-center rounded-[17px] border-0 bg-[#7C1FFF] font-extrabold text-white shadow-[0_8px_16px_rgba(124,31,255,0.28)] transition-all duration-300 hover:bg-[#6817e7] dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] dark:hover:from-neon-cyan dark:hover:to-neon-pink dark:hover:shadow-[0_0_25px_rgba(255,0,127,0.4)]"
            >
              Save Changes
            </button>
          </form>
        </section>

        <section className="relative max-w-[1008px] overflow-hidden rounded-[22px] border border-red-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.10)] transition-all duration-300 dark:border-neon-pink/30 dark:bg-cyber-card/85 dark:backdrop-blur-xl dark:shadow-2xl">
          <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-40 transition-all duration-300 dark:via-neon-pink dark:opacity-65"></div>
          <div className="px-[30px] pt-6 pb-[25px]">
            <h2 className="m-0 font-extrabold leading-tight text-[#E60000] dark:text-neon-pink dark:text-glow-pink">Danger Zone</h2>
            <p className="mt-1 mb-0 leading-[1.45] text-[#8E97AA] dark:text-slate-500">
              Irreversible and destructive actions
            </p>
          </div>

          <hr className="m-0 border-0 border-t border-red-200 dark:border-neon-pink/30" />

          <div className="flex flex-col gap-6 px-[30px] py-[30px] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="m-0 font-medium leading-[1.3] text-slate-900 dark:text-slate-100">Delete Account</h3>
              <p className="mt-1 mb-0 leading-[1.45] text-[#8E97AA] dark:text-slate-500">
                Permanently delete your account and all data
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-14 min-w-[205px] cursor-pointer items-center justify-center rounded-[17px] border border-red-300 bg-rose-50 font-extrabold text-[#E60000] transition-colors duration-300 hover:bg-red-100 dark:border-neon-pink/30 dark:bg-neon-pink/10 dark:text-neon-pink dark:hover:bg-neon-pink/15 dark:shadow-[0_0_14px_rgba(255,0,127,0.1)]"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
