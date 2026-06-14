# ITALICA CRM

Sistema CRM empresarial para ITALICA BOLIVIA, construido con React, Vite y Firebase.

Incluye gestión de empleados, tareas, métricas de rendimiento, mensajería interna y un recomendador de asignación con IA.

## Características

- Autenticación con Firebase Auth (roles: admin y empleado).
- Dashboard administrativo con KPIs operativos.
- Gestión de empleados (crear, editar, eliminar).
- Gestión completa de tareas (crear, editar, asignar, cambiar estado, evaluar).
- Vista de perfil para empleados con control de inicio/finalización de tareas.
- Módulo de métricas por empleado (puntualidad, satisfacción, tendencia, promedio).
- Mensajería interna entre empleados y administrador.
- Perfil de empresa editable para enriquecer el contexto de IA.
- Asignador IA de tareas usando API de Groq.
- Carga inicial automática de datos en Firestore (si las colecciones están vacías).

## Stack tecnológico

- React 19
- Vite 8
- React Router DOM 7
- Firebase (Auth + Firestore)
- ESLint 10

## Estructura principal

- src/context: estado global por dominio (auth, empleados, tareas, métricas, mensajes, empresa).
- src/pages: pantallas principales (Dashboard, Empleados, Tareas, Métricas, Mensajes, Perfil, Empresa, Login).
- src/components: componentes reutilizables de UI y paneles.
- src/utils/seedData.js: inserta empleados y tareas iniciales si Firestore está vacío.

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto de Firebase activo

## Configuración local

### 1) Instalar dependencias

```bash
npm install
```

### 2) Variables de entorno

Crea un archivo .env en la raíz con:

```env
VITE_GROQ_API_KEY=tu_api_key_de_groq
```

Sin esta variable, el módulo de Asignador IA no podrá generar recomendaciones.

### 3) Configurar Firebase

Este proyecto ya apunta a un proyecto Firebase en src/firebase.js.

Si quieres usar otro proyecto:

1. Crea un proyecto en Firebase Console.
2. Habilita Authentication con proveedor Email/Password.
3. Crea una base de datos Firestore en modo de prueba (o con reglas apropiadas).
4. Reemplaza el objeto firebaseConfig en src/firebase.js por tus credenciales.

### 4) Crear usuarios de acceso en Firebase Auth

El login depende de usuarios existentes en Authentication. Crea al menos:

- admin@italica.com / admin123
- carlos@italica.com / carlos123
- ana@italica.com / ana123
- luis@italica.com / luis123

Nota: seedData crea documentos en Firestore, pero no crea usuarios de Authentication.

### 5) Ejecutar proyecto

```bash
npm run dev
```

Luego abre la URL mostrada por Vite (normalmente http://localhost:5173).

## Scripts disponibles

- npm run dev: entorno local con hot reload.
- npm run start: levanta Vite accesible en red local (vite --host).
- npm run build: compilación de producción.
- npm run preview: previsualiza build local.
- npm run lint: ejecuta ESLint en src.

## Flujo de roles

- Admin:
	- Accede a Dashboard, Empleados, Tareas, Métricas y Empresa.
	- Puede responder mensajes y gestionar toda la operación.
- Empleado:
	- Accede a Perfil y Mensajes.
	- Puede iniciar/finalizar sus tareas y enviar solicitudes al administrador.

## Colecciones usadas en Firestore

- empleados
- tareas
- conversaciones
- empresa/perfil (documento)

## Consideraciones importantes

- El proyecto incluye credenciales de ejemplo y lógica orientada a demo/desarrollo.
- Antes de producción, se recomienda:
	- mover configuración sensible a variables de entorno,
	- endurecer reglas de Firestore,
	- reemplazar contraseñas por políticas seguras,
	- revisar flujo de creación/eliminación de usuarios en Firebase Auth.

## Despliegue

Si vas a desplegar en Firebase Hosting con Vite, asegúrate de publicar la carpeta dist tras ejecutar build.

```bash
npm run build
firebase deploy
```

Revisa firebase.json y ajusta hosting.public a dist si aún está apuntando a public.
