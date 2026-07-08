/**
 * services/marg/orderService.js
 * ─────────────────────────────────────────────────────────────
 * Wraps the two order-related Marg endpoints:
 *   - InsertOrderDetail          → place an order (Checkout screen)
 *   - LiveOrderDispatchStatus2017 → track order/dispatch status (Order History screen)
 */

const { margPost } = require('./margClient');
const { parseMaybeEncrypted } = require('../../utils/margCrypto');
const config = require('../../config');

/**
 * Places an order in Marg ERP.
 *
 * @param {object} order
 * @param {string} order.customerId - Marg customer Row ID (Party.rid, not the code!)
 * @param {string} order.salesmanId - Marg Sales Man Row ID (Sid)
 * @param {Array}  order.items - [{ productCode, quantity, free }]
 * @param {object} order.meta - optional: address, remarks, paymentMode, etc.
 */
async function placeOrder(order) {
  // NOTE: Marg's InsertOrderDetail API takes ONE product per call (see the sample
  // params — ProductCode/Quantity are singular, not an array). For a multi-item
  // cart, we call this once per line item. CONFIRM with Marg support whether a
  // batch/multi-line variant exists — calling once per item works but is not
  // atomic (a failure partway through leaves a partial order in Marg).
  const results = [];

  for (const item of order.items) {
    const body = {
      OrderID: '', // Marg auto-generates this — leave blank on insert
      OrderNo: order.orderNo || '0',
      CustomerID: order.customerId,
      MargID: config.marg.margId,
      Type: 'S', // Sales Man — per Marg's default
      Sid: order.salesmanId,
      ProductCode: item.productCode,
      Quantity: String(item.quantity),
      Free: String(item.free || 0),
      Lat: order.meta?.lat || '',
      Lng: order.meta?.lng || '',
      Address: order.meta?.address || '',
      GpsID: '0',
      UserType: '1',
      Points: '0.00',
      Discounts: String(order.meta?.discount || '0'),
      Transport: order.meta?.transport || '',
      Delivery: order.meta?.delivery || '',
      Bankname: '',
      BankAdd1: '',
      BankAdd2: '',
      shipname: order.meta?.shipName || '',
      shipAdd1: order.meta?.shipAddress1 || '',
      shipAdd2: order.meta?.shipAddress2 || '',
      shipAdd3: order.meta?.shipAddress3 || '',
      paymentmode: order.meta?.paymentMode || '1',
      paymentmodeAmount: String(order.meta?.paymentAmount || '0'),
      payment_remarks: order.meta?.paymentRemarks || '',
      order_remarks: order.meta?.orderRemarks || '',
      CustName: order.customerName || '',
      CustMobile: order.customerMobile || '',
      CompanyCode: config.marg.companyCode,
      OrderFrom: config.marg.companyCode,
    };

    const rawResponse = await margPost('InsertOrderDetail', body);
    const parsed = parseMaybeEncrypted(rawResponse, config.marg.decryptionKey);
    results.push(parsed);
  }

  return results;
}

/**
 * Fetches live dispatch/order status for a salesman's orders.
 * Used to power the Order History screen.
 *
 * @param {string} salesmanId - Marg SalesmanID
 * @param {string} since - ISO datetime for incremental sync, blank = all
 */
async function getOrderDispatchStatus(salesmanId, since = '') {
  const body = {
    CompanyCode: config.marg.companyCode,
    MargID: config.marg.margId,
    SalesmanID: salesmanId,
    Type: 'S',
    Datetime: since,
    index: '0',
  };

  const rawResponse = await margPost('LiveOrderDispatchStatus2017', body);
  const parsed = parseMaybeEncrypted(rawResponse, config.marg.decryptionKey);

  const orders = (parsed.OrderMain || []).map(mapOrder);
  return { orders, lastSyncedAt: parsed.DateTime, status: parsed.Status };
}

/** Maps Marg's OrderMain record into our app's Order History card shape. */
function mapOrder(margOrder) {
  return {
    id: margOrder.OrderNo?.trim(),
    voucherNo: margOrder.Vcn?.trim(),
    date: margOrder.Dt,
    total: parseFloat(margOrder.Amount) || 0,
    productCode: margOrder.Code?.trim(),
    salesmanCode: margOrder.Smncode?.trim(),
    // Marg doesn't give a simple Pending/Approved/Dispatched enum directly —
    // status is typically inferred from which date fields are populated:
    //   DateSub only → Pending, + Dateisu → Approved, + Datedis → Dispatched
    // CONFIRM this interpretation with Marg support for your account's workflow.
  };
}

module.exports = { placeOrder, getOrderDispatchStatus, mapOrder };
