// src/Components/AdminDashboard/AdminDashboard.jsx
import './AdminDashboard.css';
import React, { useState } from "react";
import { FaUsers, FaChartBar, FaSignOutAlt, FaClock } from "react-icons/fa";
import UsuariosTable from "./UsuariosTable";
import Reportes from "./Reportes";
import { logoutUser } from "../../api/api";

const NAV_ITEMS = [
  { key: "usuarios", label: "Usuarios", title: "Gestión de Usuarios", icon: FaUsers },
  { key: "reportes", label: "Reportes", title: "Reportes de Asistencia", icon: FaChartBar },
];

const AdminDashboard = ({ onLogout }) => {
  const [section, setSection] = useState("usuarios");

  const handleLogout = async () => {
    await logoutUser();
    onLogout(); // vuelve al Login
  };

  const activeItem = NAV_ITEMS.find((item) => item.key === section);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <FaClock className="sidebar-brand-icon" />
          <span>Asistencia</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={section === key ? "active" : ""}
              onClick={() => setSection(key)}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1>{activeItem?.title}</h1>
        </header>

        <div className="admin-content">
          {section === "usuarios" && <UsuariosTable />}
          {section === "reportes" && <Reportes />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
