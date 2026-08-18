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

  // 1. Tải giỏ hàng trực tiếp từ Database Server theo tài khoản User
  useEffect(() => {
    const fetchUserCartFromDB = async () => {
      if (!token || !isAuthenticated) {
        setCart([]); // Đăng xuất: Xóa giỏ trình duyệt, giữ nguyên dữ liệu lưu trong DB của tài khoản user
        return;
      }

      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data && Array.isArray(data.data.items)) {
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
        console.error("Lỗi khi tải giỏ hàng từ Database:", err);
      }
    };

    fetchUserCartFromDB();
  }, [token, isAuthenticated]);

  // 2. Thêm vào giỏ hàng -> Lưu trực tiếp vào Database của User
  const addToCart = async (product, size = "M", color = null, quantity = 1) => {
    if (!isAuthenticated || !token) {
      showToast("⚠️ Vui lòng đăng nhập để lưu sản phẩm vào giỏ hàng tài khoản của bạn!");
      openAuthModal("login");
      return;
    }

    const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "Tiêu chuẩn");

    try {
      const res = await fetch(API_URL, {
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

      const data = await res.json();

      if (data.success) {
        if (data.data && Array.isArray(data.data.items)) {
          const updatedItems = data.data.items.map((item) => ({
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
          setCart(updatedItems);
        } else {
          setCart((prevCart) => {
            const pId = product.id || product._id;
            const existingIndex = prevCart.findIndex(
              (item) => (item.product.id === pId || item.product._id === pId) && item.size === size && item.color === selectedColor
            );

            if (existingIndex > -1) {
              const updated = [...prevCart];
              updated[existingIndex].quantity += quantity;
              return updated;
            } else {
              return [...prevCart, { product, size, color: selectedColor, quantity }];
            }
          });
        }

        showToast(`🛍️ Đã lưu "${product.name}" vào giỏ hàng Database!`);
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error("Lỗi lưu giỏ hàng Database:", err);
      showToast("❌ Không thể lưu vào giỏ hàng Server.");
    }
  };

  // 3. Xóa sản phẩm khỏi giỏ trong Database
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
      } catch (err) {
        console.error("Lỗi xóa giỏ hàng Database:", err);
      }
    }
  };

  // 4. Cập nhật số lượng sản phẩm trong Database
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
      } catch (err) {
        console.error("Lỗi cập nhật giỏ hàng Database:", err);
      }
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
