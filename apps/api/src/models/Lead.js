const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    contactDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    preferredDates: String,
    groupSize: { type: Number, required: true, default: 1 },
    budget: String,
    message: String,
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'lost'],
        default: 'new',
    },
    notifiedAdmin: { type: Boolean, default: false },
    source: { type: String, default: 'website' },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    adminNotes: String,
    followUpDate: Date,
    convertedBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });

leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ destinationId: 1 });

module.exports = mongoose.model('Lead', leadSchema);
