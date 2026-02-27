const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 2000 },
    images: [String],
    isApproved: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
}, { timestamps: true });

reviewSchema.index({ destinationId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
