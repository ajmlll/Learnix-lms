import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import enrollmentService from '../../services/enrollmentService';
import authService from '../../services/authService';

const getSavedCart = () => {
  try {
    const saved = localStorage.getItem('learnix_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  cartItems: getSavedCart(),
  enrolledCourseIds: [],
  isEnrollmentsLoading: false,
  isCartLoading: false,
  error: null,
};

// Async Thunk: Fetch enrollments from MongoDB
export const fetchEnrollments = createAsyncThunk(
  'cart/fetchEnrollments',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      return [];
    }
    try {
      const enrollments = await enrollmentService.getMyCourses();
      const ids = (enrollments || [])
        .map((item) => {
          const cId = item.course?.id || item.course?._id || item.course;
          return cId ? cId.toString() : null;
        })
        .filter(Boolean);

      return Array.from(new Set(ids));
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch enrollments');
    }
  }
);

// Async Thunk: Fetch cart from MongoDB
export const fetchDBCart = createAsyncThunk(
  'cart/fetchDBCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) {
      return getSavedCart();
    }
    try {
      const dbCart = await authService.getCart();
      if (dbCart && Array.isArray(dbCart)) {
        localStorage.setItem('learnix_cart', JSON.stringify(dbCart));
        return dbCart;
      }
      return getSavedCart();
    } catch (err) {
      console.warn('[cartSlice] Failed to fetch cart from MongoDB, using local fallback:', err.message);
      return getSavedCart();
    }
  }
);

// Async Thunk: Add to Cart in MongoDB
export const syncAddToCart = createAsyncThunk(
  'cart/syncAddToCart',
  async (course, { getState, dispatch, rejectWithValue }) => {
    dispatch(cartSlice.actions.addToCartLocal(course));
    const { auth } = getState();
    if (auth.user) {
      try {
        const courseId = (course.id || course._id)?.toString();
        if (courseId) {
          const dbCart = await authService.addToCart(courseId);
          return dbCart;
        }
      } catch (err) {
        console.error('[cartSlice] Failed to sync cart item to MongoDB:', err.message);
      }
    }
    return null;
  }
);

// Async Thunk: Remove from Cart in MongoDB
export const syncRemoveFromCart = createAsyncThunk(
  'cart/syncRemoveFromCart',
  async (courseId, { getState, dispatch, rejectWithValue }) => {
    dispatch(cartSlice.actions.removeFromCartLocal(courseId));
    const { auth } = getState();
    if (auth.user && courseId) {
      try {
        const dbCart = await authService.removeFromCart(courseId.toString());
        return dbCart;
      } catch (err) {
        console.error('[cartSlice] Failed to remove cart item from MongoDB:', err.message);
      }
    }
    return null;
  }
);

// Async Thunk: Clear Cart in MongoDB
export const syncClearCart = createAsyncThunk(
  'cart/syncClearCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    dispatch(cartSlice.actions.clearCartLocal());
    const { auth } = getState();
    if (auth.user) {
      try {
        await authService.clearCart();
      } catch (err) {
        console.error('[cartSlice] Failed to clear cart in MongoDB:', err.message);
      }
    }
    return null;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const course = action.payload;
      if (!course) return;
      const courseId = (course.id || course._id)?.toString();
      if (!courseId) return;

      const exists = state.cartItems.some((item) => {
        const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
        return itemId === courseId;
      });

      if (!exists) {
        state.cartItems.push(course);
        localStorage.setItem('learnix_cart', JSON.stringify(state.cartItems));
      }
    },
    removeFromCartLocal: (state, action) => {
      const courseId = action.payload?.toString();
      if (!courseId) return;
      state.cartItems = state.cartItems.filter((item) => {
        const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
        return itemId !== courseId;
      });
      localStorage.setItem('learnix_cart', JSON.stringify(state.cartItems));
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
      localStorage.removeItem('learnix_cart');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.isEnrollmentsLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.isEnrollmentsLoading = false;
        state.enrolledCourseIds = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.isEnrollmentsLoading = false;
        state.error = action.payload;
      })
      // Fetch MongoDB Cart
      .addCase(fetchDBCart.pending, (state) => {
        state.isCartLoading = true;
      })
      .addCase(fetchDBCart.fulfilled, (state, action) => {
        state.isCartLoading = false;
        if (action.payload && Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
      })
      .addCase(fetchDBCart.rejected, (state) => {
        state.isCartLoading = false;
      })
      // Sync Add
      .addCase(syncAddToCart.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
      })
      // Sync Remove
      .addCase(syncRemoveFromCart.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
      });
  },
});

export const { addToCartLocal, removeFromCartLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
