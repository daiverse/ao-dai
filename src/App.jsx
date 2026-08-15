import React, { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Layout & Common Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/layout/CartDrawer";
import MobileMenu from "./components/layout/MobileMenu";
import ProductQuickView from "./components/common/ProductQuickView";
import Toast from "./components/common/Toast";
import FloatingAiAssistant from "./components/common/FloatingAiAssistant";
import AuthModal from "./components/auth/AuthModal";
import CheckoutModal from "./components/cart/CheckoutModal";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Express24hPage from "./pages/Express24hPage";
import Product360Page from "./pages/Product360Page";
import LookbookPage from "./pages/LookbookPage";
import DesignStudioPage from "./pages/DesignStudioPage";
import TryOnPage from "./pages/TryOnPage";
import HistoryPage from "./pages/HistoryPage";
import AboutPage from "./pages/AboutPage";
import JournalPage from "./pages/JournalPage";
import ContactPage from "./pages/ContactPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForTryOn, setSelectedProductForTryOn] = useState(null);
  const [isResetPage, setIsResetPage] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/reset-password/")) {
      setIsResetPage(true);
    }
  }, []);

  const handleNavigateToTryOn = (product) => {
    if (product) setSelectedProductForTryOn(product);
    setActiveTab("try-on");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateTo360 = () => {
    setActiveTab("360");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCurrentPage = () => {
    if (isResetPage) {
      return <ResetPasswordPage />;
    }

    switch (activeTab) {
      case "home":
        return (
          <HomePage
            onNavigate={setActiveTab}
            onTryOn={handleNavigateToTryOn}
            onRotate360={handleNavigateTo360}
          />
        );
      case "products":
        return (
          <ProductsPage
            onNavigate={setActiveTab}
            onTryOn={handleNavigateToTryOn}
            onRotate360={handleNavigateTo360}
          />
        );
      case "express24h":
        return (
          <Express24hPage
            onTryOn={handleNavigateToTryOn}
            onRotate360={handleNavigateTo360}
          />
        );
      case "360":
        return <Product360Page onTryOn={handleNavigateToTryOn} />;
      case "lookbook":
        return <LookbookPage />;
      case "design-studio":
        return (
          <DesignStudioPage
            onNavigate={setActiveTab}
            onNavigateToTryOn={handleNavigateToTryOn}
          />
        );
      case "try-on":
        return <TryOnPage selectedProductFromState={selectedProductForTryOn} />;
      case "history":
        return <HistoryPage onNavigateToTryOn={() => setActiveTab("try-on")} />;
      case "about":
        return <AboutPage />;
      case "journal":
        return <JournalPage />;
      case "contact":
        return <ContactPage />;
      default:
        return (
          <HomePage
            onNavigate={setActiveTab}
            onTryOn={handleNavigateToTryOn}
            onRotate360={handleNavigateTo360}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-gray-900 selection:bg-[#C85A32] selection:text-white">
      {/* Toast Notification */}
      <Toast />

      {/* Navigation Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsResetPage(false);
          setActiveTab(tab);
        }}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main Active Page Render */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer setActiveTab={(tab) => {
        setIsResetPage(false);
        setActiveTab(tab);
      }} />

      {/* Modals & Overlays */}
      <AuthModal />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <CartDrawer onNavigateToCheckout={() => setIsCheckoutOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsResetPage(false);
          setActiveTab(tab);
        }}
      />
      <ProductQuickView 
        onNavigateToTryOn={handleNavigateToTryOn}
        onNavigateTo360={handleNavigateTo360}
      />
      <FloatingAiAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
