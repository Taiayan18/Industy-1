
import { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ProfileDashboard from "./pages/ProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderCompletePage from "./pages/OrderCompletePage";
import WishlistPage from "./pages/WishlistPage";


// Pages that render without the public Header / Footer
const BARE_PATHS = [
  "/auth",
  "/dashboard",
  "/dashboard/products",
  "/dashboard/categories",
  "/dashboard/orders",
  "/dashboard/customers",
  "/dashboard/settings",
];

// Login-required routes
const RequireLogin = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  const location = useLocation();
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    const syncTokenFromStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncTokenFromStorage);

    return () => {
      window.removeEventListener("storage", syncTokenFromStorage);
    };
  }, []);

  const hideLayout = BARE_PATHS.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/check-out" element={<CheckoutPage />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/my-orders"
          element={
            <RequireLogin>
              <MyOrdersPage />
            </RequireLogin>
          }
        />

        <Route
          path="/order-complete"
          element={
            <RequireLogin>
              <OrderCompletePage />
            </RequireLogin>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireLogin>
              <ProfileDashboard />
            </RequireLogin>
          }
        />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/wishlist" element={<WishlistPage />} />

      
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
