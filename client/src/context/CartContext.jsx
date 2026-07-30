import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  fetchEnrollments,
} from '../store/slices/cartSlice';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, enrolledCourseIds, isEnrollmentsLoading } = useSelector(
    (state) => state.cart
  );

  const refetchEnrollments = useCallback(() => {
    dispatch(fetchEnrollments());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchEnrollments());
    }
  }, [dispatch, user]);

  const isInCart = useCallback(
    (courseId) => {
      if (!courseId) return false;
      const targetId = courseId.toString();
      return cartItems.some((item) => {
        const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
        return itemId === targetId;
      });
    },
    [cartItems]
  );

  const isEnrolled = useCallback(
    (courseId) => {
      if (!courseId) return false;
      const targetId = courseId.toString();
      return enrolledCourseIds.includes(targetId);
    },
    [enrolledCourseIds]
  );

  const addToCart = useCallback(
    (course) => {
      dispatch(addToCartAction(course));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (courseId) => {
      dispatch(removeFromCartAction(courseId));
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    isEnrolled,
    isEnrollmentsLoading,
    refetchEnrollments,
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
