import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: true,
  searchQuery: '',
  notificationCount: 3,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setSearchQuery,
  setNotificationCount,
} = uiSlice.actions;

export default uiSlice.reducer;
