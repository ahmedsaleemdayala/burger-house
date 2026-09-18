import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import BackToTop from "./components/BackToTop.jsx";
import OrderModal from "./components/OrderModal.jsx";
import CartBar from "./components/CartBar.jsx";
import { CartProvider } from "./lib/cart.jsx";
import { trackVisit } from "./lib/track.js";

// Route-level code splitting => faster first load
const Home = lazy(() => import("./pages/Home.jsx"));
const Menu = lazy(() => import("./pages/Menu.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center" role="status" aria-label="Loading page">
      <div className="h-12 w-12 rounded-full border-4 border-line border-t-ember animate-spin" />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    trackVisit(pathname);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <CartProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1a1a1f", color: "#faf7f2", border: "1px solid #2a2a31" } }} />
      <Navbar />
      <main id="main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <CartBar />}
      <OrderModal />
      <BackToTop />
    </CartProvider>
  );
}
