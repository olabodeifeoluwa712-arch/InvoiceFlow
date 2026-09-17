import { useEffect } from "react";

export const formatStockValue = (val) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${val}`;
  };

  export const formatCurrency = (val) => {
    return `$${val.toFixed(2)}`;
  };

  export const getNameInitials = (name) => {
    const parts = name.split(' ');
    return parts.length === 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
  }

  export const formatDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  export const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  export const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString(undefined, options);
  }

let index = 1; // Start from 10
export const generateInvoiceNumber = () => {
      while (index <= 40) {
        index++;
       
        console.log(index)
        const invoiceNumber = `INV-${(index - 1).toString().padStart(4, '0')}`;
        return invoiceNumber;
    }

  }
   
      //  const invoiceNumber = `INV-${i.toString().padStart(4, '0')}`;
  

  export const generateSKU = () => {
    while (index <= 40) {
      const sku = `SKU-${index.toString().padStart(4, '0')}`;
      index++;
      return sku;
    }
  }

  // getRandombackgroundColor function to generate random pastel colors for avatars
  //bg-emerald-100 text-emerald-600
  export const getRandomColor = () => {
    const pastelColors = [
      'bg-rose-100 text-rose-600',
      'bg-pink-100 text-pink-600',
      'bg-orange-100 text-orange-600',
      'bg-amber-100 text-amber-600',
      'bg-yellow-100 text-yellow-600',
    ]
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  }


