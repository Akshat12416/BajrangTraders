import { API_BASE_URL } from '../config/api';

export async function sendOtpApi(phone) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.message || 'Failed to send OTP');
    }
    return result;
  } catch (error) {
    console.error('sendOtpApi error:', error);
    throw error;
  }
}

export async function verifyOtpApi(phone, otp) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.message || 'Failed to verify OTP');
    }
    return result;
  } catch (error) {
    console.error('verifyOtpApi error:', error);
    throw error;
  }
}
