import { createContext, useState, useContext, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

export const AuthContext = createContext<any>(null)

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [cargando, setCargando]           = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let nombre = firebaseUser.email
        let rol    = "empleado"

        // Si es admin
        if (firebaseUser.email === "admin@italica.com") {
          nombre = "Administrador"
          rol    = "admin"
        } else {
          // Busca el empleado en Firestore por email
          try {
            const q = query(
              collection(db, "empleados"),
              where("email", "==", firebaseUser.email)
            )
            const snapshot = await getDocs(q)
            if (!snapshot.empty) {
              const empleadoData = snapshot.docs[0].data()
              nombre = empleadoData.nombre
              rol    = "empleado"
            }
          } catch (error) {
            console.error("Error buscando empleado:", error)
          }
        }

        setUsuarioActual({
          uid:   firebaseUser.uid,
          email: firebaseUser.email,
          nombre,
          rol,
        })
      } else {
        setUsuarioActual(null)
      }
      setCargando(false)
    })
    return () => unsub()
  }, [])

  // Login con Firebase
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      let nombre = result.user.email
      let rol    = "empleado"

      if (result.user.email === "admin@italica.com") {
        nombre = "Administrador"
        rol    = "admin"
      } else {
        try {
          const q = query(
            collection(db, "empleados"),
            where("email", "==", result.user.email)
          )
          const snapshot = await getDocs(q)
          if (!snapshot.empty) {
            nombre = snapshot.docs[0].data().nombre
          }
        } catch (error) {
          console.error("Error buscando empleado:", error)
        }
      }

      const usuario = {
        uid:   result.user.uid,
        email: result.user.email,
        nombre,
        rol,
      }

      setUsuarioActual(usuario)
      return usuario

    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  // Logout
  async function logout() {
    await signOut(auth)
    setUsuarioActual(null)
  }

  // Pantalla de carga
  if (cargando) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f0f2f5",
        flexDirection: "column",
        gap: "16px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid #f0f0f0",
          borderTop: "4px solid #8B0000",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ color: "#8B0000", fontWeight: "600", fontFamily: "Segoe UI" }}>
          Cargando ITALICA BOLIVIA...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ usuarioActual, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}