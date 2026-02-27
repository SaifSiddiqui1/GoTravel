const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingRef: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    fitAddOns: [{
        addOnId: { type: mongoose.Schema.Types.ObjectId, ref: 'FITAddOn' },
        name: String,
        pricePerPerson: Number,
        quantity: Number,
        subtotal: Number,
    }],
    travelers: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        idProofType: { type: String, enum: ['aadhar', 'passport', 'drivinglicense'] },
        idProofNumber: String,
    }],
    totalTravelers: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    basePackageCost: { type: Number, required: true },
    addOnsCost: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
        default: 'pending',
    },
    razorpayOrderId: String,
    paymentId: String,
    paymentSignature: String,
    status: {
        type: String,
        enum: ['enquiry', 'confirmed', 'departed', 'completed', 'cancelled'],
        default: 'enquiry',
    },
    travelDate: { type: Date, required: true },
    returnDate: Date,
    contactDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    specialRequests: String,
    assignedVendors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    }],
    internalNotes: String,
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
    if (!this.bookingRef) {
        this.bookingRef = 'GT' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    next();
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ travelDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
