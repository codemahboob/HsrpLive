const Razorpay = require("razorpay");

// ── SAME PRICING TABLE AS index.html ──────────────────────────────
// Kept here on the server so the price can NEVER be tampered with
// from the browser. If you change a price on the site, change it
// here too or the two will fall out of sync.
const PRICING = {
  car:                { unit: 650, single: 350 },
  bike:                { unit: 450, single: 2.4 },
  "commercial-truck":  { unit: 750, single: 400 },
  "commercial-car":    { unit: 700, single: 380 },
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { vehicleType, side, customer } = req.body || {};

    const cfg = PRICING[vehicleType];
    if (!cfg) {
      return res.status(400).json({ error: "Invalid vehicle type" });
    }
    if (!["front", "back", "both"].includes(side)) {
      return res.status(400).json({ error: "Invalid side" });
    }

    const amountRupees = side === "both" ? cfg.unit : cfg.single;
    const amountPaise = amountRupees * 100;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: "hsrp_" + Date.now(),
      notes: {
        vehicle_type: vehicleType,
        sides: side,
        plate_number: customer?.plateNumber || "",
        customer_name: customer?.name || "",
        customer_phone: customer?.phone || "",
      },
    });

    return res.status(200).json({
      order_id: order.id,
      amount: amountPaise,
      amount_rupees: amountRupees,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Could not create order" });
  }
};
