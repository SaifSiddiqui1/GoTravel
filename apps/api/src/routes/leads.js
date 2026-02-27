const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Destination = require('../models/Destination');
const { protect, restrictTo } = require('../middleware/auth');
const { sendLeadNotification } = require('../services/notification.service');

// POST /api/leads - create lead (public)
router.post('/', async (req, res) => {
    try {
        const { destinationId, packageId, contactDetails, preferredDates, groupSize, budget, message, source, utmSource, utmMedium, utmCampaign } = req.body;

        const destination = await Destination.findById(destinationId);
        if (!destination) return res.status(404).json({ success: false, error: 'Destination not found.' });

        const lead = await Lead.create({
            userId: req.user?._id,
            destinationId,
            packageId,
            contactDetails,
            preferredDates,
            groupSize: groupSize || 1,
            budget,
            message,
            source: source || 'website',
            utmSource,
            utmMedium,
            utmCampaign,
        });

        // Notify admin immediately (non-blocking)
        sendLeadNotification(lead, destination).then(async () => {
            lead.notifiedAdmin = true;
            await lead.save();
        }).catch(console.error);

        res.status(201).json({ success: true, data: lead, message: 'Thank you! Our team will contact you within 24 hours.' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET /api/leads (admin)
router.get('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const { status, page = 1, limit = 20, destinationId } = req.query;
        const query = {};
        if (status) query.status = status;
        if (destinationId) query.destinationId = destinationId;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .populate('destinationId', 'name slug heroImage')
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({ success: true, data: leads, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/leads/:id/status (admin)
router.patch('/:id/status', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, adminNotes: req.body.adminNotes, followUpDate: req.body.followUpDate },
            { new: true }
        );
        if (!lead) return res.status(404).json({ success: false, error: 'Lead not found.' });
        res.json({ success: true, data: lead });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
