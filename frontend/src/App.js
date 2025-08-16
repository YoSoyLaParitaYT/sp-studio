import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { mockUser } from "./mockData";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (credentials) => {
    console.log('Login with:', credentials);
    // Mock login - in real app, this would validate against backend
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
  };

  const handleSignup = (userData) => {
    console.log('Signup with:', userData);
    // Mock signup - in real app, this would create user in backend
    const newUser = {
      ...mockUser,
      name: userData.name,
      email: userData.email,
      subscription: {
        type: 'free_trial',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysRemaining: 30
      }
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <HomePage user={currentUser} onSignOut={handleSignOut} />
              ) : showSignup ? (
                <SignupPage 
                  onSignup={handleSignup} 
                  onSwitchToLogin={handleSwitchToLogin}
                />
              ) : (
                <LoginPage 
                  onLogin={handleLogin} 
                  onSwitchToSignup={handleSwitchToSignup}
                />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;