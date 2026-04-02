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
  status: OrderStatus;
  total_price: string;
  order_date: string;
  created_at: string;
  updated_at: string;
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
  is_active: boolean;
  farmer_name?: string;
  commodity_name?: string;
  grade_name?: string;
  current_price?: string | null;
  created_at: string;
  updated_at: string;
}
