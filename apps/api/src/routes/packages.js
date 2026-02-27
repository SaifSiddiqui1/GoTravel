const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/packages
router.get('/', async (req, res) => {
    try {
        const { destinationId, type, status = 'active' } = req.query;
        const query = { status };
        if (destinationId) query.destinationId = destinationId;
        if (type) query.type = type;
        const packages = await Package.find(query).populate('destinationId', 'name slug state heroImage').sort({ basePrice: 1 });
        res.json({ success: true, data: packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/packages/:id
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id).populate('destinationId', 'name slug state coordinates bestTimeToVisit');
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found.' });
        res.json({ success: true, data: pkg });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/packages (admin)
router.post('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const pkg = await Package.create(req.body);
        res.status(201).json({ success: true, data: pkg });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT /api/packages/:id (admin)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found.' });
        res.json({ success: true, data: pkg });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE /api/packages/:id (admin)
router.delete('/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        await Package.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        res.json({ success: true, message: 'Package deactivated.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
