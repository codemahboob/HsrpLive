# Deploying BharatPlate HSRP (with backend)

This site is a static frontend (`index.html`, etc.) plus two small
serverless functions in `/api` that handle Razorpay securely. Deploy
the whole folder to Vercel — same flow you've used before (GitHub → Vercel).

## 1. Push to GitHub
Push this whole folder (including the `api/` directory) to your repo,
then import it into Vercel as usual.

## 2. Set environment variables in Vercel
Go to your Vercel project → **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_live_T8Hf8OyhfWilCb` (your existing live key) |
| `RAZORPAY_KEY_SECRET` | Get this from Razorpay Dashboard → Settings → API Keys. **Never put this in any HTML/JS file.** |
| `RESEND_API_KEY` | *(optional)* your Resend API key, if you want order emails |
| `RESEND_FROM` | *(optional)* e.g. `orders@yourdomain.com` — must be a domain verified in Resend |
| `OWNER_EMAIL` | *(optional)* the inbox that should receive new-order notifications |

Redeploy after adding these (Vercel → Deployments → ⋯ → Redeploy).

## 3. What changed vs. the old version
- The old version created the Razorpay checkout directly in the browser
  using only an amount — someone could edit that amount in dev tools
  before paying.
- Now, the browser calls `POST /api/create-order` first. That function
  recalculates the price **itself** from the vehicle type + side (never
  trusting a number sent from the browser) and creates a real Razorpay
  order for that exact amount.
- After payment, the browser calls `POST /api/verify-payment`, which
  checks Razorpay's cryptographic signature to confirm the payment is
  real before sending the customer to the success page.
- If `RESEND_API_KEY` is set, `verify-payment` also emails you a summary
  of the order (vehicle, plate number, amount, delivery address).

## 4. Testing before going fully live
Razorpay has a **Test Mode** with its own test keys (`rzp_test_...`) and
test card numbers. It's worth pointing `RAZORPAY_KEY_ID` /
`RAZORPAY_KEY_SECRET` at your test keys first, placing a test order end
to end, and confirming the success page and (if enabled) the order
email both arrive — then switching the env vars to your live keys.
