export type PaymentMethodType = 'visa' | 'mastercard' | 'sinpe';

export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface PaymentMethod {
  id: string;
  label: string;
  last4: string;
  type: PaymentMethodType;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  routeId: string;
  routeName: string;
  fromStop: string;
  toStop: string;
  paidAt: Date;
  status: PaymentStatus;
  transactionId: string;
}
