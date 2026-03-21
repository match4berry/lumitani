import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import FarmersPage from "./pages/FarmersPage";
import CommoditiesPage from "./pages/CommoditiesPage";
import PricesPage from "./pages/PricesPage";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
