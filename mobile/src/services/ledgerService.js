import { API_BASE_URL } from '../config/api';

/**
 * Fetches the ledger history for a customer from the backend.
 * @param {string} customerId - The ID of the customer (default to demo '6732867')
 * @returns {Promise<Array>}
 */
export async function getLedgerHistory(customerId = 'AEEV') {
  try {
    const response = await fetch(`${API_BASE_URL}/ledger/${customerId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch ledger history');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch ledger history');
    }

    return result.data || [];
  } catch (error) {
    console.error('getLedgerHistory error:', error);
    throw error;
  }
}
