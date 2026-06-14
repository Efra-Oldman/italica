import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'

export const MensajesContext = createContext<any>(null)

export function MensajesProvider({ children }) {
  const [conversaciones, setConversaciones] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'conversaciones'), orderBy('creadoEn', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setConversaciones(lista)
      setCargando(false)
    })
    return () => unsub()
  }, [])

  async function iniciarConversacion(empleado, tipo, asunto, contenido) {
    await addDoc(collection(db, 'conversaciones'), {
      empleado,
      tipo,
      asunto,
      leido: false,
      mensajes: [
        {
          id: 1,
          de: empleado,
          contenido,
          fecha: new Date().toLocaleDateString('es-BO'),
          hora: new Date().toLocaleTimeString('es-BO', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
      creadoEn: new Date().toISOString(),
    })
  }

  async function enviarMensaje(idConversacion, de, contenido) {
    const conv = conversaciones.find((c) => c.id === idConversacion)
    if (!conv) return

    const nuevoMensaje = {
      id: conv.mensajes.length + 1,
      de,
      contenido,
      fecha: new Date().toLocaleDateString('es-BO'),
      hora: new Date().toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    await updateDoc(doc(db, 'conversaciones', idConversacion), {
      mensajes: [...conv.mensajes, nuevoMensaje],
      leido: de === 'Administrador' ? conv.leido : false,
    })
  }

  async function marcarLeida(id) {
    await updateDoc(doc(db, 'conversaciones', id), { leido: true })
  }

  async function eliminarConversacion(id) {
    await deleteDoc(doc(db, 'conversaciones', id))
  }

  const conversacionesNoLeidas = conversaciones.filter((c) => !c.leido).length

  return (
    <MensajesContext.Provider
      value={{
        conversaciones,
        cargando,
        iniciarConversacion,
        enviarMensaje,
        marcarLeida,
        eliminarConversacion,
        conversacionesNoLeidas,
      }}
    >
      {children}
    </MensajesContext.Provider>
  )
}

export function useMensajes() {
  return useContext(MensajesContext)
}
