const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/vendors (admin)
router.get('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const { destinationId, type, page = 1, limit = 20 } = req.query;
        const query = {};
        if (destinationId) query.destinationId = destinationId;
        if (type) query.type = type;
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Vendor.countDocuments(query);
        const vendors = await Vendor.find(query).populate('destinationId', 'name slug').sort({ rating: -1 }).skip(skip).limit(Number(limit));
        res.json({ success: true, data: vendors, pagination: { page: Number(page), limit: Number(limit), total } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/vendors/:id (admin)
router.get('/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('destinationId', 'name');
        if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found.' });
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/vendors (admin)
router.post('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json({ success: true, data: vendor });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT /api/vendors/:id (admin)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found.' });
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/vendors/:id/contact-log (admin) - log a contact attempt
router.post('/:id/contact-log', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { $push: { contactLog: { ...req.body, date: new Date(), agentName: req.user.name } } },
            { new: true }
        );
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
