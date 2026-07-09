import { API_BASE_URL } from '../config/api';

/**
 * Fetches the customer profile details from the backend.
 * @param {string} customerId - The ID of the customer (default to demo '6732867')
 * @returns {Promise<Object>}
 */
export async function getCustomerProfile(customerId = '6732867') {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/${customerId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch customer profile');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch customer profile');
    }

    return result.data;
  } catch (error) {
    console.error('getCustomerProfile error:', error);
    throw error;
  }
}
