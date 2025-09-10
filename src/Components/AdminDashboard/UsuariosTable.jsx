// src/Components/AdminDashboard/UsuariosTable.jsx
import './AdminDashboard.css'; 
import React, { useEffect, useState } from "react";
import { getUsuarios, updateUsuario, deleteUsuario, createUsuario } from "../../api/api";
import * as XLSX from 'xlsx';

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rol: 'empleado'
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      alert("Error al cargar usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await deleteUsuario(id);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        alert("Error al eliminar usuario: " + error.message);
      }
    }
  };

  const handleToggleActivo = async (usuario) => {
    try {
      const actualizado = { ...usuario, activo: !usuario.activo };
      const res = await updateUsuario(usuario.id, actualizado);
      setUsuarios(usuarios.map((u) => (u.id === usuario.id ? res : u)));
    } catch (error) {
      alert("Error al actualizar usuario: " + error.message);
    }
  };

  // Funciones de edición
  const startEdit = (usuario) => {
    setEditingUser(usuario.id);
    setFormData({
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      activo: usuario.activo
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({});
  };

  const saveEdit = async () => {
    try {
      const res = await updateUsuario(editingUser, formData);
      setUsuarios(usuarios.map((u) => (u.id === editingUser ? res : u)));
      setEditingUser(null);
      setFormData({});
      alert("Usuario actualizado correctamente");
    } catch (error) {
      alert("Error al guardar cambios: " + error.message);
    }
  };

  // Funciones para crear usuario
  const handleCreateFormChange = (field, value) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateUser = async () => {
    try {
      // Validar campos obligatorios
      if (!createFormData.email || !createFormData.password || !createFormData.nombre || !createFormData.apellido) {
        alert("Todos los campos son obligatorios");
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createFormData.email)) {
        alert("Por favor ingresa un email válido");
        return;
      }

      // Validar contraseña
      if (createFormData.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      const newUser = await createUsuario(createFormData);
      setUsuarios([...usuarios, newUser]);
      
      // Limpiar formulario
      setCreateFormData({
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        rol: 'empleado'
      });
      setShowCreateForm(false);
      alert("Usuario creado correctamente");
    } catch (error) {
      alert("Error al crear usuario: " + error.message);
    }
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setCreateFormData({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      rol: 'empleado'
    });
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const dataToExport = usuarios.map(usuario => ({
      ID: usuario.id,
      Email: usuario.email,
      Nombre: usuario.nombre,
      Apellido: usuario.apellido,
      Rol: usuario.rol,
      Activo: usuario.activo ? 'Sí' : 'No',
      'Fecha de Registro': new Date(usuario.date_joined).toLocaleDateString(),
      'Último Login': usuario.last_login ? new Date(usuario.last_login).toLocaleDateString() : 'Nunca'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gestión de Usuarios</h2>
        <div className="header-buttons">
          <button 
            className="btn-create" 
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Crear Usuario
          </button>
          <button className="btn-export" onClick={exportToExcel}>
            📊 Exportar a Excel
          </button>
        </div>
      </div>

      {/* Formulario para crear usuario */}
      {showCreateForm && (
        <div className="create-form-overlay">
          <div className="create-form">
            <h3>Crear Nuevo Usuario</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => handleCreateFormChange('email', e.target.value)}
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => handleCreateFormChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={createFormData.nombre}
                  onChange={(e) => handleCreateFormChange('nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="form-group">
                <label>Apellido:</label>
                <input
                  type="text"
                  value={createFormData.apellido}
                  onChange={(e) => handleCreateFormChange('apellido', e.target.value)}
                  placeholder="Apellido"
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  value={createFormData.rol}
                  onChange={(e) => handleCreateFormChange('rol', e.target.value)}
                >
                  <option value="empleado">Empleado</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-save" onClick={handleCreateUser}>
                ✓ Crear Usuario
              </button>
              <button className="btn-cancel" onClick={cancelCreate}>
                ✕ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Login</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className={!usuario.activo ? 'inactive' : ''}>
                <td>
                  {editingUser === usuario.id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    usuario.email
                  )}
                </td>
                <td>
                  {editingUser === usuario.id ? (
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    usuario.nombre
                  )}
                </td>
                <td>
                  {editingUser === usuario.id ? (
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    usuario.apellido
                  )}
                </td>
                <td>
                  {editingUser === usuario.id ? (
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({...formData, rol: e.target.value})}
                      className="edit-select"
                    >
                      <option value="empleado">Empleado</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  ) : (
                    <span className={`rol-badge ${usuario.rol}`}>
                      {usuario.rol}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${usuario.activo ? 'active' : 'inactive'}`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  {usuario.last_login 
                    ? new Date(usuario.last_login).toLocaleString() 
                    : 'Nunca'
                  }
                </td>
                <td className="actions-cell">
                  {editingUser === usuario.id ? (
                    <>
                      <button className="btn-save" onClick={saveEdit}>
                        ✓ Guardar
                      </button>
                      <button className="btn-cancel" onClick={cancelEdit}>
                        ✕ Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-edit" 
                        onClick={() => startEdit(usuario)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className={`btn-toggle ${usuario.activo ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleActivo(usuario)}
                      >
                        {usuario.activo ? '🔒 Desactivar' : '🔓 Activar'}
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(usuario.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {usuarios.length === 0 && !loading && (
        <div className="no-data">No hay usuarios para mostrar</div>
      )}
    </div>
  );
};

export default UsuariosTable;