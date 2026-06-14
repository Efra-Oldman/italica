import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

export const TareasContext = createContext<any>(null)

export function TareasProvider({ children }) {
  const [tareas, setTareas]     = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "tareas"), orderBy("creadoEn", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setTareas(lista)
      setCargando(false)
    })
    return () => unsub()
  }, [])

  async function agregarTarea(nueva) {
    await addDoc(collection(db, "tareas"), {
      ...nueva,
      horaInicioReal: null,
      horaFinReal: null,
      tiempoReal: null,
      timestampInicio: null,
      evaluacion: null,
      creadoEn: new Date().toISOString()
    })
  }

  async function eliminarTarea(id) {
    await deleteDoc(doc(db, "tareas", id))
  }

  async function editarTarea(tareaModificada) {
    const { id, ...datos } = tareaModificada
    await updateDoc(doc(db, "tareas", id), datos)
  }

  async function cambiarEstado(id, nuevoEstado) {
    await updateDoc(doc(db, "tareas", id), { estado: nuevoEstado })
  }

  async function asignarEmpleado(idTarea, nombreEmpleado) {
    await updateDoc(doc(db, "tareas", idTarea), {
      empleadoAsignado: nombreEmpleado
    })
  }

  return (
    <TareasContext.Provider value={{
      tareas,
      cargando,
      agregarTarea,
      eliminarTarea,
      editarTarea,
      cambiarEstado,
      asignarEmpleado
    }}>
      {children}
    </TareasContext.Provider>
  )
}

export function useTareas() {
  return useContext(TareasContext)
}