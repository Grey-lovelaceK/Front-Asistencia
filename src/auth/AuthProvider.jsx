// src/auth/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logoutUser as apiLogout, checkSession } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // 🔹 Para manejar el estado de carga

  // 🔹 Verificar sesión al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar si hay tokens y usuario en localStorage
        const storedUser = localStorage.getItem("usuario");
        const accessToken = localStorage.getItem("access_token");
        
        if (storedUser && accessToken) {
          // Verificar que la sesión sea válida
          const isValid = await checkSession();
          if (isValid) {
            setUsuario(JSON.parse(storedUser));
          } else {
            // Sesión inválida, limpiar storage
            localStorage.removeItem("usuario");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        // En caso de error, limpiar todo
        localStorage.removeItem("usuario");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const usuario = await apiLogin(email, password);
      setUsuario(usuario);
      return usuario;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logoutUserHandler = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUsuario(null);
    }
  };

  // 🔹 Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!usuario && !!localStorage.getItem("access_token");
  };

  // 🔹 Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return usuario && usuario.rol === "administrador";
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      loading,
      loginUser, 
      logoutUser: logoutUserHandler,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};