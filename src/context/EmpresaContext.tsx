import { createContext, useState, useContext, useEffect } from 'react'
import { db } from '../firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

export const EmpresaContext = createContext<any>(null)

const perfilInicial = {
  nombre: 'ITALICA BOLIVIA',
  razonSocial: 'ITALICA Decoherrajes I S.R.L.',
  descripcion: 'Empresa cochabambina dedicada a la comercialización de herrajes, accesorios y soluciones para muebles y espacios interiores.',
  productos: 'Bisagras SALICE, correderas, amortiguadores, sistemas para muebles de cocina, closets y baños, accesorios de organización, componentes de mobiliario y decoración. Trabaja con múltiples marcas internacionales premium.',
  marcas: 'SALICE, Häfele y otras marcas internacionales de herrajes',
  procesoVenta: 'Venta directa en showroom, venta consultiva con asesoría técnica, atención por WhatsApp y redes sociales, trabajo con proyectos de arquitectos y constructoras.',
  sucursales: 'Cochabamba (principal) y Santa Cruz',
  areas: 'Ventas, Showroom, Soporte Técnico, Administración, Logística/Almacén, Asesoría de Proyectos, Marketing',
  clientesTipicos: 'Arquitectos, diseñadores de interiores, carpinteros, muebleros, constructoras, empresas (B2B) y público general nivel medio-alto (B2C)',
  valoresEmpleado: 'Atención al cliente de alto nivel, conocimiento técnico de herrajes y muebles, responsabilidad y puntualidad, capacidad de asesorar técnica y comercialmente, proactividad y orden',
  modeloNegocio: 'Empresa comercial técnica especializada — el vendedor es asesor técnico-comercial, no solo vendedor',
  mision: 'Proveer soluciones integrales de herrajes y accesorios para mobiliario, atendiendo proyectos residenciales, comerciales e industriales con productos de calidad internacional.',
  kpis: 'Satisfacción del cliente, puntualidad en entregas, conocimiento técnico del producto, calidad de asesoría, cumplimiento de metas de ventas',
}

export function EmpresaProvider({ children }) {
  const [perfil, setPerfil] = useState(perfilInicial)
  const [cargando, setCargando] = useState(true)

  // Escucha cambios en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'empresa', 'perfil'), (docSnap) => {
      if (docSnap.exists()) {
        setPerfil(docSnap.data() as typeof perfilInicial)
      } else {
        // Si no existe crea el perfil inicial
        setDoc(doc(db, 'empresa', 'perfil'), perfilInicial)
      }
      setCargando(false)
    })
    return () => unsub()
  }, [])

  // Actualiza el perfil
  async function actualizarPerfil(nuevoPerfil) {
    await setDoc(doc(db, 'empresa', 'perfil'), nuevoPerfil)
  }

  // Genera el contexto para la IA
  function generarContextoIA() {
    return `
PERFIL DE LA EMPRESA:
─────────────────────
Nombre: ${perfil.nombre} (${perfil.razonSocial})
Descripción: ${perfil.descripcion}
Sucursales: ${perfil.sucursales}
Modelo de negocio: ${perfil.modeloNegocio}

PRODUCTOS Y MARCAS:
${perfil.productos}
Marcas: ${perfil.marcas}

PROCESO DE VENTA:
${perfil.procesoVenta}

ÁREAS DE LA EMPRESA:
${perfil.areas}

CLIENTES TÍPICOS:
${perfil.clientesTipicos}

VALORES Y EXPECTATIVAS DEL EMPLEADO:
${perfil.valoresEmpleado}

KPIs IMPORTANTES:
${perfil.kpis}

MISIÓN:
${perfil.mision}
    `.trim()
  }

  return (
    <EmpresaContext.Provider
      value={{
        perfil,
        cargando,
        actualizarPerfil,
        generarContextoIA,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  )
}

export function useEmpresa() {
  return useContext(EmpresaContext)
}
