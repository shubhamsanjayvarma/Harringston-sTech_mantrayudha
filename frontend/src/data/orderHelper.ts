import { PlacedOrder, CartItem, DeliveryLocation } from '../types';

export const LATEST_ORDER_KEY = 'novamart_latest_order_v1';
export const RECENT_ORDERS_KEY = 'novamart_recent_orders_v1';

export function saveOrder(order: PlacedOrder): void {
  try {
    localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(order));
    
    // Add to recent orders list
    const existingStr = localStorage.getItem(RECENT_ORDERS_KEY);
    const existing: PlacedOrder[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [order, ...existing.filter((o) => o.id !== order.id)].slice(0, 10);
    localStorage.setItem(RECENT_ORDERS_KEY, JSON.stringify(updated));

    // Dispatch event so active components can update live
    window.dispatchEvent(new CustomEvent('novamart_order_updated', { detail: order }));
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
}

export function getLatestOrder(): PlacedOrder | null {
  try {
    const stored = localStorage.getItem(LATEST_ORDER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const recent = getRecentOrders();
    if (recent.length > 0) {
      return recent[0];
    }
  } catch (e) {
    console.error('Failed to read latest order:', e);
  }
  return null;
}

export function getRecentOrders(): PlacedOrder[] {
  try {
    const stored = localStorage.getItem(RECENT_ORDERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read recent orders:', e);
  }
  return [];
}

export function createOrderFromCart(
  items: CartItem[],
  cartTotal: number,
  location: DeliveryLocation
): PlacedOrder {
  const deliveryFee = cartTotal >= 199 || cartTotal === 0 ? 0 : 29;
  const handlingFee = cartTotal > 0 ? 15 : 0;
  const total = cartTotal + deliveryFee + handlingFee;
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `NM-261003-${randomSuffix}`;

  return {
    id: `order_${Date.now()}_${randomSuffix}`,
    orderNumber,
    createdAt: dateStr,
    items: [...items],
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartTotal,
    deliveryFee,
    handlingFee,
    total,
    location: { ...location },
    status: 'Packing in dark store',
    estimatedArrival: location.eta || '10-15 mins',
    paymentMethod: 'UPI / NovaPay',
  };
}
