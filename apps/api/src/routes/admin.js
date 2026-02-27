const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Vendor = require('../models/Vendor');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/admin/stats - dashboard overview
router.get('/stats', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.setDate(now.getDate() - 7));
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const [
            totalBookings, confirmedBookings, totalLeads, newLeads,
            totalUsers, totalRevenue, todayBookings, monthRevenue,
            recentLeads, recentBookings, topDestinations
        ] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            Lead.countDocuments(),
            Lead.countDocuments({ status: 'new' }),
            User.countDocuments({ role: 'user' }),
            Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalCost' } } }]),
            Booking.countDocuments({ createdAt: { $gte: todayStart } }),
            Booking.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$totalCost' } } }]),
            Lead.find({ status: 'new' }).populate('destinationId', 'name').sort({ createdAt: -1 }).limit(5),
            Booking.find().populate('userId', 'name email').populate('destinationId', 'name').sort({ createdAt: -1 }).limit(5),
            Booking.aggregate([{ $group: { _id: '$destinationId', count: { $sum: 1 }, revenue: { $sum: '$totalCost' } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
        ]);

        res.json({
            success: true,
            data: {
                totalBookings,
                confirmedBookings,
                totalLeads,
                newLeads,
                totalUsers,
                totalRevenue: totalRevenue[0]?.total || 0,
                todayBookings,
                monthRevenue: monthRevenue[0]?.total || 0,
                recentLeads,
                recentBookings,
                topDestinations,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/revenue-chart - revenue over time
router.get('/revenue-chart', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - Number(period));

        const data = await Booking.aggregate([
            { $match: { paymentStatus: 'paid', createdAt: { $gte: daysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalCost' },
                    bookings: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/users (admin)
router.get('/users', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        const query = { role: role || 'user' };
        if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { phone: new RegExp(search, 'i') }];

        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(query);
        const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

        res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/admin/users/:id - full user profile
router.get('/users/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
        const bookings = await Booking.find({ userId: req.params.id })
            .populate('destinationId', 'name slug')
            .populate('packageId', 'title type')
            .sort({ createdAt: -1 });
        const leads = await Lead.find({ userId: req.params.id }).populate('destinationId', 'name');
        res.json({ success: true, data: { user, bookings, leads } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/admin/users/:id/block
router.patch('/users/:id/block', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
