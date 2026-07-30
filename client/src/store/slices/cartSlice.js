import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import enrollmentService from '../../services/enrollmentService';

// Helper to get saved cart from localStorage
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
  error: null,
};

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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
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
        try {
          localStorage.setItem('learnix_cart', JSON.stringify(state.cartItems));
        } catch (e) {
          console.error('[cartSlice] Failed to save cart to localStorage:', e);
        }
      }
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload?.toString();
      if (!courseId) return;
      state.cartItems = state.cartItems.filter((item) => {
        const itemId = (item.id || item._id || item.course?.id || item.course?._id)?.toString();
        return itemId !== courseId;
      });
      try {
        localStorage.setItem('learnix_cart', JSON.stringify(state.cartItems));
      } catch (e) {
        console.error('[cartSlice] Failed to save cart to localStorage:', e);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      try {
        localStorage.removeItem('learnix_cart');
      } catch (e) {
        console.error('[cartSlice] Failed to clear cart from localStorage:', e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
