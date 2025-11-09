import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import AddPlan from './AddPlan';
import ModifyPlan from './ModifyPlan';
import DeletePlan from './DeletePlan';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import './App.css';
import BookRoom from './BookRoom';
import { getOfflineChanges, clearOfflineChanges } from './offlineSync';
import axios from './axiosConfig';
import { createContext, useState, useEffect } from 'react';

// Create global auth context
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncOfflineData = async () => {
      const offlineData = getOfflineChanges();
      if (offlineData.length === 0) return;

      for (const change of offlineData) {
        try {
          await axios.put(`/update-floorplan/${change.planId}`, change.changes);
          console.log(`Synced floor plan ${change.planId} successfully.`);
        } catch (err) {
          console.error('Sync error:', err);
        }
      }
      clearOfflineChanges();
      alert('Offline changes have been synced with the server.');
    };

    window.addEventListener('online', syncOfflineData);
    return () => window.removeEventListener('online', syncOfflineData);
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ifms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Store user in localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem('ifms_user', JSON.stringify(user));
    else localStorage.removeItem('ifms_user');
  }, [user]);

  // Simple protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} index />
          <Route path="/home" element={<Home />} />
          <Route
            path="/add-plan"
            element={
              <ProtectedRoute>
                <AddPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modify-plan"
            element={
              <ProtectedRoute>
                <ModifyPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-plan"
            element={
              <ProtectedRoute>
                <DeletePlan />
              </ProtectedRoute>
            }
          />
          <Route path="/book-room" element={<BookRoom />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
