const express = require('express');
const router = express.Router();
const { getInvoices, addInvoice, deleteInvoice, triggerInvoiceReminder } = require('./invoice.controller');
 
router.get('/', getInvoices);
router.post('/', addInvoice);
router.delete('/:id', deleteInvoice);
router.post('/trigger-reminder', triggerInvoiceReminder);  
 
module.exports = router;
 