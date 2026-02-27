const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['group', 'fit', 'honeymoon', 'family'], default: 'group' },
    duration: { type: Number, required: true },
    nights: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    discountedPrice: Number,
    discountPercent: Number,
    inclusions: [String],
    exclusions: [String],
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [String],
        meals: [{ type: String, enum: ['breakfast', 'lunch', 'dinner'] }],
        accommodation: String,
        transport: String,
        image: String,
    }],
    status: { type: String, enum: ['active', 'inactive', 'soldout'], default: 'active' },
    availableDates: [Date],
    maxGroupSize: { type: Number, default: 20 },
    minGroupSize: { type: Number, default: 1 },
    images: [String],
    highlights: [String],
    pricingTiers: {
        solo: Number,
        couple: Number,
        family: Number,
        group: Number,
    },
    cancellationPolicy: String,
    isAIGenerated: { type: Boolean, default: false },
}, { timestamps: true });

packageSchema.index({ destinationId: 1, type: 1, status: 1 });

module.exports = mongoose.model('Package', packageSchema);
