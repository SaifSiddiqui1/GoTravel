const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendLeadNotification = async (lead, destination) => {
    const subject = `🔥 New Lead: ${destination.name} | GoTravel`;
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#FF6B35,#FF8C42);padding:24px;color:white;">
        <h1 style="margin:0;font-size:24px;">🌍 New Lead Generated!</h1>
        <p style="margin:8px 0 0;">Via GoTravel Website</p>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#333;margin-top:0;">Destination: ${destination.name}</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;width:40%;">Name</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;font-weight:600;">${lead.contactDetails.name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;">Email</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;"><a href="mailto:${lead.contactDetails.email}">${lead.contactDetails.email}</a></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;">Phone</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;"><a href="tel:${lead.contactDetails.phone}">${lead.contactDetails.phone}</a></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;">Group Size</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;">${lead.groupSize} persons</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;">Budget</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;">${lead.budget || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #f0f0f0;color:#666;">Preferred Dates</td><td style="padding:8px;border-bottom:1px solid #f0f0f0;">${lead.preferredDates || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;color:#666;">Message</td><td style="padding:8px;">${lead.message || 'None'}</td></tr>
        </table>
        <div style="margin-top:24px;text-align:center;">
          <a href="${process.env.ADMIN_URL}/leads" style="background:linear-gradient(135deg,#FF6B35,#FF8C42);color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;">View in Admin Panel →</a>
        </div>
        <p style="margin-top:16px;font-size:12px;color:#999;">Lead ID: ${lead._id} | Source: ${lead.source} | Time: ${new Date().toLocaleString('en-IN')}</p>
      </div>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"GoTravel Alerts" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject,
            html,
        });
    } catch (err) {
        console.error('Lead email notification failed:', err.message);
    }
};

exports.sendBookingConfirmation = async (booking, user, destination) => {
    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px;color:white;text-align:center;">
        <h1 style="margin:0;font-size:28px;">🎉 Booking Confirmed!</h1>
        <p style="margin:8px 0 0;opacity:0.8;">Your GoTravel adventure is booked!</p>
      </div>
      <div style="padding:24px;">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your booking for <strong>${destination.name}</strong> is confirmed!</p>
        <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Booking Ref:</strong> ${booking.bookingRef}</p>
          <p style="margin:0 0 8px;"><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          <p style="margin:0 0 8px;"><strong>Total Travelers:</strong> ${booking.totalTravelers}</p>
          <p style="margin:0 0 8px;"><strong>Total Duration:</strong> ${booking.totalDays} days</p>
          <p style="margin:0;"><strong>Amount Paid:</strong> ₹${booking.totalCost.toLocaleString('en-IN')}</p>
        </div>
        <p>Our team will contact you 48 hours before your departure with all logistics details.</p>
        <div style="text-align:center;margin-top:24px;">
          <a href="${process.env.FRONTEND_URL}/dashboard/bookings/${booking._id}" style="background:linear-gradient(135deg,#FF6B35,#FF8C42);color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;">View My Booking</a>
        </div>
      </div>
    </div>
  `;
    try {
        await transporter.sendMail({
            from: `"GoTravel" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: `✅ Booking Confirmed: ${destination.name} | Ref: ${booking.bookingRef}`,
            html,
        });
        // Also notify admin
        await transporter.sendMail({
            from: `"GoTravel Alerts" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `💰 New Booking: ${destination.name} | ₹${booking.totalCost.toLocaleString('en-IN')}`,
            html: `<p>New booking from ${user.name} (${user.email}) for ${destination.name}. Booking Ref: ${booking.bookingRef}. Amount: ₹${booking.totalCost.toLocaleString('en-IN')}</p>`,
        });
    } catch (err) {
        console.error('Booking confirmation email failed:', err.message);
    }
};

exports.sendOTP = async (email, otp, name) => {
    try {
        await transporter.sendMail({
            from: `"GoTravel" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Your GoTravel OTP: ${otp}`,
            html: `<div style="font-family:Arial,sans-serif;max-width:400px;margin:auto;text-align:center;padding:40px;border:1px solid #e0e0e0;border-radius:8px;"><h2>Hi ${name},</h2><p>Your one-time password is:</p><div style="background:#f0f4ff;border-radius:8px;padding:16px;font-size:32px;font-weight:700;letter-spacing:8px;color:#1a1a2e;">${otp}</div><p style="color:#666;font-size:12px;margin-top:16px;">This OTP expires in 10 minutes.</p></div>`,
        });
    } catch (err) {
        console.error('OTP email failed:', err.message);
    }
};
