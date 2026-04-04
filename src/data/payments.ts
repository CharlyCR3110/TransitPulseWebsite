import type { PaymentMethod, PaymentRecord } from '@/types/payments';

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm-1', label: 'Visa', last4: '4242', type: 'visa' },
  { id: 'pm-2', label: 'Mastercard', last4: '8891', type: 'mastercard' },
  { id: 'pm-3', label: 'SINPE Móvil', last4: '3847', type: 'sinpe' },
];

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);

export const paymentHistory: PaymentRecord[] = [
  {
    id: 'pay-1',
    amount: 1260,
    routeId: 'route-train-ca',
    routeName: 'INCOFER Cartago',
    fromStop: 'San José Central',
    toStop: 'Cartago Terminal',
    paidAt: daysAgo(0),
    status: 'completed',
    transactionId: 'TXN-20260403-001',
  },
  {
    id: 'pay-2',
    amount: 490,
    routeId: 'route-106',
    routeName: 'Bus 106',
    fromStop: 'Sabana Norte',
    toStop: 'Hatillo Centro',
    paidAt: daysAgo(1),
    status: 'completed',
    transactionId: 'TXN-20260402-018',
  },
  {
    id: 'pay-3',
    amount: 1050,
    routeId: 'route-train-pa',
    routeName: 'INCOFER Alajuela',
    fromStop: 'San José Central',
    toStop: 'Alajuela Central',
    paidAt: daysAgo(1),
    status: 'completed',
    transactionId: 'TXN-20260402-007',
  },
  {
    id: 'pay-4',
    amount: 610,
    routeId: 'route-200',
    routeName: 'Bus 200',
    fromStop: 'San José Central',
    toStop: 'Heredia Terminal',
    paidAt: daysAgo(2),
    status: 'failed',
    transactionId: 'TXN-20260401-032',
  },
  {
    id: 'pay-5',
    amount: 490,
    routeId: 'route-310',
    routeName: 'Bus 310',
    fromStop: 'Hatillo Centro',
    toStop: 'Aserrí',
    paidAt: daysAgo(3),
    status: 'completed',
    transactionId: 'TXN-20260331-014',
  },
];
