import React, { useState, useEffect } from "react";
import { FaSignInAlt, FaSignOutAlt, FaPowerOff, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { marcarEntrada, marcarSalida } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import "./EmpleadoPanel.css";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const EmpleadoPanel = () => {
  const { usuario, logoutUser } = useAuth();
  const [mensaje, setMensaje] = useState(null); // { texto, tipo: 'ok' | 'error' }
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleEntrada = async () => {
    try {
      const data = await marcarEntrada();
      setMensaje({ texto: data.mensaje, tipo: "ok" });
    } catch (err) {
      setMensaje({ texto: err.message, tipo: "error" });
    }
  };

  const handleSalida = async () => {
    try {
      const data = await marcarSalida();
      setMensaje({ texto: data.mensaje, tipo: "ok" });
    } catch (err) {
      setMensaje({ texto: err.message, tipo: "error" });
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  if (!usuario) return <p>No hay usuario logueado</p>;

  const hora = ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fecha = `${DIAS[ahora.getDay()]} ${ahora.getDate()} de ${ahora.toLocaleDateString("es-CL", { month: "long" })}`;

  return (
    <div className="empleado-panel-container">
      <div className="empleado-card">
        <div className="empleado-topline">
          <div>
            <span className="empleado-greeting">Hola, {usuario.nombre}</span>
            <span className="rol-badge">{usuario.rol.toUpperCase()}</span>
          </div>
          <button className="btn-logout-icon" onClick={handleLogout} title="Cerrar sesión">
            <FaPowerOff />
          </button>
        </div>

        <div className="empleado-clock">
          <span className="empleado-clock-time">{hora}</span>
          <span className="empleado-clock-date">{fecha}</span>
        </div>

        <div className="empleado-actions">
          <button className="btn-entrada" onClick={handleEntrada}>
            <FaSignInAlt /> Marcar Entrada
          </button>
          <button className="btn-salida" onClick={handleSalida}>
            <FaSignOutAlt /> Marcar Salida
          </button>
        </div>

        {mensaje && (
          <p className={`mensaje ${mensaje.tipo}`}>
            {mensaje.tipo === "ok" ? <FaCheckCircle /> : <FaExclamationCircle />}
            {mensaje.texto}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmpleadoPanel;
