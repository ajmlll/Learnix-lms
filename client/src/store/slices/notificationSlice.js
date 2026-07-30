import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) return 0;
    try {
      const data = await notificationService.getUnreadCount();
      return data.count || 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = { page: 1, limit: 10 }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.user) return { notifications: [], pagination: {} };
    try {
      const data = await notificationService.getMyNotifications(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(fetchUnreadCount());
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      dispatch(fetchUnreadCount());
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark single read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        state.notifications = state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        );
      })
      // Mark all read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
