const axios = require('axios');
const Invoice = require('./invoice.model');
 
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/21546968/2fn4aln/";
 
// Get all invoices
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
 
// Add a new invoice and notify Zapier
exports.addInvoice = async (req, res) => {
    try {
        const { recipient, amount, dueDate } = req.body;
        const newInvoice = new Invoice({ recipient, amount, dueDate });
        await newInvoice.save();
 
        await axios.post(ZAPIER_WEBHOOK_URL, {
            event: "invoice_created",
            invoice: newInvoice
        });
 
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(400).json({ error: 'Error adding invoice' });
    }
};
 
// Delete an invoice and notify Zapier
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
 
        await Invoice.findByIdAndDelete(req.params.id);
 
        await axios.post(ZAPIER_WEBHOOK_URL, {
            event: "invoice_deleted",
            invoiceId: req.params.id
        });
 
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting invoice' });
    }
};
 
// Manually trigger an invoice reminder via Zapier
exports.triggerInvoiceReminder = async (req, res) => {
    try {
        const { invoiceId } = req.body;
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        // Send correct invoice details to Zapier
        const zapierResponse = await axios.post(ZAPIER_WEBHOOK_URL, {
            event: "invoice_reminder",
            recipient: invoice.recipient, // Ensure recipient is sent separately
            amount: invoice.amount,       // Ensure amount is sent separately
            dueDate: invoice.dueDate      // Ensure due date is sent separately
        });

        console.log("Zapier Response:", zapierResponse.data);

        res.json({ success: true, message: "Reminder sent via Zapier", zapierResponse: zapierResponse.data });
    } catch (error) {
        console.error("Zapier Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error triggering Zapier' });
    }
};
