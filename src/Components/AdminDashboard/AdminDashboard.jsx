// src/Components/AdminDashboard/AdminDashboard.jsx
import './AdminDashboard.css';
import React, { useState } from "react";
import { FaUsers, FaChartBar, FaSignOutAlt, FaClock } from "react-icons/fa";
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
      <header className="dashboard-header">
        <div className="dashboard-title">
          <FaClock className="dashboard-title-icon" />
          <h1>Panel de Administrador</h1>
        </div>

        <nav>
          <button
            className={section === "usuarios" ? "active" : ""}
            onClick={() => setSection("usuarios")}
          >
            <FaUsers /> Usuarios
          </button>
          <button
            className={section === "reportes" ? "active" : ""}
            onClick={() => setSection("reportes")}
          >
            <FaChartBar /> Reportes
          </button>
          <button className="btn-logout-nav" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </nav>
      </header>

      <div className="dashboard-content">
        {section === "usuarios" && <UsuariosTable />}
        {section === "reportes" && <Reportes />}
      </div>
    </div>
  );
};

export default AdminDashboard;
