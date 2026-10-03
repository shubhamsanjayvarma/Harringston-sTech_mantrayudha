export interface Product {
  id: string;
  sku?: string;
  name: string;
  subtitle: string;
  category: string;
  subcategory?: string;
  brand?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  stockQuantity?: number;
  warrantyMonths?: number;
  returnable?: boolean;
  replacementAvailable?: boolean;
  deliveryTime: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  weightKg?: number;
  color?: string;
  status?: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryLocation {
  id: string;
  area: string;
  city: string;
  pincode: string;
  eta: string;
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  productName: string;
  category: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  itemStatus: string;
  returnStatus: string;
  refundAmount: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  shippingAddress: string;
  city: string;
  state: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string;
  trackingNumber: string;
  courier: string;
  deliveryStatus: string;
  deliveryOtpVerified: boolean;
  cancellationStatus: string;
  refundStatus: string;
  items: OrderItem[];
}

export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  customerSince: string;
  customerSegment: string;
  accountStatus: string;
  preferredLanguage: string;
  totalOrders: number;
  totalSpend: number;
  loyaltyTier: string;
}

export interface Review {
  reviewId: string;
  productId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title: string;
  reviewText: string;
  reviewDate: string;
  verifiedPurchase: boolean;
  helpfulVotes: number;
}

export interface SupportTicket {
  ticketId: string;
  customerId: string;
  orderId: string;
  createdAt: string;
  category: string;
  subcategory: string;
  priority: string;
  status: string;
  assignedTeam: string;
  issueSummary: string;
  resolution: string;
  createdBy: string;
  resolvedAt: string;
  conversationId?: string;
}

export interface StorePolicy {
  id: string;
  filename: string;
  title: string;
  content: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  total: number;
  location: DeliveryLocation;
  status: 'Order Placed' | 'Packing in dark store' | 'On the way' | 'Delivered';
  estimatedArrival: string;
  paymentMethod: string;
}
