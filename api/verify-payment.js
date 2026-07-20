const crypto = require("crypto");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order, // { vehicleLabel, plateNumber, side, amount, name, phone, address, city, pin, state, landmark }
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // ── VERIFY SIGNATURE ──────────────────────────────────────────
    // This proves the payment actually happened and wasn't faked by
    // someone calling success.html directly with made-up IDs.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ verified: false, error: "Signature mismatch" });
    }

    // ── SEND ORDER EMAILS VIA RESEND (best-effort, never blocks the response) ──
    if (process.env.RESEND_API_KEY && order) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const orderSummaryHtml = `
          <h2>New HSRP Order</h2>
          <p><b>Vehicle:</b> ${order.vehicleLabel || ""}</p>
          <p><b>Plate Number:</b> ${order.plateNumber || ""}</p>
          <p><b>Sides:</b> ${order.side || ""}</p>
          <p><b>Amount Paid:</b> ₹${order.amount || ""}</p>
          <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
          <hr>
          <p><b>Customer:</b> ${order.name || ""} (${order.phone || ""})</p>
          <p><b>Address:</b> ${order.address || ""}, ${order.landmark ? order.landmark + ", " : ""}${order.city || ""} - ${order.pin || ""}, ${order.state || ""}</p>
        `;

        // Notify you (the business owner) — replace with your real inbox
        await resend.emails.send({
          from: process.env.RESEND_FROM || "orders@yourdomain.com",
          to: process.env.OWNER_EMAIL || "orders@yourdomain.com",
          subject: `New Order — ${order.plateNumber || ""}`,
          html: orderSummaryHtml,
        });
      } catch (emailErr) {
        // Don't fail the whole request just because the email failed
        console.error("Resend email error:", emailErr);
      }
    }

    return res.status(200).json({ verified: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
