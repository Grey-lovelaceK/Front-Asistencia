// src/api/api.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// 🔹 Funciones para manejar tokens
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const setTokens = (tokens) => {
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("usuario");
};

// 🔹 Función para refrescar token automáticamente
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/usuarios/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return true;
    } else {
      clearTokens();
      return false;
    }
  } catch (error) {
    console.error("Error refrescando token:", error);
    clearTokens();
    return false;
  }
};

// 🔹 Función para hacer peticiones autenticadas
const makeAuthenticatedRequest = async (url, options = {}) => {
  let accessToken = getAccessToken();
  
  if (!accessToken) {
    throw new Error("No hay token de acceso");
  }

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      ...options.headers
    }
  };

  let response = await fetch(`${API_URL}${url}`, config);

  // Si el token expiró, intentar refrescarlo
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Reintentar con el nuevo token
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
      response = await fetch(`${API_URL}${url}`, config);
    } else {
      // Token refresh falló, redirigir al login
      clearTokens();
      window.location.reload();
      throw new Error("Sesión expirada");
    }
  }

  return response;
};

// 🔹 Login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error en login:", data);
      throw new Error(data.error || "Error al iniciar sesión");
    }

    // 🔹 Guardar tokens y usuario
    setTokens(data.tokens);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    console.log("✅ Login exitoso:", data.usuario);
    return data.usuario;
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
};

// 🔹 Logout
export const logoutUser = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await makeAuthenticatedRequest("/usuarios/auth/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
  } catch (error) {
    console.error("Error en logout:", error);
  } finally {
    clearTokens();
  }
};

// 🔹 Verificar sesión
export const checkSession = async () => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    const response = await makeAuthenticatedRequest("/usuarios/auth/check/");
    return response.ok;
  } catch (error) {
    console.error("Sesión inválida:", error.message);
    return false;
  }
};

// 🔹 CRUD de Usuarios

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await makeAuthenticatedRequest("/usuarios/");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener usuarios");

    console.log("Usuarios obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error en getUsuarios:", error.message);
    throw error;
  }
};

// 🔹 NUEVA: Crear usuario
export const createUsuario = async (usuarioData) => {
  try {
    const response = await makeAuthenticatedRequest("/usuarios/", {
      method: "POST",
      body: JSON.stringify(usuarioData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Error al crear usuario");
    }
    
    console.log("Usuario creado ✅", data);
    return data;
  } catch (error) {
    console.error("Error en createUsuario:", error.message);
    throw error;
  }
};

// Actualizar usuario
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await makeAuthenticatedRequest(`/usuarios/${id}/`, {
      method: "PUT",
      body: JSON.stringify(usuarioData),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Error al actualizar usuario");
    }
    
    console.log(`Usuario ${id} actualizado ✅`, data);
    return data;
  } catch (error) {
    console.error("Error en updateUsuario:", error.message);
    throw error;
  }
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  try {
    const response = await makeAuthenticatedRequest(`/usuarios/${id}/`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Error al eliminar usuario");
    }
    
    console.log(`Usuario ${id} eliminado ✅`);
    return { success: true };
  } catch (error) {
    console.error("Error en deleteUsuario:", error.message);
    throw error;
  }
};

// 🔹 Funciones de asistencia
export const marcarEntrada = async () => {
  const response = await makeAuthenticatedRequest("/asistencia/marcar-entrada/", {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al marcar entrada");
  console.log("Entrada marcada ✅", data);
  return data;
};

export const marcarSalida = async () => {
  const response = await makeAuthenticatedRequest("/asistencia/marcar-salida/", {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al marcar salida");
  console.log("Salida marcada ✅", data);
  return data;
};

// 🔹 Funciones de reportes
export const getReportesAtrasos = async () => {
  try {
    const response = await makeAuthenticatedRequest("/asistencia/reportes/atrasos/");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener reportes de atrasos");

    console.log("Reportes de atrasos:", data);
    return data;
  } catch (error) {
    console.error("Error en getReportesAtrasos:", error.message);
    throw error;
  }
};

export const getReportesInasistencias = async () => {
  try {
    const response = await makeAuthenticatedRequest("/asistencia/reportes/inasistencias/");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener reportes de inasistencias");

    console.log("Reportes de inasistencias:", data);
    return data;
  } catch (error) {
    console.error("Error en getReportesInasistencias:", error.message);
    throw error;
  }
};

export const getReportesSalidasAnticipadas = async () => {
  try {
    const response = await makeAuthenticatedRequest("/asistencia/reportes/salidas-anticipadas/");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener reportes de salidas anticipadas");

    console.log("Reportes de salidas anticipadas:", data);
    return data;
  } catch (error) {
    console.error("Error en getReportesSalidasAnticipadas:", error.message);
    throw error;
  }
};

// 🔹 NUEVA: Obtener todos los registros de asistencia
export const getTodosLosRegistros = async (fecha = null, usuario_id = null) => {
  try {
    let url = "/asistencia/todos-registros/";  // 👈 ahora sí al endpoint correcto
    const params = new URLSearchParams();
    
    if (fecha) params.append("fecha", fecha);
    if (usuario_id) params.append("usuario_id", usuario_id);
    
    if (params.toString()) {
      url += "?" + params.toString();
    }

    const response = await makeAuthenticatedRequest(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener registros");

    console.log("Todos los registros:", data);
    return data;
  } catch (error) {
    console.error("Error en getTodosLosRegistros:", error.message);
    throw error;
  }
};

// 🔹 NUEVA: Obtener registros por rango de fechas
export const getRegistrosPorRango = async (fecha_inicio, fecha_fin) => {
  try {
    const response = await makeAuthenticatedRequest(`/asistencia/registros/?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al obtener registros por rango");

    console.log("Registros por rango:", data);
    return data;
  } catch (error) {
    console.error("Error en getRegistrosPorRango:", error.message);
    throw error;
  }
};