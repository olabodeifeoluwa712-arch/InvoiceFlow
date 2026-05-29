import React, { useState } from 'react'
import { customers, invoices, products } from '../../Database/data.json'
import { generateInvoiceNumber, formatDate, getNameInitials, getRandomColor, formatCurrency } from '../../utils/formatter'
import { useEffect } from 'react';

const productCatalogue = [
  { name: "Business Starter Kit", price: 299 },
  { name: "Enterprise License", price: 1299 },
  { name: "Analytics Add-on", price: 149 },
  { name: "API Access Module", price: 499 },
  { name: "Team Collaboration", price: 799 },
];

const CreateInvoice = () => {
  // Define form states
  const [customer, setCustomer] = useState([customers]);
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(formatDate());
  const [dueDate, setDueDate] = useState('2024-12-30');
  const [newInvoice, setNewInvoice] = useState({id: '', invoiceNo: '', customerName: '', amount: '', datePaid: '', dueDate: '', status: '', initials: '', avatarBg: ''});
  
  // Line items state
  const [lineItems, setLineItems] = useState([
    { id: 1, product: '', qty: 1, price: 0 }
  ]);

  // Handle adding line items
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), product: '', qty: 1, price: 0 }
    ]);
  };

  // Handle removing line items
  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Handle line item field changes
  const updateLineItem = (id, field, value) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        let updated = { ...item, [field]: value };
        // Auto-fill price if product changes
        if (field === 'product') {
          const match = productCatalogue.find(p => p.name === value);
          updated.price = match ? match.price : 0;
        }
        return updated;
      }
      return item;
    }));
  };

  // Summary calculations
  const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = Math.round(subtotal * 0.085 * 100) / 100; // 8.5%
  const totalDue = subtotal + tax;
  const itemsCount = lineItems.reduce((acc, item) => acc + Number(item.qty), 0);


  const saveInvoice = async () => {
  fetch('http://localhost:3001/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: newInvoice.id,
    invoiceNo: invoiceNo,
    customerName: newInvoice.customerName,
    amount: formatCurrency(totalDue),
    datePaid: invoiceDate,
    dueDate: newInvoice.dueDate,
    status: 'Pending',
    initials: getNameInitials(newInvoice.customerName),
    avatarBg: getRandomColor()
  })
})
  
    }


  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F8F9FC] p-6 font-sans text-slate-950 transition-colors duration-300 dark:bg-cyber-dark dark:text-slate-100 md:p-10 select-none">
      
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-1/4 -right-36 h-96 w-96 rounded-full bg-neon-purple/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-purple/10"></div>
      <div className="absolute bottom-1/4 -left-36 h-96 w-96 rounded-full bg-neon-cyan/5 blur-[120px] transition-all duration-300 pointer-events-none dark:bg-neon-cyan/10"></div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Create Invoice
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500">
              Fill in the details to generate a new invoice
            </p>
          </div>

          <a
            href="/admin/invoices"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:bg-slate-800/60 shadow-sm"
          >
            ← Back to Invoices
          </a>
        </header>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Form fields (Invoice Details & Line Items) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Invoice Details Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 dark:bg-cyber-card/85 dark:border-slate-800/80 w-full relative overflow-hidden">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>
              
              <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200 mb-6">
                Invoice Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Customer *</label>
                  <select
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
                   
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent dark:scrollbar-thumb-slate-700"
                  >
                    <option value="">Select customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Invoice Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNo}
                    readOnly
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                  />
                </div>

                {/* Invoice Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Invoice Date</label>
                  <input
                    type="text"
                    value={invoiceDate}
                    readOnly
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-800 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                  />
                </div>

                {/* Due Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-800 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                  />
                </div>

                {/* Initials */}
                {/* <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Initials</label>
                  <input
                    type="text"
                    value={newInvoice.initials}
                    onChange={(e) => setNewInvoice({...newInvoice, initials: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm text-slate-800 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                  />
                </div> */}

            {/* get name initials */}
          
             
            

              </div>

            </div>

            {/* Line Items Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 dark:bg-cyber-card/85 dark:border-slate-800/80 w-full relative overflow-hidden">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>
              
              <h2 className="text-xl font-bold text-slate-850 dark:text-slate-200 mb-6">
                Line Items
              </h2>

              {/* Line Items Table/Div Row List */}
              <div className="space-y-4">
                
                {/* Table Header Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-slate-50 dark:border-slate-800/50">
                  <div className="col-span-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product</div>
                  <div className="col-span-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Qty</div>
                  <div className="col-span-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Unit Price</div>
                  <div className="col-span-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Total</div>
                </div>

                {/* Rows mapping */}
                <div className="space-y-4">
                  {lineItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:p-0 border border-slate-100 rounded-2xl md:border-none md:rounded-none bg-slate-50/30 md:bg-transparent dark:border-slate-850 dark:bg-transparent">
                      
                      {/* Product select */}
                      <div className="col-span-12 md:col-span-6 flex flex-col md:block gap-1">
                        <span className="block md:hidden text-xs font-bold text-slate-400 uppercase">Product</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={item.product}
                            onChange={(e) => updateLineItem(item.id, 'product', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                          >
                            <option value="">Select product...</option>
                            {productCatalogue.map(p => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Qty */}
                      <div className="col-span-6 md:col-span-2 flex flex-col md:block gap-1">
                        <span className="block md:hidden text-xs font-bold text-slate-400 uppercase">Qty</span>
                        <input
                          type="number"
                          value={item.qty}
                          min="1"
                          onChange={(e) => updateLineItem(item.id, 'qty', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-6 md:col-span-2 flex flex-col md:block gap-1">
                        <span className="block md:hidden text-xs font-bold text-slate-400 uppercase">Unit Price</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateLineItem(item.id, 'price', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-800 font-semibold focus:border-[#8B5CF6] focus:outline-none transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-slate-100 dark:focus:border-neon-cyan"
                        />
                      </div>

                      {/* Total */}
                      <div className="col-span-12 md:col-span-2 flex justify-between md:block items-center gap-1 mt-2 md:mt-0">
                        <span className="block md:hidden text-xs font-bold text-slate-400 uppercase">Total</span>
                        <div className="flex items-center justify-end gap-2 w-full">
                          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                            ${(item.qty * item.price).toLocaleString()}
                          </span>
                          
                          {/* Remove row button */}
                          {lineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 bg-rose-50/50 hover:bg-rose-100 transition-colors border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900 cursor-pointer"
                              title="Remove item"
                            >
                              <span className="text-lg leading-none font-bold">×</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* Add Line Item Action */}
              <button
                type="button"
                onClick={addLineItem}
                className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">+</span> Add Line Item
              </button>

            </div>

          </div>

          {/* Right Column - Invoice Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 w-full">
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 dark:bg-cyber-card/85 dark:border-slate-800/80 w-full relative overflow-hidden">
              <div className="absolute -top-[1px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent dark:via-neon-cyan opacity-40 dark:opacity-65"></div>
              
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200 mb-6">
                Invoice Summary
              </h3>

              <div className="space-y-4">
                
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-350">${subtotal.toLocaleString()}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  <span>Tax (8.5%)</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-350">${tax.toLocaleString()}</span>
                </div>

                {/* Items quantity */}
                <div className="flex justify-between items-center text-sm font-semibold text-slate-400 dark:text-slate-500">
                  <span>Items</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-350">{itemsCount}</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 my-4 pt-4"></div>

                {/* Total Due */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Total Due</span>
                  <span className="text-lg font-extrabold text-[#7C3AED] dark:text-neon-purple">${totalDue.toLocaleString()}</span>
                  
                 
                </div>

              </div>

              {/* Action triggers */}
              <div className="space-y-3.5 mt-8">
                
                {/* Send */}
                <button
                  type="button"
                  onClick={() => saveInvoice()}
                  className="w-full flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#7c1fff] text-white hover:bg-[#6817e7] font-bold shadow-[0_10px_20px_rgba(124,31,255,0.2)] hover:shadow-[0_12px_24px_rgba(124,31,255,0.3)] transition-all duration-200 dark:bg-gradient-to-r dark:from-neon-cyan dark:to-neon-purple dark:text-slate-950 cursor-pointer"
                >
                  Save &amp; Send Invoice
                </button>

                {/* Draft */}
                <button
                  type="button"
                  className="w-full flex h-13 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold transition-all duration-200 cursor-pointer"
                >
                  Save as Draft
                </button>

              </div>

              {/* Note indicator */}
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-550 flex items-center gap-2 mt-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                PDF will be emailed to customer on send
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateInvoice