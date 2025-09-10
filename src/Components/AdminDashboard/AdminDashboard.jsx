// src/Components/AdminDashboard/AdminDashboard.jsx
import './AdminDashboard.css'; 
import React, { useState } from "react";
import UsuariosTable from "./UsuariosTable";
import Reportes from "./Reportes";
import { logoutUser } from "../../api/api";

const AdminDashboard = ({ onLogout }) => {
  const [section, setSection] = useState("usuarios");

  const handleLogout = async () => {
    await logoutUser();
    onLogout(); // vuelve al Login
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administrador</h1>

      <nav>
        <button onClick={() => setSection("usuarios")}>👤 Usuarios</button>
        <button onClick={() => setSection("reportes")}>📊 Reportes</button>
        <button onClick={handleLogout}>🚪 Cerrar sesión</button>
      </nav>

      <div className="dashboard-content">
        {section === "usuarios" && <UsuariosTable />}
        {section === "reportes" && <Reportes />}
      </div>
    </div>
  );
};

export default AdminDashboard;
