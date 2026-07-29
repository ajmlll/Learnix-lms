import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import enrollmentService from '../services/enrollmentService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [isEnrollmentsLoading, setIsEnrollmentsLoading] = useState(true);

  // Fetch student's enrollments whenever user is authenticated
  const fetchEnrollments = useCallback(async () => {
    if (!user) {
      setEnrolledCourseIds(new Set());
      setIsEnrollmentsLoading(false);
      return;
    }
    setIsEnrollmentsLoading(true);
    try {
      const enrollments = await enrollmentService.getMyCourses();
      const ids = new Set();
      (enrollments || []).forEach((item) => {
        const cId = item.course?.id || item.course?._id || item.course;
        if (cId) ids.add(cId.toString());
      });
      setEnrolledCourseIds(ids);
    } catch (err) {
      console.error('[CartContext] Failed to fetch user enrollments:', err);
    } finally {
      setIsEnrollmentsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // Check if a course is already in the shopping cart
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

  // Check if student is already enrolled in a course
  const isEnrolled = useCallback(
    (courseId) => {
      if (!courseId) return false;
      return enrolledCourseIds.has(courseId.toString());
    },
    [enrolledCourseIds]
  );

  // Add course to cart
  const addToCart = useCallback(
    (course) => {
      if (!course) return;
      const courseId = (course.id || course._id)?.toString();
      if (!courseId) return;

      setCartItems((prev) => {
        const exists = prev.some((item) => {
          const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
          return itemId === courseId;
        });
        if (exists) return prev;
        return [...prev, course];
      });
    },
    []
  );

  // Remove course from cart
  const removeFromCart = useCallback((courseId) => {
    if (!courseId) return;
    const targetId = courseId.toString();
    setCartItems((prev) =>
      prev.filter((item) => {
        const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
        return itemId !== targetId;
      })
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        isEnrolled,
        isEnrollmentsLoading,
        refetchEnrollments: fetchEnrollments,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
