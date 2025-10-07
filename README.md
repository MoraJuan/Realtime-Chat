# Chat en Tiempo Real

Una aplicación de chat en tiempo real construida con React, Node.js, Express y MongoDB.

## Características

- ✅ Autenticación completa (Login, Registro, Logout)
- ✅ Chat en tiempo real entre usuarios
- ✅ Actualización de foto de perfil
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Gestión de estado con React Context
- ✅ Rutas protegidas
- ✅ Notificaciones con React Hot Toast

## Tecnologías Utilizadas

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- DaisyUI
- React Hot Toast
- Vite

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- bcryptjs para hash de contraseñas
- Cloudinary para almacenamiento de imágenes

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB
- Cuenta de Cloudinary (para imágenes de perfil)

### Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor:
```bash
npm start
```

### Producción

1. Construye el frontend:
```bash
cd frontend
npm run build
```

2. Copia los archivos construidos al backend:
```bash
xcopy dist ..\backend\dist /E /I /H /Y
```

3. Configura las variables de entorno en `.env` del backend:
```env
NODE_ENV=production
PORT=3000
MONGO_URI=tu_mongo_uri_de_produccion
JWT_SECRET=tu_jwt_secret_seguro
CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
```

4. Despliega el backend en un servicio como Heroku, Railway o Vercel.

### Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Uso

1. Abre tu navegador y ve a `http://localhost:5174`
2. Crea una cuenta nueva o inicia sesión
3. Selecciona un usuario de la barra lateral para empezar a chatear
4. Los mensajes se actualizan automáticamente cada 2 segundos

## Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Definición de rutas
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── lib/           # Utilidades y configuración
│   │   └── index.js       # Punto de entrada
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── context/      # Context de React
│   │   ├── hooks/        # Hooks personalizados
│   │   └── App.jsx       # Componente principal
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/signup` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/check` - Verificar autenticación
- `PUT /api/auth/update-profile` - Actualizar foto de perfil

### Mensajes
- `GET /api/messages/users` - Obtener lista de usuarios
- `GET /api/messages/:id` - Obtener mensajes con un usuario
- `POST /api/messages/send/:id` - Enviar mensaje

## Características de Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT con cookies seguras
- Rutas protegidas en el frontend
- Validación de datos en el backend
- Middleware de autenticación

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
