import { 
  ALL_PRODUCTS, 
  ALL_ORDERS, 
  CURRENT_CUSTOMER, 
  CURRENT_CUSTOMER_ORDERS, 
  STORE_POLICIES 
} from '../data/storeData';
import { Product, Order } from '../types';

export interface ChatWidgetData {
  type: 
    | 'order_list'
    | 'order_detail'
    | 'products'
    | 'refund_stepper'
    | 'troubleshooting'
    | 'payment_info'
    | 'policy_info';
  orders?: Order[];
  selectedOrder?: Order;
  products?: Product[];
  policyTitle?: string;
  policySummary?: string;
  policyId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  senderName?: string;
  text: string;
  time: string;
  attachmentUrl?: string;
  widget?: ChatWidgetData;
  suggestions?: string[];
}

export function getCurrentTimeFormatted(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Intelligent local conversational processor for NovaMart
 */
export async function processUserMessage(
  userText: string,
  history: ChatMessage[],
  isHumanMode: boolean = false
): Promise<ChatMessage> {
  const text = userText.trim();
  const lower = text.toLowerCase();
  const time = getCurrentTimeFormatted();

  // If currently talking with Human Agent (Ananya)
  if (isHumanMode) {
    let agentReply = "I'm looking into that for you right now. Please allow me a moment to verify your account records.";
    if (lower.includes('refund') || lower.includes('money') || lower.includes('status')) {
      agentReply = "I have reviewed your return request TICK-00042 for order ORD-003621. Our logistics team is comparing the delivery timestamps with the courier logs. We will notify you via SMS once the inspection is approved.";
    } else if (lower.includes('track') || lower.includes('delivery') || lower.includes('order')) {
      agentReply = "Your order ORD-003621 is with RoadRunner Logistics under tracking number RRL9468219737. It is marked as packing/dispatched.";
    } else if (lower.includes('thank') || lower.includes('bye') || lower.includes('ok')) {
      agentReply = "You're very welcome! If you need anything else, feel free to reach out anytime. Have a wonderful day!";
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: 'Ananya · NovaMart Support',
      text: agentReply,
      time,
      suggestions: ['Check refund status', 'View invoice', 'Return to Nova Assist']
    };
  }

  // 1. Check for Order Tracking (e.g. "ORD-003621" or "track order")
  const orderIdMatch = text.match(/ORD-\d{6}/i);
  if (orderIdMatch) {
    const matchedId = orderIdMatch[0].toUpperCase();
    const foundOrder = ALL_ORDERS.find((o) => o.orderId.toUpperCase() === matchedId) ||
                       CURRENT_CUSTOMER_ORDERS.find((o) => o.orderId.toUpperCase() === matchedId);
    
    if (foundOrder) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        senderName: 'Nova Assist',
        text: `I located order ${foundOrder.orderId}. It was placed on ${foundOrder.orderDate.split(' ')[0]} for a total of ₹${foundOrder.totalAmount.toLocaleString('en-IN')}. Status: ${foundOrder.deliveryStatus.toUpperCase()} via ${foundOrder.courier} (Tracking: ${foundOrder.trackingNumber}).`,
        time,
        widget: {
          type: 'order_detail',
          selectedOrder: foundOrder
        },
        suggestions: [
          `Check return eligibility for ${foundOrder.orderId}`,
          'Track another order',
          'Talk to a person'
        ]
      };
    }
  }

  // Generic Order Tracking request
  if (
    lower.includes('track') ||
    lower.includes('where is my order') ||
    lower.includes('order status') ||
    lower.includes('show my orders') ||
    lower === 'track an order'
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: `Hello ${CURRENT_CUSTOMER.firstName}! Here are your recent orders from your NovaMart account. Click on any order to view real-time delivery and tracking updates:`,
      time,
      widget: {
        type: 'order_list',
        orders: CURRENT_CUSTOMER_ORDERS
      },
      suggestions: [
        'Track ORD-003621',
        'Track ORD-004897',
        'Return policy for tech items',
        'Help with payment'
      ]
    };
  }

  // 2. Returns & Refunds
  if (
    lower.includes('refund') || 
    lower.includes('return') || 
    lower.includes('damaged') || 
    lower.includes('broken') || 
    lower.includes('replace') ||
    lower === 'returns & refunds'
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: `I've pulled up your live return request TICK-00042 for order ORD-003621 (Voltix Air Spark Pro). Per NovaMart Return Policy v2, items are eligible for refund/replacement within 7 days subject to verification. Here is the current review status:`,
      time,
      widget: {
        type: 'refund_stepper',
        selectedOrder: CURRENT_CUSTOMER_ORDERS.find(o => o.orderId === 'ORD-003621') || CURRENT_CUSTOMER_ORDERS[0]
      },
      suggestions: [
        'Troubleshoot earbuds',
        'Where will the refund go?',
        'Talk to a person',
        'Read full return policy'
      ]
    };
  }

  // 3. Troubleshooting & Product Help
  if (
    lower.includes('troubleshoot') || 
    lower.includes('fix') || 
    lower.includes('won\'t turn on') || 
    lower.includes('won\'t connect') || 
    lower.includes('not working') || 
    lower.includes('bluetooth') ||
    lower.includes('sound issue') ||
    lower === 'product help'
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: "Here are quick diagnostic troubleshooting steps for your tech accessories and audio devices. Try these checks while your return request is under review:",
      time,
      widget: {
        type: 'troubleshooting'
      },
      suggestions: [
        'Check charging case',
        'Reset Bluetooth pairing',
        'Talk to a support specialist',
        'Track an order'
      ]
    };
  }

  // 4. Payments, Wallet, UPI & Billing
  if (
    lower.includes('payment') || 
    lower.includes('billing') || 
    lower.includes('upi') || 
    lower.includes('wallet') || 
    lower.includes('invoice') || 
    lower.includes('receipt') ||
    lower === 'payments & billing'
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: "Here is your payment and refund destination overview. If a refund is approved by our team, it is automatically routed back to your original payment method within 3-5 business days.",
      time,
      widget: {
        type: 'payment_info',
        selectedOrder: CURRENT_CUSTOMER_ORDERS.find(o => o.orderId === 'ORD-003621') || CURRENT_CUSTOMER_ORDERS[0]
      },
      suggestions: [
        'View invoice for ORD-003621',
        'Refund timeline details',
        'Talk to a person'
      ]
    };
  }

  // 5. Store Policies & FAQs
  if (
    lower.includes('policy') || 
    lower.includes('warranty') || 
    lower.includes('shipping fee') || 
    lower.includes('cancel') ||
    lower.includes('delivery time')
  ) {
    let matchedPolicy = STORE_POLICIES.find(p => lower.includes(p.id.replace(/_/g, ' ')));
    if (!matchedPolicy && lower.includes('return')) {
      matchedPolicy = STORE_POLICIES.find(p => p.id === 'return_policy_v2');
    } else if (!matchedPolicy && lower.includes('shipping')) {
      matchedPolicy = STORE_POLICIES.find(p => p.id === 'shipping_policy');
    } else if (!matchedPolicy && lower.includes('warranty')) {
      matchedPolicy = STORE_POLICIES.find(p => p.id === 'warranty_policy');
    } else if (!matchedPolicy && lower.includes('cancel')) {
      matchedPolicy = STORE_POLICIES.find(p => p.id === 'cancellation_policy');
    } else if (!matchedPolicy) {
      matchedPolicy = STORE_POLICIES[0];
    }

    const snippet = matchedPolicy ? matchedPolicy.content.slice(0, 320) + '...' : 'NovaMart offers a 7-day hassle-free replacement and return policy on eligible electronics.';

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: `Here is the relevant excerpt from NovaMart's official ${matchedPolicy?.title || 'Store Policy'}:`,
      time,
      widget: {
        type: 'policy_info',
        policyTitle: matchedPolicy?.title,
        policySummary: snippet,
        policyId: matchedPolicy?.id
      },
      suggestions: [
        'View all store policies',
        'Check return eligibility',
        'Talk to a person'
      ]
    };
  }

  // 6. Product Recommendations & Catalog Inquiries
  const productKeywords = [
    'laptop', 'phone', 'smartphone', 'headphone', 'earbud', 'earbuds', 'watch', 
    'smartwatch', 'keyboard', 'mouse', 'monitor', 'gaming', 'tablet', 'camera', 
    'charger', 'audio', 'recommend', 'buy', 'find', 'show me', 'deal', 'cheap', 'best'
  ];

  const matchedKeywords = productKeywords.filter(k => lower.includes(k));
  if (matchedKeywords.length > 0) {
    // Filter products
    const matches = ALL_PRODUCTS.filter(p => {
      const pText = `${p.name} ${p.category} ${p.subcategory} ${p.brand} ${p.description}`.toLowerCase();
      return matchedKeywords.some(k => pText.includes(k));
    });

    const topMatches = (matches.length > 0 ? matches : ALL_PRODUCTS).slice(0, 3);

    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: `I found ${matches.length} products matching your request in the NovaMart catalog. Here are our top rated picks with instant dispatch:`,
      time,
      widget: {
        type: 'products',
        products: topMatches
      },
      suggestions: [
        `Show more ${matchedKeywords[0] || 'tech'}`,
        'Check delivery to Bengaluru',
        'Track an order'
      ]
    };
  }

  // 7. Human Escalation
  if (
    lower.includes('human') || 
    lower.includes('person') || 
    lower.includes('agent') || 
    lower.includes('executive') || 
    lower.includes('support team')
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: "I'd be glad to connect you with our live customer support team. Would you like to connect with Ananya from NovaMart Support now?",
      time,
      suggestions: [
        'Yes, connect with Ananya',
        'No, continue with Nova Assist',
        'Track my order'
      ]
    };
  }

  // 8. General / Fallback Response
  return {
    id: `msg-${Date.now()}`,
    sender: 'bot',
    senderName: 'Nova Assist',
    text: `I'm here to help, ${CURRENT_CUSTOMER.firstName}! I can track your orders, look up products from our 300+ item tech catalog, explain return and refund policies, or connect you with a live support representative. What would you like to explore?`,
    time,
    suggestions: [
      'Track my order',
      'Returns & refunds',
      'Explore gaming laptops',
      'Talk to a person'
    ]
  };
}
