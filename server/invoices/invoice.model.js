const mongoose = require('mongoose');
 
const InvoiceSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true }
}, { timestamps: true });
 
module.exports = mongoose.model('invoices', InvoiceSchema);
 