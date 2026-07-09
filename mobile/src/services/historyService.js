import { API_BASE_URL } from '../config/api';

/**
 * Fetches the order history (billed invoices) for a customer from the backend.
 * Note: Freshly placed Sales Orders will not appear here until they are billed in Marg.
 * @param {string} customerId - The ID of the customer (default to 'AEEV' for corporate API)
 * @returns {Promise<Array>}
 */
export async function getOrderHistory(customerId = 'AEEV') {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${customerId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch order history');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch order history');
    }

    return result.data || [];
  } catch (error) {
    console.error('getOrderHistory error:', error);
    throw error;
  }
}
