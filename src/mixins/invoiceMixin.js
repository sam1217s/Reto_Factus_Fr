export const invoiceMixin = {
  methods: {
    formatCurrency(amount) {
      if (!amount) return '$0.00';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },

    formatDate(date, format = 'DD/MM/YYYY') {
      if (!date) return 'N/A';
      return this.$q.date.formatDate(date, format);
    },

    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        issued: 'positive', 
        failed: 'negative'
      };
      return colors[status] || 'grey';
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'Pendiente',
        issued: 'Emitida',
        failed: 'Fallida'
      };
      return labels[status] || 'Desconocido';
    },

    calculateInvoiceTotal(products) {
      return products.reduce((total, product) => {
        const subtotal = product.price * product.quantity;
        const tax = subtotal * (product.tax_rate / 100);
        return total + subtotal + tax;
      }, 0);
    },

    validateProductForFactus(product) {
      const required = [
        'code_reference',
        'name', 
        'unit_measure_id',
        'standard_code_id',
        'tribute_id'
      ];
      
      return required.every(field => product[field]);
    }
  }
};