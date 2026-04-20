import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import FarmersPage from "./pages/FarmersPage";
import CommoditiesPage from "./pages/CommoditiesPage";
import PricesPage from "./pages/PricesPage";
import OrdersPage from "./pages/OrdersPage";
import CommissionPage from "./pages/CommissionPage";
import SalesReportPage from "./pages/SalesReportPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/farmers" element={<FarmersPage />} />
          <Route path="/commodities" element={<CommoditiesPage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/commissions" element={<CommissionPage />} />
          <Route path="/sales-report" element={<SalesReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
