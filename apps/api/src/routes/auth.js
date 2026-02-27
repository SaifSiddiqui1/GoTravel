const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP } = require('../services/notification.service');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, error: 'Email already registered.' });

        const user = await User.create({ name, email, phone, password });
        const token = signToken(user._id);
        user.password = undefined;
        res.status(201).json({ success: true, token, data: user });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required.' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }
        if (user.isBlocked) return res.status(403).json({ success: false, error: 'Account suspended.' });

        user.lastLogin = Date.now();
        await user.save();

        const token = signToken(user._id);
        user.password = undefined;
        res.json({ success: true, token, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { googleId, email, name, avatar } = req.body;
        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (!user) {
            user = await User.create({ googleId, email, name, avatar, isVerified: true });
        } else if (!user.googleId) {
            user.googleId = googleId;
            user.avatar = avatar;
            await user.save();
        }
        user.lastLogin = Date.now();
        await user.save();
        const token = signToken(user._id);
        res.json({ success: true, token, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, (req, res) => {
    res.json({ success: true, data: req.user });
});

module.exports = router;
