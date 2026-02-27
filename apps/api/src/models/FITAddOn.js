const mongoose = require('mongoose');

const fitAddOnSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['adventure', 'food', 'culture', 'relaxation', 'transport', 'stay', 'photography'],
        required: true,
    },
    pricePerPerson: { type: Number, required: true },
    duration: { type: Number, required: true }, // hours
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    highlights: [String],
    minParticipants: { type: Number, default: 1 },
    maxParticipants: { type: Number, default: 20 },
    bookingAdvanceDays: { type: Number, default: 1 },
}, { timestamps: true });

fitAddOnSchema.index({ destinationId: 1, category: 1, isAvailable: 1 });

module.exports = mongoose.model('FITAddOn', fitAddOnSchema);
