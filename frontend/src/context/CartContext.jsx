import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, token } = useAuth();

  // Helper to normalize backend cart items vs local items
  const formatBackendCart = (cartData) => {
    if (!cartData || !cartData.items) return [];
    return cartData.items.map((item) => {
      const prod = item.product && typeof item.product === 'object' ? item.product : {};
      const rawPrice =
        prod.discountPrice !== undefined && prod.discountPrice !== null && prod.discountPrice > 0
          ? prod.discountPrice
          : (prod.price !== undefined && prod.price !== null ? prod.price : (item.price || 0));

      const itemImage =
        prod.images && prod.images.length > 0
          ? prod.images[0]
          : (prod.image || item.image || '');

      return {
        _id: prod._id || item._id,
        productId: prod._id || item.productId || (typeof item.product === 'string' ? item.product : item._id),
        name: prod.name || item.name || 'Product',
        price: Number(rawPrice) || 0,
        image: itemImage,
        quantity: Number(item.quantity) || 1,
        stock: prod.stock !== undefined ? prod.stock : item.stock,
      };
    });
  };

  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const data = await cartService.getCart();
        const formatted = formatBackendCart(data);
        setCart(formatted);
        localStorage.setItem('cart', JSON.stringify(formatted));
      } catch (err) {
        console.error('Failed to fetch cart from server:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const savedCart = localStorage.getItem('cart');
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, token]);

  const addToCart = async (product, quantity = 1) => {
    setError(null);
    const productId = product._id || product.productId || product.id;

    if (isAuthenticated) {
      try {
        const data = await cartService.addToCart(productId, quantity);
        const formatted = formatBackendCart(data.cart);
        setCart(formatted);
        localStorage.setItem('cart', JSON.stringify(formatted));
        window.dispatchEvent(new Event('cart-updated'));
        return data;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to add item';
        setError(msg);
        throw new Error(msg);
      }
    } else {
      // Guest cart logic
      let updatedCart = [...cart];
      const existingIndex = updatedCart.findIndex(item => item._id === productId || item.productId === productId);
      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += quantity;
      } else {
        const itemPrice =
          product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice > 0
            ? product.discountPrice
            : (product.price || 0);
        const itemImage =
          product.images && product.images.length > 0
            ? product.images[0]
            : (product.image || '');

        updatedCart.push({
          _id: productId,
          productId,
          name: product.name || 'Product',
          price: Number(itemPrice) || 0,
          image: itemImage,
          quantity,
          stock: product.stock,
        });
      }
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cart-updated'));
      // Return a resolved promise with the updated cart for consistency
      return { cart: updatedCart };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setError(null);
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const data = await cartService.updateCartItem(productId, quantity);
        const formatted = formatBackendCart(data.cart);
        setCart(formatted);
        localStorage.setItem('cart', JSON.stringify(formatted));
        window.dispatchEvent(new Event('cart-updated'));
        return data;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to update item';
        setError(msg);
        throw new Error(msg);
      }
    } else {
      const updatedCart = cart.map(item =>
        (item._id === productId || item.productId === productId)
          ? { ...item, quantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const removeFromCart = async (productId) => {
    setError(null);
    if (isAuthenticated) {
      try {
        const data = await cartService.removeFromCart(productId);
        const formatted = formatBackendCart(data.cart);
        setCart(formatted);
        localStorage.setItem('cart', JSON.stringify(formatted));
        window.dispatchEvent(new Event('cart-updated'));
        return data;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to remove item';
        setError(msg);
        throw new Error(msg);
      }
    } else {
      const updatedCart = cart.filter(item => item._id !== productId && item.productId !== productId);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const clearCart = async () => {
    setError(null);
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Failed to clear backend cart:', err);
      }
    }
    setCart([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    cart,
    loading,
    error,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
