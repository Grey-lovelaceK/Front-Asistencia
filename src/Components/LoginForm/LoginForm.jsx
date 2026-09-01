import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock, FaClock } from "react-icons/fa";
import { useAuth } from "../../auth/AuthProvider";

export const LoginForm = () => {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <FaClock className="brand-icon" />
          <div>
            <h1>Control de Asistencia</h1>
            <p className="brand-sub">Ingresa con tu cuenta de empleado o administrador</p>
          </div>
        </div>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>

        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
