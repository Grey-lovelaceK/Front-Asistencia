// src/App.js
import React from "react";
import { useAuth } from "./auth/AuthProvider";
import LoginForm from "./Components/LoginForm/LoginForm";
import EmpleadoPanel from "./Components/EmpleadoDashboard/EmpleadoPanel";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

function App() {
  const { usuario, logoutUser, loading } = useAuth();

  // 🔹 Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // 🔹 Si no hay usuario autenticado, mostrar login
  if (!usuario) return <LoginForm />;

  // 🔹 Renderizar según el rol
  if (usuario.rol === "empleado") {
    return <EmpleadoPanel onLogout={logoutUser} />;
  }

  if (usuario.rol === "administrador") {
    return <AdminDashboard onLogout={logoutUser} />;
  }

  return (
    <div>
      <h2>Rol desconocido: {usuario.rol}</h2>
      <button onClick={logoutUser}>Cerrar Sesión</button>
    </div>
  );
}

export default App;