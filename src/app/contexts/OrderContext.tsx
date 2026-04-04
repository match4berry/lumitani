import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OrderItem {
  productName: string;
  quantity: number;
  priceAtOrder: number;
  pricePerUnit: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  paymentMethod: 'Transfer Bank' | 'E-Wallet' | 'COD';
  status: 'Menunggu Pembayaran' | 'Menunggu Diproses' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
  createdAt: string;
  updatedAt: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: OrderItem[], shippingAddress: ShippingAddress, totalPrice: number, userId: string, paymentMethod: Order['paymentMethod']) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'lumitani_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load orders from localStorage on init
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever orders change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);

  const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `LT${timestamp}${random}`;
  };

  const createOrder = (
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    totalPrice: number,
    userId: string,
    paymentMethod: Order['paymentMethod']
  ): Order => {
    // Set status based on payment method
    const initialStatus: Order['status'] = 
      paymentMethod === 'COD' ? 'Menunggu Diproses' : 'Menunggu Pembayaran';

    const newOrder: Order = {
      id: generateOrderId(),
      userId,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
      status: initialStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  const getOrdersByUserId = (userId: string): Order[] => {
    return orders.filter((order) => order.userId === userId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getAllOrders = (): Order[] => {
    return orders;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
        getOrdersByUserId,
        updateOrderStatus,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}