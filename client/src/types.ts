export interface Farmer {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Commodity {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: number;
  commodity_id: number;
  name: string;
  description: string | null;
  commodity_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CommodityPrice {
  id: number;
  grade_id: number;
  price: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  grade_name?: string;
  commodity_name?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'menunggu_proses' | 'diproses' | 'dikirim' | 'selesai';

export interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  user_id: number | null;
  user_name?: string;
  alamat?: string | null;
  pengiriman?: string | null;
  no_hp?: string | null;
  metode_pembayaran?: string | null;
  status: OrderStatus;
  total_price: string;
  commission_rate: string | null;
  commission_amount: string | null;
  order_date: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderStatusSummary {
  menunggu_proses: number;
  diproses: number;
  dikirim: number;
  selesai: number;
}

export interface Product {
  id: number;
  farmer_id: number;
  commodity_id: number;
  grade_id: number;
  name: string;
  description: string | null;
  stock: number;
  photo_url: string | null;
  keunggulan_produk: string[];
  panen_terakhir: string | null;
  is_active: boolean;
  farmer_name?: string;
  commodity_name?: string;
  grade_name?: string;
  current_price?: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommissionSettings {
  id: number | null;
  rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionReportSummary {
  total_orders: number;
  total_revenue: string;
  total_commission: string;
}

export interface CommissionOrder {
  id: number;
  order_code: string;
  customer_name: string;
  order_date: string;
  total_price: string;
  commission_rate: string;
  commission_amount: string;
  status: string;
}

export interface CommissionReport {
  summary: CommissionReportSummary;
  orders: CommissionOrder[];
}

export interface SalesReportSummary {
  gross_revenue: string;
  total_revenue: string;
  total_transactions: number;
  total_farmers: number;
}

export interface SalesReportFarmer {
  farmer_id: number;
  farmer_name: string;
  total_sales: string;
  total_transactions: number;
  avg_order_value: string;
}

export interface SalesReport {
  summary: SalesReportSummary;
  farmers: SalesReportFarmer[];
}
