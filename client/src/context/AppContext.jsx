import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setSearchQuery,
  setNotificationCount,
} from '../store/slices/uiSlice';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isSidebarOpen, searchQuery, notificationCount } = useSelector(
    (state) => state.ui
  );

  const handleToggleSidebar = () => dispatch(toggleSidebar());
  const handleCloseSidebar = () => dispatch(closeSidebar());
  const handleOpenSidebar = () => dispatch(openSidebar());
  const handleSetSearchQuery = (q) => dispatch(setSearchQuery(q));
  const handleSetNotificationCount = (count) => dispatch(setNotificationCount(count));

  const value = {
    isSidebarOpen,
    toggleSidebar: handleToggleSidebar,
    closeSidebar: handleCloseSidebar,
    openSidebar: handleOpenSidebar,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    notificationCount,
    setNotificationCount: handleSetNotificationCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
