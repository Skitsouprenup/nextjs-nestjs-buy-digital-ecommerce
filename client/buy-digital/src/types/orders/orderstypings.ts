
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

interface CustomerAddress {
  city: string,
  country: string,
  line1: string,
  line2: string,
  postal_code: string,
  state: string
}

interface orderedItems {
  productId: string,
  quantity: number,
  skuCode: string,
  price: number,
  lifetime: boolean,
  validityInDays: number,
  skuPriceId: string,
  productImage: string,
  productName: string,
  licenseKeys: string[],
}

interface PaymentInfoType {
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  paymentDate: Date;
  paymentIntentId: string;
}

export interface OrderProperties {
  _id: string,
  orderId: string,
  userId: string,
  customerEmail: string,
  customerAddress: CustomerAddress,
  customerPhoneNumber: string,
  orderedItems: Array<orderedItems>,
  paymentInfo: PaymentInfoType,
  orderDate: Date, //Better create new Date Object when using this
  orderStatus: OrderStatus,
  orderDelivered: boolean,
  checkoutSessionId: string,
} 