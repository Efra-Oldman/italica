function TarjetaMetrica({ empleado, metricas }) {
  function getTendenciaInfo(tendencia) {
    if (tendencia === 'mejorando') return { emoji: '📈', color: '#2e7d32', texto: 'Mejorando' }
    if (tendencia === 'bajando') return { emoji: '📉', color: '#8B0000', texto: 'Bajando' }
    return { emoji: '➡️', color: '#f57f17', texto: 'Estable' }
  }

  function getColorCalificacion(cal) {
    if (cal >= 4.5) return '#2e7d32'
    if (cal >= 3.5) return '#f57f17'
    return '#8B0000'
  }

  function renderEstrellas(calificacion) {
    return [1, 2, 3, 4, 5].map((e) => (
      <span
        key={e}
        style={{
          color: e <= calificacion ? '#f57f17' : '#ddd',
          fontSize: '16px',
        }}
      >
        ★
      </span>
    ))
  }

  const tendenciaInfo = getTendenciaInfo(metricas.tendencia)

  return (
    <div className="tarjeta-metrica">
      {/* Encabezado */}
      <div className="metrica-header">
        <div className="metrica-avatar">{empleado.nombre.charAt(0).toUpperCase()}</div>
        <div className="metrica-info">
          <h3>{empleado.nombre}</h3>
          <p>
            {empleado.cargo} — {empleado.area}
          </p>
        </div>
        <div className="metrica-tendencia" style={{ color: tendenciaInfo.color }}>
          <span style={{ fontSize: '24px' }}>{tendenciaInfo.emoji}</span>
          <span style={{ fontSize: '12px' }}>{tendenciaInfo.texto}</span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="metrica-stats">
        <div className="metrica-stat">
          <span className="metrica-stat-numero" style={{ color: getColorCalificacion(metricas.calificacionPromedio) }}>
            {metricas.calificacionPromedio || '—'}
          </span>
          <span className="metrica-stat-label">⭐ Promedio</span>
          <div>{renderEstrellas(metricas.calificacionPromedio)}</div>
        </div>
        <div className="metrica-stat">
          <span className="metrica-stat-numero">{metricas.totalCompletadas}</span>
          <span className="metrica-stat-label">📋 Completadas</span>
        </div>
        <div className="metrica-stat">
          <span
            className="metrica-stat-numero"
            style={{
              color: metricas.porcentajePuntualidad >= 80 ? '#2e7d32' : '#8B0000',
            }}
          >
            {metricas.porcentajePuntualidad}%
          </span>
          <span className="metrica-stat-label">⏱️ Puntualidad</span>
        </div>
        <div className="metrica-stat">
          <span
            className="metrica-stat-numero"
            style={{
              color: metricas.porcentajeSatisfaccion >= 80 ? '#2e7d32' : '#8B0000',
            }}
          >
            {metricas.porcentajeSatisfaccion}%
          </span>
          <span className="metrica-stat-label">✅ Satisfacción</span>
        </div>
      </div>

      {/* Mejor y peor tipo */}
      {metricas.mejorTipo && (
        <div className="metrica-tipos">
          <div className="metrica-tipo-item mejor">
            <span>🏆 Mejor en:</span>
            <strong>{metricas.mejorTipo}</strong>
          </div>
          {metricas.peorTipo && metricas.peorTipo !== metricas.mejorTipo && (
            <div className="metrica-tipo-item peor">
              <span>⚠️ Mejorar en:</span>
              <strong>{metricas.peorTipo}</strong>
            </div>
          )}
        </div>
      )}

      {/* Tiempo promedio por tipo */}
      {Object.keys(metricas.tiempoPromedioPorTipo).length > 0 && (
        <div className="metrica-tiempos">
          <p className="metrica-seccion-titulo">⏱️ Tiempo promedio por tarea:</p>
          {Object.entries(metricas.tiempoPromedioPorTipo as Record<string, number>).map(([tipo, minutos]) => (
            <div key={tipo} className="metrica-tiempo-item">
              <span>{tipo}</span>
              <span className="metrica-tiempo-valor">{minutos} min</span>
            </div>
          ))}
        </div>
      )}

      {/* Sin datos */}
      {metricas.totalCompletadas === 0 && (
        <div className="metrica-sin-datos">
          <p>Sin tareas completadas aún</p>
        </div>
      )}
    </div>
  )
}

export default TarjetaMetrica
