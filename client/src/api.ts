const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

const api = {
  // Farmers
  getFarmers: () => request<import("./types").Farmer[]>("/farmers"),
  createFarmer: (data: { name: string; phone?: string; address?: string }) =>
    request<import("./types").Farmer>("/farmers", { method: "POST", body: JSON.stringify(data) }),
  updateFarmer: (id: number, data: { name: string; phone?: string; address?: string; is_active?: boolean }) =>
    request<import("./types").Farmer>("/farmers/" + id, { method: "PUT", body: JSON.stringify(data) }),
  deleteFarmer: (id: number) =>
    request("/farmers/" + id, { method: "DELETE" }),

  // Commodities
  getCommodities: () => request<import("./types").Commodity[]>("/commodities"),
  createCommodity: (data: { name: string; description?: string }) =>
    request<import("./types").Commodity>("/commodities", { method: "POST", body: JSON.stringify(data) }),
  updateCommodity: (id: number, data: { name: string; description?: string }) =>
    request<import("./types").Commodity>("/commodities/" + id, { method: "PUT", body: JSON.stringify(data) }),
  deleteCommodity: (id: number) =>
    request("/commodities/" + id, { method: "DELETE" }),

  // Grades
  getGrades: (commodityId?: number) =>
    request<import("./types").Grade[]>("/grades" + (commodityId ? `?commodity_id=${commodityId}` : "")),
  createGrade: (data: { commodity_id: number; name: string; description?: string }) =>
    request<import("./types").Grade>("/grades", { method: "POST", body: JSON.stringify(data) }),
  updateGrade: (id: number, data: { commodity_id: number; name: string; description?: string }) =>
    request<import("./types").Grade>("/grades/" + id, { method: "PUT", body: JSON.stringify(data) }),
  deleteGrade: (id: number) =>
    request("/grades/" + id, { method: "DELETE" }),

  // Prices
  getPrices: (gradeId?: number) =>
    request<import("./types").CommodityPrice[]>("/prices" + (gradeId ? `?grade_id=${gradeId}` : "")),
  getActivePrice: (gradeId: number) =>
    request<import("./types").CommodityPrice>("/prices/active/" + gradeId),
  createPrice: (data: { grade_id: number; price: number; start_date: string; end_date: string }) =>
    request<import("./types").CommodityPrice>("/prices", { method: "POST", body: JSON.stringify(data) }),
  updatePrice: (id: number, data: { price: number; start_date: string; end_date: string; is_active: boolean }) =>
    request<import("./types").CommodityPrice>("/prices/" + id, { method: "PUT", body: JSON.stringify(data) }),
  deletePrice: (id: number) =>
    request("/prices/" + id, { method: "DELETE" }),

  // Products
  getProducts: () => request<import("./types").Product[]>("/products"),
  createProduct: (data: {
    farmer_id: number; commodity_id: number; grade_id: number;
    name: string; description?: string; stock?: number; photo_url?: string;
    keunggulan_produk?: string[]; panen_terakhir?: string;
  }) => request<import("./types").Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: {
    farmer_id: number; commodity_id: number; grade_id: number;
    name: string; description?: string; stock?: number; photo_url?: string;
    keunggulan_produk?: string[]; panen_terakhir?: string;
  }) => request<import("./types").Product>("/products/" + id, { method: "PUT", body: JSON.stringify(data) }),
  toggleProduct: (id: number) =>
    request<import("./types").Product>("/products/" + id + "/toggle", { method: "PATCH" }),
  deleteProduct: (id: number) =>
    request("/products/" + id, { method: "DELETE" }),

  // Orders
  getOrders: () => request<import("./types").Order[]>("/orders"),
  getOrder: (id: number) => request<import("./types").Order>("/orders/" + id),
  getOrderSummary: () => request<import("./types").OrderStatusSummary>("/orders/summary"),
  updateOrderStatus: (id: number, status: import("./types").OrderStatus) =>
    request<import("./types").Order>("/orders/" + id + "/status", { method: "PATCH", body: JSON.stringify({ status }) }),

  // Users
  getUsers: () => request<import("./types").User[]>("/users"),
  getUser: (id: number) => request<import("./types").User>("/users/" + id),
  createUser: (data: { name: string; email: string; phone?: string; address?: string; role?: string }) =>
    request<import("./types").User>("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: number, data: { name: string; email: string; phone?: string; address?: string; role?: string; is_active?: boolean }) =>
    request<import("./types").User>("/users/" + id, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: number) =>
    request("/users/" + id, { method: "DELETE" }),

  // Commissions
  getCommissionSettings: () => request<import("./types").CommissionSettings>("/commissions/settings"),
  updateCommissionSettings: (rate: number) =>
    request<import("./types").CommissionSettings>("/commissions/settings", { method: "PUT", body: JSON.stringify({ rate }) }),
  getCommissionReport: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    const qs = params.toString();
    return request<import("./types").CommissionReport>("/commissions/report" + (qs ? `?${qs}` : ""));
  },
};

export default api;
