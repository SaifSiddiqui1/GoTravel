const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const paymentService = require('../services/payment.service');
const { sendBookingConfirmation } = require('../services/notification.service');

// POST /api/bookings - create booking (initiates payment)
router.post('/', protect, async (req, res) => {
    try {
        const { packageId, destinationId, fitAddOns, travelers, travelDate, contactDetails, specialRequests } = req.body;

        const pkg = await Package.findById(packageId);
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found.' });

        const basePackageCost = (pkg.discountedPrice || pkg.basePrice) * travelers.length;
        const addOnsCost = (fitAddOns || []).reduce((sum, a) => sum + (a.pricePerPerson * (a.quantity || 1)), 0);
        const taxes = Math.round((basePackageCost + addOnsCost) * 0.05); // 5% GST
        const totalCost = basePackageCost + addOnsCost + taxes;
        const totalDays = pkg.duration + Math.ceil(addOnsCost / 1000 * 0.5); // simplified calc

        // Create Razorpay order
        const razorpayOrder = await paymentService.createOrder(
            totalCost,
            'INR',
            `GT-${Date.now()}`,
            { packageId, userId: req.user._id.toString() }
        );

        const booking = await Booking.create({
            userId: req.user._id,
            packageId,
            destinationId,
            fitAddOns: fitAddOns || [],
            travelers,
            totalTravelers: travelers.length,
            totalDays,
            basePackageCost,
            addOnsCost,
            taxes,
            totalCost,
            travelDate,
            contactDetails,
            specialRequests,
            razorpayOrderId: razorpayOrder.id,
        });

        res.status(201).json({
            success: true,
            data: { booking, razorpayOrder, razorpayKeyId: process.env.RAZORPAY_KEY_ID },
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST /api/bookings/:id/verify-payment
router.post('/:id/verify-payment', protect, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });

        const isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) return res.status(400).json({ success: false, error: 'Payment verification failed.' });

        booking.paymentStatus = 'paid';
        booking.paymentId = razorpayPaymentId;
        booking.paymentSignature = razorpaySignature;
        booking.status = 'confirmed';
        await booking.save();

        // Update user stats
        await User.findByIdAndUpdate(booking.userId, {
            $inc: { totalBookings: 1, totalSpent: booking.totalCost },
        });

        // Send confirmation email
        const user = await User.findById(booking.userId);
        const destination = await Destination.findById(booking.destinationId);
        sendBookingConfirmation(booking, user, destination).catch(console.error);

        res.json({ success: true, data: booking, message: 'Payment verified! Booking confirmed.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/bookings/my - user's own bookings
router.get('/my', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('packageId', 'title images duration type')
            .populate('destinationId', 'name slug heroImage state')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/bookings/:id - booking detail
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('packageId')
            .populate('destinationId')
            .populate('userId', 'name email phone');

        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(403).json({ success: false, error: 'Not authorized.' });
        }
        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/bookings (admin)
router.get('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20, destinationId } = req.query;
        const query = {};
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (destinationId) query.destinationId = destinationId;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate('userId', 'name email phone')
            .populate('destinationId', 'name slug')
            .populate('packageId', 'title type duration')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({ success: true, data: bookings, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/bookings/:id/status (admin)
router.patch('/:id/status', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, internalNotes: req.body.internalNotes },
            { new: true }
        );
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
