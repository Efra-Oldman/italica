import { db } from '../firebase'
import {
  collection,
  getDocs,
  addDoc,
  query,
  limit
} from 'firebase/firestore'

const empleadosIniciales = [
  {
    nombre: "Carlos Mendoza",
    cargo: "Vendedor Senior",
    area: "Ventas",
    habilidades: ["negociación", "ventas", "atención al cliente", "cotizaciones"],
    estado: "disponible",
    email: "carlos@italica.com",
    password: "italica123",
    creadoEn: new Date().toISOString()
  },
  {
    nombre: "Ana Flores",
    cargo: "Asesora Showroom",
    area: "Showroom",
    habilidades: ["diseño de interiores", "exhibición", "atención al cliente", "productos Häfele"],
    estado: "disponible",
    email: "ana@italica.com",
    password: "italica123",
    creadoEn: new Date().toISOString()
  },
  {
    nombre: "Luis Torrez",
    cargo: "Soporte Técnico",
    area: "Soporte",
    habilidades: ["instalación", "soporte técnico", "herrajes", "reparación"],
    estado: "ocupado",
    email: "luis@italica.com",
    password: "italica123",
    creadoEn: new Date().toISOString()
  },
]

const tareasIniciales = [
  {
    titulo: "Atención cliente showroom",
    descripcion: "Cliente interesado en herrajes para cocina moderna, necesita asesoría completa sobre productos Häfele disponibles.",
    tipo: "Atención Showroom",
    prioridad: "alta",
    estado: "pendiente",
    area: "Showroom",
    empleadoAsignado: null,
    fechaInicio: "",
    horaInicio: "",
    fechaFin: "",
    horaFin: "",
    horaInicioReal: null,
    horaFinReal: null,
    tiempoReal: null,
    timestampInicio: null,
    evaluacion: null,
    creadoEn: new Date().toISOString()
  },
  {
    titulo: "Cotización proyecto oficinas",
    descripcion: "Preparar cotización detallada de herrajes para proyecto de 20 oficinas en edificio nuevo del centro.",
    tipo: "Cotización",
    prioridad: "alta",
    estado: "pendiente",
    area: "Ventas",
    empleadoAsignado: "Carlos Mendoza",
    fechaInicio: "",
    horaInicio: "",
    fechaFin: "",
    horaFin: "",
    horaInicioReal: null,
    horaFinReal: null,
    tiempoReal: null,
    timestampInicio: null,
    evaluacion: null,
    creadoEn: new Date().toISOString()
  },
  {
    titulo: "Limpieza showroom",
    descripcion: "Limpieza general del showroom y reordenamiento de productos en exhibición para recibir clientes.",
    tipo: "Limpieza",
    prioridad: "baja",
    estado: "pendiente",
    area: "Showroom",
    empleadoAsignado: null,
    fechaInicio: "",
    horaInicio: "",
    fechaFin: "",
    horaFin: "",
    horaInicioReal: null,
    horaFinReal: null,
    tiempoReal: null,
    timestampInicio: null,
    evaluacion: null,
    creadoEn: new Date().toISOString()
  },
]

// Carga datos solo si Firestore está vacío
export async function cargarDatosIniciales() {
  try {
    // Verifica si ya hay empleados
    const qEmpleados = query(collection(db, "empleados"), limit(1))
    const snapEmpleados = await getDocs(qEmpleados)

    if (snapEmpleados.empty) {
      console.log("Cargando empleados iniciales...")
      for (const empleado of empleadosIniciales) {
        await addDoc(collection(db, "empleados"), empleado)
      }
      console.log("✅ Empleados cargados")
    }

    // Verifica si ya hay tareas
    const qTareas = query(collection(db, "tareas"), limit(1))
    const snapTareas = await getDocs(qTareas)

    if (snapTareas.empty) {
      console.log("Cargando tareas iniciales...")
      for (const tarea of tareasIniciales) {
        await addDoc(collection(db, "tareas"), tarea)
      }
      console.log("✅ Tareas cargadas")
    }

  } catch (error) {
    console.error("Error cargando datos iniciales:", error)
  }
}