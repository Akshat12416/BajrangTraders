import { API_BASE_URL } from '../config/api';

/**
 * Places an order using the backend API.
 * @param {Array} items - Array of cart items (each has { product, quantity })
 * @param {string} customerId - ID of the customer placing the order
 * @param {string} salesmanId - ID of the salesman
 * @returns {Promise<Object>}
 */
export async function placeOrder(items, meta = {}) {
  // Format items according to backend expected shape
  const formattedItems = items.map(item => ({
    productCode: item.product.code || item.productId, // Fallback if code isn't mapped properly
    quantity: item.quantity,
    price: item.product.pricePerPiece || item.product.mrp || 0
  }));

  // Generate a random OrderNo so Marg doesn't reject it as duplicate
  const uniqueOrderNo = Math.floor(100000 + Math.random() * 900000).toString();

  const payload = {
    orderNo: uniqueOrderNo,
    customerId: meta.customerId || '6732867',
    customerName: meta.customerName || 'Demo Test Customer',
    customerMobile: meta.customerMobile || '9999999999',
    salesmanId: meta.salesmanId || '001',
    items: formattedItems,
    meta: {
      orderRemarks: meta.orderRemarks || 'App Test Order',
      shipName: meta.shipName || '',
      shipAddress1: meta.shipAddress1 || '',
    }
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to place order');
  }

  const result = await response.json();
  return result.data;
}
