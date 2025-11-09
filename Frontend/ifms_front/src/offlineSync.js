// offlineSync.js
export const saveOfflineChange = (planId, changes) => {
  const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  offlineQueue.push({ planId, changes, timestamp: Date.now() });
  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
};

export const getOfflineChanges = () => {
  return JSON.parse(localStorage.getItem('offlineQueue') || '[]');
};

export const clearOfflineChanges = () => {
  localStorage.removeItem('offlineQueue');
};
