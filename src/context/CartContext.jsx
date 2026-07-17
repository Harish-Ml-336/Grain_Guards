import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('gg-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gg-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, qty) => {
    // Unique ID combining marketplace category and item ID to prevent collisions
    const itemId = `${item.type || 'product'}-${item.id}`;
    
    setCart(prev => {
      const idx = prev.findIndex(i => i.uniqueId === itemId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...prev[idx], qty: qty };
        return updated;
      } else {
        return [...prev, { 
          ...item, 
          uniqueId: itemId, 
          qty,
          name: item.name || item.title || "Product"
        }];
      }
    });
  };

  const removeFromCart = (uniqueId) => {
    setCart(prev => prev.filter(i => i.uniqueId !== uniqueId));
  };

  const updateQty = (uniqueId, qty) => {
    setCart(prev => prev.map(item => 
      item.uniqueId === uniqueId ? { ...item, qty: Math.max(1, qty) } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
