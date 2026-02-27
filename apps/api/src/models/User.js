const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, select: false },
    googleId: String,
    avatar: String,
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    address: String,
    city: String,
    state: String,
    pincode: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    passportNumber: String,
    passportExpiry: Date,
    emergencyContact: {
        name: String,
        phone: String,
        relation: String,
    },
    travelPreferences: [String],
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastLogin: Date,
    // OTP
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
