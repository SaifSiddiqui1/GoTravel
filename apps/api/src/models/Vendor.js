const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['hotel', 'transport', 'guide', 'activity', 'restaurant'],
        required: true,
    },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    website: String,
    address: { type: String, required: true },
    coordinates: {
        lat: Number,
        lng: Number,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
    notes: String,
    source: { type: String, enum: ['manual', 'google_maps', 'partner'], default: 'manual' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    images: [String],
    amenities: [String],
    capacity: Number,
    contactLog: [{
        date: Date,
        method: { type: String, enum: ['email', 'phone', 'whatsapp'] },
        note: String,
        agentName: String,
    }],
}, { timestamps: true });

vendorSchema.index({ destinationId: 1, type: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
