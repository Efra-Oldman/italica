import { createContext, useState, useContext, useEffect } from 'react'
import { db, auth } from '../firebase'
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
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'

export const EmpleadosContext = createContext<any>(null)

// Genera email desde el nombre
function generarEmail(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".")
    + "@italica.com"
}

export function EmpleadosProvider({ children }) {
  const [empleados, setEmpleados] = useState([])
  const [cargando, setCargando]   = useState(true)

  useEffect(() => {
    const q = query(collection(db, "empleados"), orderBy("nombre"))
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setEmpleados(lista)
      setCargando(false)
    })
    return () => unsub()
  }, [])

  // Agregar empleado y crear usuario en Firebase Auth
  async function agregarEmpleado(nuevo) {
    try {
      const email    = generarEmail(nuevo.nombre)
      const password = "italica123"

      // Guarda credenciales del admin actual
      const adminEmail    = auth.currentUser.email
      const adminPassword = "admin123"

      // Crea usuario en Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password)

      // Vuelve a iniciar sesión como admin
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword)

      // Guarda empleado en Firestore con su email
      await addDoc(collection(db, "empleados"), {
        ...nuevo,
        email,
        password,
        creadoEn: new Date().toISOString()
      })

      return { email, password }

    } catch (error) {
      console.error("Error al crear empleado:", error)
      throw error
    }
  }

  async function eliminarEmpleado(id) {
    await deleteDoc(doc(db, "empleados", id))
  }

  async function editarEmpleado(empleadoModificado) {
    const { id, ...datos } = empleadoModificado
    await updateDoc(doc(db, "empleados", id), datos)
  }

  return (
    <EmpleadosContext.Provider value={{
      empleados,
      cargando,
      agregarEmpleado,
      eliminarEmpleado,
      editarEmpleado,
      generarEmail
    }}>
      {children}
    </EmpleadosContext.Provider>
  )
}

export function useEmpleados() {
  return useContext(EmpleadosContext)
}