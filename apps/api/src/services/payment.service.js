const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order
 */
exports.createOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
    const options = {
        amount: Math.round(amount * 100), // paisa
        currency,
        receipt,
        notes,
    };
    return razorpay.orders.create(options);
};

/**
 * Verify Razorpay payment signature
 */
exports.verifyPayment = (orderId, paymentId, signature) => {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    return expectedSignature === signature;
};

/**
 * Fetch payment details
 */
exports.fetchPayment = (paymentId) => razorpay.payments.fetch(paymentId);

/**
 * Initiate refund
 */
exports.initiateRefund = async (paymentId, amount) => {
    return razorpay.payments.refund(paymentId, { amount: Math.round(amount * 100) });
};
