import { useMetricas } from '../context/MetricasContext'
import TarjetaMetrica from '../components/TarjetaMetrica'

function Metricas() {
  const { calcularTodasMetricas } = useMetricas()
  const todasMetricas = calcularTodasMetricas()

  // Empleado con mejor calificación
  const mejorEmpleado = todasMetricas
    .filter((m) => m.metricas.totalEvaluadas > 0)
    .sort((a, b) => b.metricas.calificacionPromedio - a.metricas.calificacionPromedio)[0]

  // Totales generales
  const totalTareasCompletadas = todasMetricas.reduce(
    (sum, m) => sum + m.metricas.totalCompletadas, 0
  )

  const promedioGeneral = todasMetricas
    .filter((m) => m.metricas.calificacionPromedio > 0)
    .reduce((sum, m, _, arr) => sum + m.metricas.calificacionPromedio / arr.length, 0)
    .toFixed(1)

  return (
    <div className="pagina">
      <h1>📊 Métricas de Rendimiento</h1>

      {/* Resumen general */}
      <div className="resumen-tareas" style={{ marginBottom: "24px" }}>
        <div className="resumen-item">
          <span className="resumen-numero">{todasMetricas.length}</span>
          <span className="resumen-label">👥 Empleados</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{totalTareasCompletadas}</span>
          <span className="resumen-label">✅ Completadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{promedioGeneral > 0 ? promedioGeneral : "—"}</span>
          <span className="resumen-label">⭐ Promedio</span>
        </div>
        {mejorEmpleado && (
          <div className="resumen-item">
            <span className="resumen-numero" style={{ fontSize: "16px" }}>
              🏆
            </span>
            <span className="resumen-label">{mejorEmpleado.empleado.nombre}</span>
          </div>
        )}
      </div>

      {/* Tarjetas de métricas */}
      <div className="lista">
        {todasMetricas.map(({ empleado, metricas }) => (
          <TarjetaMetrica
            key={empleado.id}
            empleado={empleado}
            metricas={metricas}
          />
        ))}
      </div>

    </div>
  )
}

export default Metricas