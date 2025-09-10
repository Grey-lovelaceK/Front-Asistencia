import React, { useState } from "react";
import { marcarEntrada, marcarSalida } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import "./EmpleadoPanel.css";

const EmpleadoPanel = () => {
  const { usuario, logoutUser } = useAuth();
  const [mensaje, setMensaje] = useState("");

  const handleEntrada = async () => {
    try {
      const data = await marcarEntrada();
      setMensaje(data.mensaje);
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const handleSalida = async () => {
    try {
      const data = await marcarSalida();
      setMensaje(data.mensaje);
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  if (!usuario) return <p>No hay usuario logueado</p>;

  return (
    <div className="empleado-panel-container">
      <div className="empleado-card">
        <h2>Hola {usuario.nombre} 👋</h2>
        <span className="rol-badge">{usuario.rol.toUpperCase()}</span>

        <button className="btn-entrada" onClick={handleEntrada}>
          Marcar Entrada
        </button>
        <button className="btn-salida" onClick={handleSalida}>
          Marcar Salida
        </button>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default EmpleadoPanel;
