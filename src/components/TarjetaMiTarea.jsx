import { useState, useEffect } from 'react'

function TarjetaMiTarea({ tarea, onIniciar, onFinalizar }) {
  const [segundos, setSegundos] = useState(0)

  useEffect(() => {
    let intervalo = null
    if (tarea.estado === "en progreso" && tarea.timestampInicio) {
      // Calcula segundos ya transcurridos al montar el componente
      const yaTranscurridos = Math.floor(
        (Date.now() - tarea.timestampInicio) / 1000
      )
      setSegundos(yaTranscurridos)
      intervalo = setInterval(() => {
        setSegundos((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(intervalo)
  }, [tarea.estado, tarea.timestampInicio])

  function formatearTiempo(seg) {
    const h = Math.floor(seg / 3600).toString().padStart(2, "0")
    const m = Math.floor((seg % 3600) / 60).toString().padStart(2, "0")
    const s = (seg % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  function getBordePrioridad(prioridad) {
    if (prioridad === "alta")  return "#8B0000"
    if (prioridad === "media") return "#f57f17"
    if (prioridad === "baja")  return "#2e7d32"
  }

  function getBadgePrioridad(prioridad) {
    if (prioridad === "alta")  return <span className="badge-alta">🔴 Alta</span>
    if (prioridad === "media") return <span className="badge-media">🟡 Media</span>
    if (prioridad === "baja")  return <span className="badge-baja">🟢 Baja</span>
  }

  return (
    <div className="tarjeta" style={{ borderLeft: `4px solid ${getBordePrioridad(tarea.prioridad)}` }}>

      <div className="tarjeta-header">
        <h3>📋 {tarea.titulo}</h3>
        {getBadgePrioridad(tarea.prioridad)}
      </div>

      <p>🏷️ <strong>Tipo:</strong> {tarea.tipo}</p>
      <p>🏢 <strong>Área:</strong> {tarea.area}</p>

      <div className="fechas-tarea">
        <p>🟢 <strong>Inicio programado:</strong> {tarea.fechaInicio} {tarea.horaInicio}</p>
        <p>🔴 <strong>Fin programado:</strong> {tarea.fechaFin} {tarea.horaFin}</p>
      </div>

      <p style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>
        {tarea.descripcion}
      </p>

      {tarea.estado === "en progreso" && (
        <div className="cronometro">
          <span>⏱️ Tiempo transcurrido:</span>
          <span className="cronometro-tiempo">{formatearTiempo(segundos)}</span>
        </div>
      )}

      {tarea.horaInicioReal && (
        <div className="fechas-tarea" style={{ marginTop: "8px" }}>
          <p>▶️ <strong>Iniciada a las:</strong> {tarea.horaInicioReal}</p>
          {tarea.horaFinReal && (
            <p>✅ <strong>Finalizada a las:</strong> {tarea.horaFinReal}</p>
          )}
          {tarea.tiempoReal !== null && tarea.tiempoReal !== undefined && (
            <p>⏱️ <strong>Tiempo real:</strong> {tarea.tiempoReal} minutos</p>
          )}
        </div>
      )}

      <div style={{ marginTop: "16px" }}>
        {tarea.estado === "pendiente" && (
          <button className="btn-iniciar" onClick={() => onIniciar(tarea.id)}>
            ▶️ Iniciar Tarea
          </button>
        )}
        {tarea.estado === "en progreso" && (
          <button className="btn-finalizar" onClick={() => onFinalizar(tarea.id)}>
            ✅ Finalizar Tarea
          </button>
        )}
        {tarea.estado === "completada" && (
          <div className="badge-disponible" style={{ display: "inline-block" }}>
            ✅ Tarea Completada
          </div>
        )}
      </div>

    </div>
  )
}

export default TarjetaMiTarea