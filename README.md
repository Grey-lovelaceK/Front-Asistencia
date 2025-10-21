# 🎨 Sistema de Asistencia - Frontend

Interfaz web moderna en React 18 para control de asistencia con roles diferenciados y exportación a Excel.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

## ✨ Características

- ✅ Autenticación JWT con refresh automático
- ✅ Panel diferenciado por roles (Empleado/Admin)
- ✅ Diseño glassmorphism moderno
- ✅ Exportación de reportes a Excel
- ✅ Responsive y con animaciones

## 🛠️ Tecnologías

- React 18+
- React Icons
- XLSX (exportación Excel)
- CSS3 con variables
- Fetch API

## 📁 Estructura

```
src/
├── Components/
│   ├── AdminDashboard/      # Panel admin + CRUD usuarios + Reportes
│   ├── EmpleadoDashboard/   # Panel empleado (marcar entrada/salida)
│   ├── LoginForm/           # Formulario de login
│   └── Assets/              # Imágenes (background)
├── api/
│   └── api.js              # Funciones de API
├── auth/
│   └── AuthProvider.jsx    # Context de autenticación
└── App.js                  # Componente principal
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Crear .env
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Ejecutar
npm start
```

## ⚙️ Variables de Entorno

```env
# Desarrollo
REACT_APP_API_URL=http://localhost:8000/api

# Producción
REACT_APP_API_URL=https://tu-api.onrender.com/api
```

## 👤 Panel de Empleado

- Marcar entrada
- Marcar salida
- Mensajes de confirmación en tiempo real

## 👨‍💼 Panel de Administrador

### Gestión de Usuarios
- Crear, editar, activar/desactivar y eliminar
- Exportar lista a Excel

### Reportes (4 tipos)
1. **Atrasos** - Entradas después de 9:30 AM
2. **Salidas Anticipadas** - Salidas antes de 5:30 PM
3. **Inasistencias** - Empleados sin registro
4. **Historial Completo** - Todas las marcas con filtro por fecha

Cada reporte se puede exportar a Excel individualmente.

## 🔐 Autenticación

- Tokens JWT almacenados en `localStorage`
- Refresh automático al expirar (reintenta request)
- Verificación de sesión al cargar la app
- Logout limpia tokens y redirige al login

## 🚀 Deploy en Vercel

1. Conectar repo en Vercel
2. Build command: `npm run build`
3. Output directory: `build`
4. Agregar variable: `REACT_APP_API_URL=https://tu-api.onrender.com/api`

## 👥 Equipo

- Cristian Revilla - Tech Lead
- Iván González - Backend
- Ricardo Alvarado - Frontend
- Alejandro Franco - DevOps & QA

## 🔗 Enlaces

- [API Backend](https://github.com/Grey-lovelaceK/asitencia_rest_api)
- Demo: `https://front-asistencia.vercel.app`

---

**Desarrollado con ❤️ usando React**
