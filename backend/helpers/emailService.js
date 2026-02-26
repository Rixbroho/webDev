const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error(
    "Missing email credentials: please set EMAIL_USER and EMAIL_PASS in Backend/.env",
  );
} else {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  transporter
    .verify()
    .then(() => console.log("Email transporter is ready"))
    .catch((err) =>
      console.error(
        "Email transporter error:",
        err && err.message ? err.message : err,
      ),
    );
}

const sendResetEmail = async (toEmail, otp, name = "") => {
  if (!transporter) {
    const err = new Error("Missing email credentials for email service");
    console.error("sendResetEmail aborted:", err.message);
    // Maintain previous behavior of throwing so callers can catch
    throw err;
  }
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.4;">
    <h2 style="color:#0b6efd;">Password Reset OTP</h2>
    <p>Hi ${name || "there"},</p>
    <p>We received a request to reset the password for your account. Use the following One-Time Passcode (OTP) to reset your password. This OTP will expire in one hour.</p>
    <div style="text-align:center;margin:30px 0;">
      <div style="display:inline-block;padding:14px 18px;border-radius:8px;background:#f4f6fb;border:1px solid #e3e8ff;font-size:20px;letter-spacing:6px;font-weight:600;color:#0b6efd;">${otp}</div>
    </div>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <hr />
    <p style="font-size:12px;color:#666;">This code will expire in 1 hour.</p>
  </div>
  `;

  const mailOptions = {
    from: `Sport Booking <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Password Reset OTP",
    html,
  };

  return transporter.sendMail(mailOptions);
};

const sendBookingConfirmedEmail = async (toEmail, booking, adminName = "") => {
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5;">
    <h2 style="color:#0b6efd;">Booking Confirmed Successfully</h2>
    <p>Hi ${adminName || "Admin"},</p>
    <p>The following booking has been <strong>confirmed</strong>:</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Booking ID</td><td style="padding:6px;border:1px solid #eee;">${booking.id}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Venue Name</td><td style="padding:6px;border:1px solid #eee;">${booking.venueName}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Customer Name</td><td style="padding:6px;border:1px solid #eee;">${booking.userName}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Booking Date</td><td style="padding:6px;border:1px solid #eee;">${booking.date}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Time Slot</td><td style="padding:6px;border:1px solid #eee;">${booking.time}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Total Amount</td><td style="padding:6px;border:1px solid #eee;">${booking.price || "N/A"}</td></tr>
      <tr><td style="padding:6px;border:1px solid #eee;font-weight:600;">Payment Status</td><td style="padding:6px;border:1px solid #eee;">${booking.paymentStatus || "Unknown"}</td></tr>
    </table>
    <p>If you need to review the booking details, please sign in to the admin dashboard.</p>
    <hr />
    <p style="font-size:12px;color:#666;">This is an automated message from Sport Booking.</p>
  </div>
  `;

  const text = `Booking Confirmed Successfully\n\nHi ${adminName || "Admin"},\n\nThe following booking has been confirmed:\nBooking ID: ${booking.id}\nVenue Name: ${booking.venueName}\nCustomer Name: ${booking.userName}\nBooking Date: ${booking.date}\nTime Slot: ${booking.time}\nTotal Amount: ${booking.price || "N/A"}\nPayment Status: ${booking.paymentStatus || "Unknown"}\n\nPlease sign in to the admin dashboard to review the booking.\n\n--\nSport Booking`;

  const mailOptions = {
    from: `Sport Booking <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Booking Confirmed Successfully – Venue Reservation",
    html,
    text,
    replyTo: process.env.REPLY_TO || process.env.EMAIL_USER,
  };

  // Include BCC to site admin if configured
  if (process.env.SITE_ADMIN_EMAIL)
    mailOptions.bcc = process.env.SITE_ADMIN_EMAIL;

  if (!transporter) {
    console.warn(
      "sendBookingConfirmedEmail aborted: Missing email credentials",
    );
    return { success: false, error: "Missing email credentials", attempts: 0 };
  }

  // Retry logic
  const maxAttempts = parseInt(process.env.EMAIL_MAX_ATTEMPTS || "3", 10);
  const baseDelayMs = parseInt(process.env.EMAIL_BASE_DELAY_MS || "500", 10);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent on attempt ${attempt} to ${toEmail}`, info);
      return { success: true, info, attempts: attempt };
    } catch (err) {
      lastError = err;
      console.warn(
        `Email attempt ${attempt} failed for ${toEmail}:`,
        err && err.message ? err.message : err,
      );
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All attempts failed
  console.error(`All ${maxAttempts} email attempts failed for ${toEmail}`);
  return {
    success: false,
    error:
      (lastError && (lastError.message || String(lastError))) ||
      "Unknown error",
    attempts: maxAttempts,
  };
};

module.exports = { transporter, sendResetEmail, sendBookingConfirmedEmail };
