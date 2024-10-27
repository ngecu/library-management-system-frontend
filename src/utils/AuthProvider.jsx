import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const userDetails = JSON.parse(localStorage.getItem("login"));
    const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(()=>{
    if(userDetails){
        setToken(userDetails.token)
        setRole(userDetails.role)
    }
  },[])


  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("role"); // Remove role
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
