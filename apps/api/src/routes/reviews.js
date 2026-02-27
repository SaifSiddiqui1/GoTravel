const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const { protect, restrictTo } = require('../middleware/auth');

// POST /api/reviews
router.post('/', protect, async (req, res) => {
    try {
        const { destinationId, bookingId, rating, title, body, images } = req.body;
        const review = await Review.create({ userId: req.user._id, destinationId, bookingId, rating, title, body, images: images || [] });
        res.status(201).json({ success: true, data: review, message: 'Review submitted for approval.' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// GET /api/reviews?destinationId=...
router.get('/', async (req, res) => {
    try {
        const { destinationId, page = 1, limit = 10 } = req.query;
        const query = { isApproved: true };
        if (destinationId) query.destinationId = destinationId;
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Review.countDocuments(query);
        const reviews = await Review.find(query).populate('userId', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        res.json({ success: true, data: reviews, pagination: { page: Number(page), limit: Number(limit), total } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/reviews/:id/approve (admin)
router.patch('/:id/approve', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!review) return res.status(404).json({ success: false, error: 'Review not found.' });
        // Update destination rating
        const allReviews = await Review.find({ destinationId: review.destinationId, isApproved: true });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Destination.findByIdAndUpdate(review.destinationId, { rating: avgRating.toFixed(1), reviewCount: allReviews.length });
        res.json({ success: true, data: review });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/reviews/pending (admin) 
router.get('/pending', protect, restrictTo('admin', 'superadmin'), async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: false }).populate('userId', 'name email').populate('destinationId', 'name').sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
