import api from './client';

export const financeApi = {
  // Fee Structures
  createFeeStructure: (data) => api.post('/finance/fee-structures', data),
  getFeeStructuresByBatch: (batchId) => api.get(`/finance/fee-structures/batch/${batchId}`),
  getFeeStructuresByClass: (classId, batchId) => api.get(`/finance/fee-structures/class/${classId}/batch/${batchId}`),
  deleteFeeStructure: (id) => api.delete(`/finance/fee-structures/${id}`),

  // Invoices
  createInvoice: (data) => api.post('/finance/invoices', data),
  getInvoicesByStudent: (studentId) => api.get(`/finance/invoices/student/${studentId}`),
  getInvoicesByBatch: (batchId) => api.get(`/finance/invoices/batch/${batchId}`),
  getInvoicesByStatus: (status) => api.get(`/finance/invoices/status/${status}`),

  // Payments
  recordPayment: (data) => api.post('/finance/payments', data),
  getPaymentsByInvoice: (invoiceId) => api.get(`/finance/payments/invoice/${invoiceId}`),

  // Receipts
  generateReceipt: (data) => api.post('/finance/receipts', data),
  getReceiptByPayment: (paymentId) => api.get(`/finance/receipts/payment/${paymentId}`),
};
