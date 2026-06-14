function TarjetaTarea({ tarea, onEliminar, onEditar, onCambiarEstado, onEvaluar, onAsignarIA }) {
  function getBordePrioridad(prioridad) {
    if (prioridad === 'alta') return '#8B0000'
    if (prioridad === 'media') return '#f57f17'
    if (prioridad === 'baja') return '#2e7d32'
  }

  function getBadgePrioridad(prioridad) {
    if (prioridad === 'alta') return <span className="badge-alta">🔴 Alta</span>
    if (prioridad === 'media') return <span className="badge-media">🟡 Media</span>
    if (prioridad === 'baja') return <span className="badge-baja">🟢 Baja</span>
  }

  function getBadgeEstado(estado) {
    if (estado === 'pendiente') return <span className="badge-ocupado">⏳ Pendiente</span>
    if (estado === 'en progreso') return <span className="badge-progreso">🔄 En Progreso</span>
    if (estado === 'completada') return <span className="badge-disponible">✅ Completada</span>
    if (estado === 'cancelada') return <span className="badge-cancelada">❌ Cancelada</span>
  }

  function renderEstrellas(calificacion) {
    return [1, 2, 3, 4, 5].map((e) => (
      <span key={e} style={{ color: e <= calificacion ? '#f57f17' : '#ddd', fontSize: '18px' }}>
        ★
      </span>
    ))
  }

  return (
    <div className="tarjeta" style={{ borderLeft: `4px solid ${getBordePrioridad(tarea.prioridad)}` }}>
      <div className="tarjeta-header">
        <h3>📋 {tarea.titulo}</h3>
        {getBadgePrioridad(tarea.prioridad)}
      </div>

      <p>
        🏷️ <strong>Tipo:</strong> {tarea.tipo}
      </p>
      <p>
        🏢 <strong>Área:</strong> {tarea.area}
      </p>
      <p>
        👤 <strong>Asignado a:</strong> {tarea.empleadoAsignado || 'Sin asignar'}
      </p>

      <div className="fechas-tarea">
        <p>
          🟢 <strong>Inicio:</strong> {tarea.fechaInicio || '—'} {tarea.horaInicio || ''}
        </p>
        <p>
          🔴 <strong>Fin:</strong> {tarea.fechaFin || '—'} {tarea.horaFin || ''}
        </p>
      </div>

      {tarea.tiempoReal && (
        <p>
          ⏱️ <strong>Tiempo real:</strong> {tarea.tiempoReal} minutos
        </p>
      )}

      <p style={{ marginTop: '6px', color: '#666', fontSize: '13px' }}>{tarea.descripcion}</p>

      <div style={{ marginTop: '10px' }}>{getBadgeEstado(tarea.estado)}</div>

      {/* Evaluación guardada */}
      {tarea.evaluacion && (
        <div className="evaluacion-resumen">
          <div>{renderEstrellas(tarea.evaluacion.calificacion)}</div>
          <p className="evaluacion-resultado">
            {tarea.evaluacion.resultado === 'satisfactorio' && '✅ Satisfactorio'}
            {tarea.evaluacion.resultado === 'regular' && '⚠️ Regular'}
            {tarea.evaluacion.resultado === 'insatisfactorio' && '❌ Insatisfactorio'}
          </p>
          <p className="evaluacion-comentario">"{tarea.evaluacion.comentario}"</p>
          {tarea.evaluacion.analisisIA && (
            <div className="evaluacion-ia">
              <p className="evaluacion-ia-titulo">🤖 Análisis IA:</p>
              <p className="evaluacion-ia-texto">{tarea.evaluacion.analisisIA}</p>
            </div>
          )}
        </div>
      )}

      {/* Cambiar estado */}
      <div className="campo" style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '12px' }}>Cambiar estado:</label>
        <select value={tarea.estado} onChange={(e) => onCambiarEstado(tarea.id, e.target.value)}>
          <option value="pendiente">⏳ Pendiente</option>
          <option value="en progreso">🔄 En Progreso</option>
          <option value="completada">✅ Completada</option>
          <option value="cancelada">❌ Cancelada</option>
        </select>
      </div>

      <div className="tarjeta-botones">
        <button className="btn-secundario" onClick={() => onEditar(tarea)}>
          ✏️ Editar
        </button>
        <button className="btn-eliminar" onClick={() => onEliminar(tarea.id)}>
          ❌ Eliminar
        </button>
      </div>

      {/* Botón asignar con IA — tareas sin empleado */}
      {!tarea.empleadoAsignado && tarea.estado === 'pendiente' && (
        <button className="btn-ia-asignar" onClick={() => onAsignarIA(tarea)}>
          🤖 Asignar con IA
        </button>
      )}

      {/* Botón evaluar */}
      {tarea.estado === 'completada' && !tarea.evaluacion && (
        <button className="btn-evaluar" onClick={() => onEvaluar(tarea)}>
          ⭐ Evaluar Desempeño
        </button>
      )}

      {tarea.estado === 'completada' && tarea.evaluacion && (
        <button className="btn-reevaluar" onClick={() => onEvaluar(tarea)}>
          ✏️ Editar Evaluación
        </button>
      )}
    </div>
  )
}

export default TarjetaTarea
