import { createSlice } from '@reduxjs/toolkit';

const getSavedWishlist = () => {
  try {
    const saved = localStorage.getItem('learnix_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  wishlistItems: getSavedWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const course = action.payload;
      if (!course) return;
      const courseId = (course.id || course._id)?.toString();
      if (!courseId) return;

      const exists = state.wishlistItems.some((item) => {
        const itemId = (item.id || item._id)?.toString();
        return itemId === courseId;
      });

      if (!exists) {
        state.wishlistItems.push(course);
        localStorage.setItem('learnix_wishlist', JSON.stringify(state.wishlistItems));
      }
    },
    removeFromWishlist: (state, action) => {
      const courseId = action.payload?.toString();
      if (!courseId) return;
      state.wishlistItems = state.wishlistItems.filter((item) => {
        const itemId = (item.id || item._id)?.toString();
        return itemId !== courseId;
      });
      localStorage.setItem('learnix_wishlist', JSON.stringify(state.wishlistItems));
    },
    toggleWishlist: (state, action) => {
      const course = action.payload;
      if (!course) return;
      const courseId = (course.id || course._id)?.toString();
      if (!courseId) return;

      const exists = state.wishlistItems.some((item) => {
        const itemId = (item.id || item._id)?.toString();
        return itemId === courseId;
      });

      if (exists) {
        state.wishlistItems = state.wishlistItems.filter((item) => {
          const itemId = (item.id || item._id)?.toString();
          return itemId !== courseId;
        });
      } else {
        state.wishlistItems.push(course);
      }
      localStorage.setItem('learnix_wishlist', JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem('learnix_wishlist');
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
