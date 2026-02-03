import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ""));

// Basic string cleaner to reduce header injection / HTML junk
const clean = (s, max = 300) =>
  String(s || "")
    .replace(/[<>]/g, "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);

// MongoDB (optional)
let mongoClient;
async function getMongo() {
  if (!process.env.MONGODB_URI) return null;
  if (mongoClient) return mongoClient;
  mongoClient = new MongoClient(process.env.MONGODB_URI);
  await mongoClient.connect();
  return mongoClient;
}

// Nodemailer (Gmail SMTP)
function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("Missing SMTP_USER/SMTP_PASS");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

// Vercel serverless handler
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    // Honeypot field: if filled, assume bot
    if (req.body?.company) return res.status(204).end();

    const payload = {
      selectedDate: clean(req.body.selectedDate, 80),
      selectedTime: clean(req.body.selectedTime, 40),
      name: clean(req.body.name, 80),
      email: clean(req.body.email, 120),
      phone: clean(req.body.phone, 40),
      address: clean(req.body.address, 140),
      city: clean(req.body.city, 80),
      state: clean(req.body.state, 40),
      zip: clean(req.body.zip, 20),
      notes: clean(req.body.notes, 1000),
    };

    // Validate
    if (!payload.selectedDate || !payload.selectedTime) {
      return res.status(400).json({ ok: false, error: "Missing schedule." });
    }
    if (!payload.name || !payload.address || !payload.city) {
      return res.status(400).json({ ok: false, error: "Missing required fields." });
    }
    if (!isEmail(payload.email)) {
      return res.status(400).json({ ok: false, error: "Invalid email." });
    }

    // Optional: store booking to MongoDB
    if (process.env.MONGODB_URI && process.env.STORE_TO_MONGO === "true") {
      const client = await getMongo();
      const dbName = process.env.MONGODB_DB || "bookings_db";
      const colName = process.env.MONGODB_COLLECTION || "appointments";

      await client.db(dbName).collection(colName).insertOne({
        ...payload,
        createdAt: new Date(),
        ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
      });
    }

    // Email notification
    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;
    const transporter = getTransporter();

    const subject = `New Booking: ${payload.selectedDate} @ ${payload.selectedTime}`;
    const text = `NEW APPOINTMENT BOOKING

Schedule:
- Date: ${payload.selectedDate}
- Time: ${payload.selectedTime}

Customer:
- Name: ${payload.name}
- Email: ${payload.email}
- Phone: ${payload.phone || "N/A"}

Address:
- ${payload.address}
- ${payload.city}, ${payload.state || ""} ${payload.zip || ""}

Notes:
${payload.notes || "N/A"}
`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      replyTo: payload.email,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error." });
  }
}
