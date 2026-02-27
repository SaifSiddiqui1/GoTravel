const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, restrictTo } = require('../middleware/auth');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'), false);
    },
});

const uploadToCloudinary = (buffer, folder) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: `gotravel/${folder}`, transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });

// POST /api/upload/image
router.post('/image', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'No image provided.' });
        const folder = req.body.folder || 'misc';
        const result = await uploadToCloudinary(req.file.buffer, folder);
        res.json({ success: true, data: { url: result.secure_url, publicId: result.public_id } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/upload/images (multiple)
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files?.length) return res.status(400).json({ success: false, error: 'No images provided.' });
        const folder = req.body.folder || 'misc';
        const uploads = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, folder)));
        res.json({ success: true, data: uploads.map(r => ({ url: r.secure_url, publicId: r.public_id })) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
