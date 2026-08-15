import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_URL = "http://localhost:5000/api/cart";

export function CartProvider({ children }) {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tải giỏ hàng cá nhân của User từ Backend khi đăng nhập
  useEffect(() => {
    const fetchUserCart = async () => {
      if (!token || !isAuthenticated) {
        setCart([]);
        return;
      }

      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success && data.data && Array.isArray(data.data.items)) {
          // Normalize server cart format to local format
          const loadedItems = data.data.items.map((item) => ({
            _id: item._id,
            product: item.product || {
              id: item.productId || item._id,
              name: item.name,
              price: item.price,
              images: [item.image],
            },
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }));
          setCart(loadedItems);
        }
      } catch (err) {
        console.error("Lỗi khi tải giỏ hàng:", err);
      }
    };

    fetchUserCart();
  }, [token, isAuthenticated]);

  // Thêm vào giỏ hàng -> Bắt buộc Đăng Nhập
  const addToCart = async (product, size = "M", color = null, quantity = 1) => {
    // 1. Nếu chưa đăng nhập -> Chặn & mở Modal Đăng Nhập
    if (!isAuthenticated) {
      showToast("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      openAuthModal("login");
      return;
    }

    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Tiêu chuẩn");

    // 2. Thêm vào state local
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, size, color: selectedColor, quantity }];
      }
    });

    showToast(`Đã lưu "${product.name}" vào giỏ hàng của bạn!`);
    setIsCartOpen(true);

    // 3. Đồng bộ giỏ hàng lên Database Server
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id || product._id,
          name: product.name,
          image: product.images?.[0] || product.image || "",
          price: product.price,
          size,
          color: selectedColor,
          quantity,
        }),
      });
    } catch (err) {
      console.error("Lỗi đồng bộ giỏ hàng server:", err);
    }
  };

  // Xóa khỏi giỏ hàng
  const removeFromCart = async (index) => {
    const itemToRemove = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng.");

    if (isAuthenticated && token && itemToRemove?._id) {
      try {
        await fetch(`${API_URL}/${itemToRemove._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {}
    }
  };

  // Cập nhật số lượng
  const updateQuantity = async (index, delta) => {
    const itemToUpdate = cart[index];
    if (!itemToUpdate) return;

    const newQty = itemToUpdate.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });

    if (isAuthenticated && token && itemToUpdate?._id) {
      try {
        await fetch(`${API_URL}/${itemToUpdate._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQty }),
        });
      } catch (err) {}
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity,
    0
  );

  const formattedTotalPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalPrice);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
        formattedTotalPrice,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
