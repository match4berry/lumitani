import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { LandingPage } from './components/LandingPage';
import { CatalogPage } from './components/CatalogPage';
import { AllCategoriesPage } from './components/AllCategoriesPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProfilePage } from './components/ProfilePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { WishlistPage } from './components/WishlistPage';
import { AddressesPage } from './components/AddressesPage';
import { SettingsPage } from './components/SettingsPage';

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/catalog/:type",
    Component: CatalogPage,
  },
  {
    path: "/categories",
    Component: AllCategoriesPage,
  },
  {
    path: "/product/:productId",
    Component: ProductDetailPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/cart",
    Component: CartPage,
  },
  {
    path: "/checkout",
    Component: CheckoutPage,
  },
  {
    path: "/order-success/:orderId",
    Component: OrderSuccessPage,
  },
  {
    path: "/my-orders",
    Component: MyOrdersPage,
  },
  {
    path: "/order-detail/:orderId",
    Component: OrderDetailPage,
  },
  {
    path: "/wishlist",
    Component: WishlistPage,
  },
  {
    path: "/addresses",
    Component: AddressesPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <RouterProvider router={router} />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}