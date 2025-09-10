// src/Components/AdminDashboard/Reportes.jsx
import './AdminDashboard.css'; 
import React, { useEffect, useState } from "react";
import { 
  getReportesAtrasos, 
  getReportesInasistencias, 
  getReportesSalidasAnticipadas,
  getTodosLosRegistros 
} from "../../api/api";
import * as XLSX from 'xlsx';

const Reportes = () => {
  const [atrasos, setAtrasos] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [salidasAnticipadas, setSalidasAnticipadas] = useState([]);
  const [todosRegistros, setTodosRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('atrasos');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const [atrasosRes, inasistenciasRes, salidasRes, todosRes] = await Promise.all([
        getReportesAtrasos(),
        getReportesInasistencias(),
        getReportesSalidasAnticipadas(),
        getTodosLosRegistros()
      ]);

      setAtrasos(atrasosRes.reportes || []);
      setInasistencias(inasistenciasRes.usuarios_inasistentes || []);
      setSalidasAnticipadas(salidasRes.reportes || []);
      setTodosRegistros(todosRes.registros || []);
    } catch (error) {
      console.error("Error cargando reportes:", error);
      alert("Error al cargar reportes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarRegistrosPorFecha = () => {
    if (!filtroFecha) return todosRegistros;
    return todosRegistros.filter(registro => registro.fecha === filtroFecha);
  };

  // Funciones de exportación
  const exportAtrasosToExcel = () => {
    const dataToExport = atrasos.map(atraso => ({
      Empleado: `${atraso.usuario_info.nombre} ${atraso.usuario_info.apellido}`,
      Email: atraso.usuario_info.email,
      Fecha: atraso.fecha,
      Hora: atraso.hora,
      'Minutos de Retraso': Math.floor((new Date(`1970-01-01T${atraso.hora}`) - new Date(`1970-01-01T09:30:00`)) / 60000)
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Atrasos");
    XLSX.writeFile(wb, `reporte_atrasos_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportSalidasAnticipadasToExcel = () => {
    const dataToExport = salidasAnticipadas.map(salida => ({
      Empleado: `${salida.usuario_info.nombre} ${salida.usuario_info.apellido}`,
      Email: salida.usuario_info.email,
      Fecha: salida.fecha,
      'Hora de Salida': salida.hora,
      'Minutos Anticipados': Math.floor((new Date(`1970-01-01T17:30:00`) - new Date(`1970-01-01T${salida.hora}`)) / 60000)
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salidas Anticipadas");
    XLSX.writeFile(wb, `reporte_salidas_anticipadas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportInasistenciasToExcel = () => {
    const dataToExport = inasistencias.map(usuario => ({
      Nombre: usuario.nombre,
      Apellido: usuario.apellido,
      Email: usuario.email,
      Rol: usuario.rol,
      Fecha: new Date().toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inasistencias");
    XLSX.writeFile(wb, `reporte_inasistencias_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportTodosRegistrosToExcel = () => {
    const registrosParaExportar = filtrarRegistrosPorFecha();
    const dataToExport = registrosParaExportar.map(registro => ({
      Empleado: `${registro.usuario_info.nombre} ${registro.usuario_info.apellido}`,
      Email: registro.usuario_info.email,
      Fecha: registro.fecha,
      Hora: registro.hora,
      'Tipo de Registro': registro.tipo_registro,
      'Día de la Semana': new Date(registro.fecha).toLocaleDateString('es-ES', { weekday: 'long' })
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Todos los Registros");
    const fileName = filtroFecha ? `registros_${filtroFecha}.xlsx` : `todos_registros_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) return <div className="loading">Cargando reportes...</div>;

  return (
    <div className="reportes-container">
      <h2>Reportes de Asistencia</h2>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'atrasos' ? 'active' : ''}`}
          onClick={() => setActiveTab('atrasos')}
        >
          🕐 Atrasos ({atrasos.length})
        </button>
        <button 
          className={`tab ${activeTab === 'salidas' ? 'active' : ''}`}
          onClick={() => setActiveTab('salidas')}
        >
          🏃 Salidas Anticipadas ({salidasAnticipadas.length})
        </button>
        <button 
          className={`tab ${activeTab === 'inasistencias' ? 'active' : ''}`}
          onClick={() => setActiveTab('inasistencias')}
        >
          ❌ Inasistencias ({inasistencias.length})
        </button>
        <button 
          className={`tab ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          📋 Todas las Marcas ({filtrarRegistrosPorFecha().length})
        </button>
      </div>

      {/* Contenido de Atrasos */}
      {activeTab === 'atrasos' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Reporte de Atrasos</h3>
            <button className="btn-export" onClick={exportAtrasosToExcel}>
              📊 Exportar Atrasos
            </button>
          </div>
          
          {atrasos.length > 0 ? (
            <div className="table-container">
              <table className="reportes-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Hora de Entrada</th>
                    <th>Retraso</th>
                  </tr>
                </thead>
                <tbody>
                  {atrasos.map((atraso) => {
                    const horaEntrada = new Date(`1970-01-01T${atraso.hora}`);
                    const horaLimite = new Date(`1970-01-01T09:30:00`);
                    const retrasoMinutos = Math.floor((horaEntrada - horaLimite) / 60000);
                    
                    return (
                      <tr key={atraso.id}>
                        <td className="employee-name">
                          {atraso.usuario_info.nombre} {atraso.usuario_info.apellido}
                        </td>
                        <td>{atraso.usuario_info.email}</td>
                        <td>{atraso.fecha}</td>
                        <td className="time-cell">{atraso.hora}</td>
                        <td className="delay-cell">
                          <span className="delay-badge">
                            +{retrasoMinutos} min
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              🎉 ¡No hay atrasos registrados!
            </div>
          )}
        </div>
      )}

      {/* Contenido de Salidas Anticipadas */}
      {activeTab === 'salidas' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Reporte de Salidas Anticipadas</h3>
            <button className="btn-export" onClick={exportSalidasAnticipadasToExcel}>
              📊 Exportar Salidas Anticipadas
            </button>
          </div>
          
          {salidasAnticipadas.length > 0 ? (
            <div className="table-container">
              <table className="reportes-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Hora de Salida</th>
                    <th>Salida Anticipada</th>
                  </tr>
                </thead>
                <tbody>
                  {salidasAnticipadas.map((salida) => {
                    const horaSalida = new Date(`1970-01-01T${salida.hora}`);
                    const horaLimite = new Date(`1970-01-01T17:30:00`);
                    const minutosAnticipados = Math.floor((horaLimite - horaSalida) / 60000);
                    
                    return (
                      <tr key={salida.id}>
                        <td className="employee-name">
                          {salida.usuario_info.nombre} {salida.usuario_info.apellido}
                        </td>
                        <td>{salida.usuario_info.email}</td>
                        <td>{salida.fecha}</td>
                        <td className="time-cell">{salida.hora}</td>
                        <td className="delay-cell">
                          <span className="delay-badge">
                            -{minutosAnticipados} min
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              🎉 ¡No hay salidas anticipadas registradas!
            </div>
          )}
        </div>
      )}

      {/* Contenido de Inasistencias */}
      {activeTab === 'inasistencias' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Reporte de Inasistencias</h3>
            <button className="btn-export" onClick={exportInasistenciasToExcel}>
              📊 Exportar Inasistencias
            </button>
          </div>
          
          {inasistencias.length > 0 ? (
            <div className="table-container">
              <table className="reportes-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inasistencias.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="employee-name">
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`rol-badge ${usuario.rol}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge absent">
                          Ausente
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              🎉 ¡Todos los empleados han marcado asistencia!
            </div>
          )}
        </div>
      )}

      {/* Contenido de Todas las Marcas */}
      {activeTab === 'todos' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Historial de Todas las Marcas</h3>
            <div className="filter-controls">
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="filter-date"
              />
              <button className="btn-export" onClick={exportTodosRegistrosToExcel}>
                📊 Exportar Registros
              </button>
            </div>
          </div>
          
          {filtrarRegistrosPorFecha().length > 0 ? (
            <div className="table-container">
              <table className="reportes-table">
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarRegistrosPorFecha().map((registro) => {
                    // Determinar si es atraso o salida anticipada
                    let estadoClase = '';
                    let estadoTexto = 'Normal';
                    
                    if (registro.tipo_registro === 'entrada') {
                      const horaEntrada = new Date(`1970-01-01T${registro.hora}`);
                      const horaLimite = new Date(`1970-01-01T09:30:00`);
                      if (horaEntrada > horaLimite) {
                        estadoClase = 'delay-badge';
                        estadoTexto = 'Atraso';
                      }
                    } else if (registro.tipo_registro === 'salida') {
                      const horaSalida = new Date(`1970-01-01T${registro.hora}`);
                      const horaLimite = new Date(`1970-01-01T17:30:00`);
                      if (horaSalida < horaLimite) {
                        estadoClase = 'delay-badge';
                        estadoTexto = 'Anticipada';
                      }
                    }
                    
                    return (
                      <tr key={`${registro.id}-${registro.fecha}-${registro.hora}`}>
                        <td className="employee-name">
                          {registro.usuario_info.nombre} {registro.usuario_info.apellido}
                        </td>
                        <td>{registro.usuario_info.email}</td>
                        <td>{registro.fecha}</td>
                        <td className="time-cell">{registro.hora}</td>
                        <td>
                          <span className={`status-badge ${registro.tipo_registro === 'entrada' ? 'active' : 'inactive'}`}>
                            {registro.tipo_registro === 'entrada' ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="delay-cell">
                          {estadoTexto !== 'Normal' ? (
                            <span className={estadoClase}>
                              {estadoTexto}
                            </span>
                          ) : (
                            <span className="status-badge active">Normal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              {filtroFecha ? 
                `No hay registros para la fecha ${filtroFecha}` :
                "No hay registros disponibles"
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reportes;