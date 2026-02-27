const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const FITAddOn = require('../models/FITAddOn');
const Review = require('../models/Review');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/destinations - list with filters
router.get('/', async (req, res) => {
    try {
        const { state, difficulty, minPrice, maxPrice, duration, tags, search, featured, page = 1, limit = 12 } = req.query;
        const query = { isActive: true };

        if (state) query.state = new RegExp(state, 'i');
        if (difficulty) query.difficulty = difficulty;
        if (featured) query.isFeatured = true;
        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = Number(minPrice);
            if (maxPrice) query.basePrice.$lte = Number(maxPrice);
        }
        if (duration) query.duration = { $lte: Number(duration) };
        if (tags) query.tags = { $in: tags.split(',') };
        if (search) query.$text = { $search: search };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Destination.countDocuments(query);
        const destinations = await Destination.find(query)
            .select('-longDescription -faqs -seoKeywords')
            .sort(featured ? { isFeatured: -1, rating: -1 } : { rating: -1, reviewCount: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            success: true,
            data: destinations,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/destinations/featured
router.get('/featured', async (req, res) => {
    try {
        const destinations = await Destination.find({ isFeatured: true, isActive: true })
            .select('-longDescription -faqs')
            .sort({ rating: -1 })
            .limit(8);
        res.json({ success: true, data: destinations });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/destinations/:slug - full detail
router.get('/:slug', async (req, res) => {
    try {
        const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });
        if (!destination) return res.status(404).json({ success: false, error: 'Destination not found.' });

        const [packages, fitAddOns, reviews] = await Promise.all([
            Package.find({ destinationId: destination._id, status: 'active' }).sort({ basePrice: 1 }),
            FITAddOn.find({ destinationId: destination._id, isAvailable: true }).sort({ rating: -1 }),
            Review.find({ destinationId: destination._id, isApproved: true })
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 })
                .limit(10),
        ]);

        res.json({ success: true, data: { destination, packages, fitAddOns, reviews } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/destinations (admin)
router.post('/', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({ success: true, data: destination });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT /api/destinations/:id (admin)
router.put('/:id', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!destination) return res.status(404).json({ success: false, error: 'Destination not found.' });
        res.json({ success: true, data: destination });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE /api/destinations/:id (admin)
router.delete('/:id', protect, restrictTo('superadmin'), async (req, res) => {
    try {
        await Destination.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Destination deactivated.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
