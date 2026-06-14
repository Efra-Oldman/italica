import { useAuth } from '../context/AuthContext'
import { useTareas } from '../context/TareasContext'
import { useEmpleados } from '../context/EmpleadosContext'
import TarjetaMiTarea from '../components/TarjetaMiTarea'
import { useNavigate } from 'react-router-dom'

function Perfil() {
  const { usuarioActual } = useAuth()
  const { tareas, editarTarea } = useTareas()
  const { empleados } = useEmpleados()
  const navigate = useNavigate()
  const miPerfil = empleados.find(
    (e) => e.nombre.toLowerCase() === usuarioActual.nombre.toLowerCase()
  )

  const misTareas = tareas.filter(
    (t) => t.empleadoAsignado === usuarioActual.nombre
  )

  const tareasPendientes  = misTareas.filter((t) => t.estado === "pendiente").length
  const tareasEnProgreso  = misTareas.filter((t) => t.estado === "en progreso").length
  const tareasCompletadas = misTareas.filter((t) => t.estado === "completada").length

  function handleIniciar(idTarea) {
    const tarea = tareas.find((t) => t.id === idTarea)
    const ahora = new Date()
    editarTarea({
      ...tarea,
      estado: "en progreso",
      timestampInicio: ahora.getTime(),
      horaInicioReal: ahora.toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
    })
  }

  function handleFinalizar(idTarea) {
    const tarea = tareas.find((t) => t.id === idTarea)
    const ahora = new Date()
    const tiempoReal = Math.round(
      (ahora.getTime() - tarea.timestampInicio) / 60000
    )
    editarTarea({
      ...tarea,
      estado: "completada",
      horaFinReal: ahora.toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
      tiempoReal: tiempoReal,
    })
  }

  return (
    <div className="pagina">

      <div className="perfil-header">
        <div className="perfil-avatar">
  {usuarioActual.nombre.charAt(0).toUpperCase()}
        </div>    
        <div className="perfil-info">
          <h1>{usuarioActual.nombre}</h1>
          {miPerfil && (
            <>
              <p>💼 {miPerfil.cargo}</p>
              <p>🏢 {miPerfil.area}</p>
            </>
          )}
         {/* Empleado NO ve sus habilidades */}
    {miPerfil && (
    <div style={{ marginTop: "8px" }}>
    <button
      className="btn-solicitar-skill"
      onClick={() => navigate("/mensajes")}
    >
      📋 Solicitar nueva habilidad
    </button>
  </div>
)}
        </div>
        {miPerfil && (
          <div>
            {miPerfil.estado === "disponible" && <span className="badge-disponible">✅ Disponible</span>}
            {miPerfil.estado === "ocupado"    && <span className="badge-ocupado">🔴 Ocupado</span>}
            {miPerfil.estado === "vacaciones" && <span className="badge-vacaciones">🌴 De Vacaciones</span>}
          </div>
        )}
      </div>

      <div className="resumen-tareas" style={{ marginTop: "24px" }}>
        <div className="resumen-item">
          <span className="resumen-numero">{tareasPendientes}</span>
          <span className="resumen-label">⏳ Pendientes</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{tareasEnProgreso}</span>
          <span className="resumen-label">🔄 En Progreso</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{tareasCompletadas}</span>
          <span className="resumen-label">✅ Completadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{misTareas.length}</span>
          <span className="resumen-label">📋 Total</span>
        </div>
      </div>

      <h2 style={{ marginTop: "24px", color: "#8B0000" }}>📋 Mis Tareas</h2>

      {misTareas.length === 0 ? (
        <div className="sin-tareas">
          <p>🎉 No tienes tareas asignadas por el momento</p>
        </div>
      ) : (
        <div className="lista">
          {misTareas.map((tarea) => (
            <TarjetaMiTarea
              key={tarea.id}
              tarea={tarea}
              onIniciar={handleIniciar}
              onFinalizar={handleFinalizar}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default Perfil