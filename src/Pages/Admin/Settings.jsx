import React from "react";

const Settings = () => {
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#F8FAFC",
    color: "#020617",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "30px 22px",
    fontSize: "15px",
  };

  const headerStyle = {
    marginBottom: "32px",
  };

  const titleStyle = {
    
    fontWeight: 800,
    lineHeight: 1.2,
    margin: 0,
  };

  const subtitleStyle = {
    color: "#99A1AF",
    
    lineHeight: 1.35,
    margin: "4px 0 0",
  };

  const cardStyle = {
    maxWidth: "1008px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "22px",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.10)",
    overflow: "hidden",
  };

  const sectionStackStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  };

  const cardHeaderStyle = {
    padding: "24px 30px 25px",
  };

  const cardTitleStyle = {
    
    fontWeight: 800,
    lineHeight: 1.25,
    margin: 0,
  };

  const cardDescriptionStyle = {
    color: "#8E97AA",
    
    lineHeight: 1.45,
    margin: "4px 0 0",
  };

  const dividerStyle = {
    border: 0,
    borderTop: "1px solid #EEF0F4",
    margin: 0,
  };

  const formStyle = {
    padding: "28px 30px 30px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: "24px",
    rowGap: "22px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const labelStyle = {
    color: "#334155",
    
    fontWeight: 500,
  };

  const inputStyle = {
    width: "100%",
    height: "62px",
    border: "1px solid #DDE2EA",
    borderRadius: "17px",
    backgroundColor: "#F8FAFC",
    color: "#020617",
    
    outline: "none",
    padding: "0 18px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "190px",
    height: "51px",
    marginTop: "30px",
    border: 0,
    borderRadius: "17px",
    backgroundColor: "#7C1FFF",
    color: "#FFFFFF",
    cursor: "pointer",
    
    fontWeight: 800,
    boxShadow: "0 8px 16px rgba(124, 31, 255, 0.28)",
  };

  const dangerCardStyle = {
    ...cardStyle,
    border: "1px solid #FECACA",
  };

  const dangerTitleStyle = {
    ...cardTitleStyle,
    color: "#E60000",
  };

  const dangerContentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    padding: "30px",
  };

  const dangerActionTitleStyle = {
    
    fontWeight: 500,
    lineHeight: 1.3,
    margin: 0,
  };

  const dangerButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "205px",
    height: "56px",
    border: "1px solid #FCA5A5",
    borderRadius: "17px",
    backgroundColor: "#FFF1F2",
    color: "#E60000",
    cursor: "pointer",
    
    fontWeight: 800,
  };

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Settings</h1>
        <p style={subtitleStyle}>Manage your account and invoice preferences</p>
      </header>

      <div style={sectionStackStyle}>
        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={cardTitleStyle}>Business Profile</h2>
            <p style={cardDescriptionStyle}>
              Your company information used on invoices and receipts.
            </p>
          </div>

          <hr style={dividerStyle} />

          <form style={formStyle}>
            <div style={gridStyle}>
              <label style={fieldStyle} htmlFor="business-name">
                <span style={labelStyle}>Business Name</span>
                <input
                  id="business-name"
                  name="businessName"
                  type="text"
                  defaultValue="Acme Corp"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="business-email">
                <span style={labelStyle}>Business Email</span>
                <input
                  id="business-email"
                  name="businessEmail"
                  type="email"
                  defaultValue="billing@acmecorp.com"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="tax-id">
                <span style={labelStyle}>Tax ID / EIN</span>
                <input
                  id="tax-id"
                  name="taxId"
                  type="text"
                  defaultValue="12-3456789"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="business-address">
                <span style={labelStyle}>Business Address</span>
                <input
                  id="business-address"
                  name="businessAddress"
                  type="text"
                  defaultValue="123 Market St, San Francisco, CA 94103"
                  style={inputStyle}
                />
              </label>
            </div>

            <button type="button" style={buttonStyle}>
              Save Changes
            </button>
          </form>
        </section>

        <section style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={cardTitleStyle}>Invoice Defaults</h2>
            <p style={cardDescriptionStyle}>
              Default values applied when creating new invoices.
            </p>
          </div>

          <hr style={dividerStyle} />

          <form style={formStyle}>
            <div style={gridStyle}>
              <label style={fieldStyle} htmlFor="tax-rate">
                <span style={labelStyle}>Default Tax Rate (%)</span>
                <input
                  id="tax-rate"
                  name="taxRate"
                  type="text"
                  defaultValue="8.5"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="payment-terms">
                <span style={labelStyle}>Payment Terms (days)</span>
                <input
                  id="payment-terms"
                  name="paymentTerms"
                  type="text"
                  defaultValue="30"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="invoice-prefix">
                <span style={labelStyle}>Invoice Number Prefix</span>
                <input
                  id="invoice-prefix"
                  name="invoicePrefix"
                  type="text"
                  defaultValue="INV"
                  style={inputStyle}
                />
              </label>

              <label style={fieldStyle} htmlFor="invoice-footer-note">
                <span style={labelStyle}>Invoice Footer Note</span>
                <input
                  id="invoice-footer-note"
                  name="invoiceFooterNote"
                  type="text"
                  defaultValue="Thank you for your business."
                  style={inputStyle}
                />
              </label>
            </div>

            <button type="button" style={buttonStyle}>
              Save Changes
            </button>
          </form>
        </section>

        <section style={dangerCardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={dangerTitleStyle}>Danger Zone</h2>
            <p style={cardDescriptionStyle}>Irreversible and destructive actions</p>
          </div>

          <hr style={{ ...dividerStyle, borderTop: "1px solid #FECACA" }} />

          <div style={dangerContentStyle}>
            <div>
              <h3 style={dangerActionTitleStyle}>Delete Account</h3>
              <p style={cardDescriptionStyle}>
                Permanently delete your account and all data
              </p>
            </div>

            <button type="button" style={dangerButtonStyle}>
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
