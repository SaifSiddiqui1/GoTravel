const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', protect, (req, res) => {
    res.json({ success: true, data: req.user });
});

// PATCH /api/users/profile
router.patch('/profile', protect, async (req, res) => {
    try {
        const updates = ({ name, phone, address, city, state, pincode, dateOfBirth, gender, emergencyContact, travelPreferences, passportNumber, passportExpiry } = req.body);
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PATCH /api/users/change-password
router.patch('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
