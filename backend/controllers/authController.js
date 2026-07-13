const asyncHandler = require('../middleware/asyncHandler');
const { getMasterData } = require('../services/marg/masterSyncService');

// Mock OTP for testing
const MOCK_OTP = '123456';

/**
 * POST /api/auth/send-otp
 * Body: { phone: '9289757820' }
 */
const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    const err = new Error('Phone number is required');
    err.statusCode = 400;
    throw err;
  }

  const { customers } = await getMasterData();
  const customer = customers.find((c) => c.phone === phone);

  if (!customer) {
    const err = new Error('No account found with this phone number');
    err.statusCode = 404;
    throw err;
  }

  // In a real app, integrate Twilio/MessageBird here to send real OTP.
  // For now, we bypass it.
  console.log(`[Mock OTP] Sent ${MOCK_OTP} to ${phone}`);

  res.json({ success: true, message: 'OTP sent successfully (Use 1234)' });
});

/**
 * POST /api/auth/verify-otp
 * Body: { phone: '9289757820', otp: '1234' }
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    const err = new Error('Phone and OTP are required');
    err.statusCode = 400;
    throw err;
  }

  if (otp !== MOCK_OTP) {
    const err = new Error('Invalid OTP');
    err.statusCode = 401;
    throw err;
  }

  const { customers } = await getMasterData();
  const customer = customers.find((c) => c.phone === phone);

  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  // In a real app, generate a JWT token here.
  const token = Buffer.from(`${customer.id}-${Date.now()}`).toString('base64');

  res.json({
    success: true,
    data: {
      token,
      customer,
    },
  });
});

module.exports = { sendOtp, verifyOtp };
