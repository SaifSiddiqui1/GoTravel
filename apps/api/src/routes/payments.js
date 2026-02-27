const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentService = require('../services/payment.service');

// POST /api/payments/create-order
router.post('/create-order', protect, async (req, res) => {
    try {
        const { amount, receipt, notes } = req.body;
        const order = await paymentService.createOrder(amount, 'INR', receipt, notes);
        res.json({ success: true, data: { order, keyId: process.env.RAZORPAY_KEY_ID } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/payments/verify
router.post('/verify', protect, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) return res.status(400).json({ success: false, error: 'Invalid payment signature.' });
        res.json({ success: true, message: 'Payment verified.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
