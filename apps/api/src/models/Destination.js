const mongoose = require('mongoose');
const slugify = require('slugify');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    heroImage: { type: String, required: true },
    gallery: [String],
    shortDescription: { type: String, required: true, maxlength: 300 },
    longDescription: { type: String, required: true },
    basePrice: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], default: 'moderate' },
    tags: [String],
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    bestTimeToVisit: String,
    climate: String,
    languages: [String],
    currency: { type: String, default: 'INR' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    faqs: [{
        question: String,
        answer: String,
    }],
}, { timestamps: true });

destinationSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

destinationSchema.index({ slug: 1 });
destinationSchema.index({ state: 1, country: 1 });
destinationSchema.index({ isFeatured: 1, isActive: 1 });
destinationSchema.index({ tags: 1 });
destinationSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
