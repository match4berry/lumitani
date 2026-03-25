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
  }) => request<import("./types").Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: {
    farmer_id: number; commodity_id: number; grade_id: number;
    name: string; description?: string; stock?: number; photo_url?: string;
  }) => request<import("./types").Product>("/products/" + id, { method: "PUT", body: JSON.stringify(data) }),
  toggleProduct: (id: number) =>
    request<import("./types").Product>("/products/" + id + "/toggle", { method: "PATCH" }),
  deleteProduct: (id: number) =>
    request("/products/" + id, { method: "DELETE" }),
};

export default api;
