import { useAuth } from '../context/AuthContext'
import { useEmpleados } from '../context/EmpleadosContext'
import { useTareas } from '../context/TareasContext'
import { useMetricas } from '../context/MetricasContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { usuarioActual } = useAuth()
  const { empleados } = useEmpleados()
  const { tareas } = useTareas()
  const { calcularTodasMetricas } = useMetricas()
  const navigate = useNavigate()

  const todasMetricas = calcularTodasMetricas()

  // ── Estadísticas generales ──
  const totalEmpleados = empleados.length
  const empleadosDisponibles = empleados.filter((e) => e.estado === 'disponible').length
  const empleadosOcupados = empleados.filter((e) => e.estado === 'ocupado').length
  const empleadosVacaciones = empleados.filter((e) => e.estado === 'vacaciones').length

  const totalTareas = tareas.length
  const tareasPendientes = tareas.filter((t) => t.estado === 'pendiente').length
  const tareasEnProgreso = tareas.filter((t) => t.estado === 'en progreso').length
  const tareasCompletadas = tareas.filter((t) => t.estado === 'completada').length
  const tareasCanceladas = tareas.filter((t) => t.estado === 'cancelada').length

  // ── Tareas sin asignar ──
  const tareasSinAsignar = tareas.filter((t) => !t.empleadoAsignado && t.estado === 'pendiente')

  // ── Tareas de alta prioridad pendientes ──
  const tareasUrgentes = tareas.filter((t) => t.prioridad === 'alta' && t.estado === 'pendiente')

  // ── Últimas tareas completadas ──
  const ultimasCompletadas = tareas
    .filter((t) => t.estado === 'completada')
    .slice(-5)
    .reverse()

  // ── Empleado del mes ──
  const empleadoDelMes = todasMetricas.filter((m) => m.metricas.totalEvaluadas > 0).sort((a, b) => b.metricas.calificacionPromedio - a.metricas.calificacionPromedio)[0]

  // ── Promedio general del equipo ──
  const promedioEquipo = todasMetricas
    .filter((m) => m.metricas.calificacionPromedio > 0)
    .reduce((sum, m, _, arr) => sum + m.metricas.calificacionPromedio / arr.length, 0)
    .toFixed(1)

  function renderEstrellas(cal) {
    return [1, 2, 3, 4, 5].map((e) => (
      <span key={e} style={{ color: e <= cal ? '#f57f17' : '#ddd', fontSize: '14px' }}>
        ★
      </span>
    ))
  }

  return (
    <div className="pagina">
      {/* Bienvenida */}
      <div className="dashboard-bienvenida">
        <div>
          <h1>👋 Bienvenido, {usuarioActual.nombre}</h1>
          <p>Aquí tienes el resumen del día de ITALICA BOLIVIA</p>
        </div>
        <div className="dashboard-fecha">
          <p>
            {new Date().toLocaleDateString('es-BO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Alertas importantes */}
      {(tareasUrgentes.length > 0 || tareasSinAsignar.length > 0) && (
        <div className="dashboard-alertas">
          {tareasUrgentes.length > 0 && (
            <div className="alerta alerta-urgente">
              🚨 <strong>{tareasUrgentes.length} tarea(s) de alta prioridad</strong> pendientes sin completar
              <button className="alerta-btn" onClick={() => navigate('/tareas')}>
                Ver tareas
              </button>
            </div>
          )}
          {tareasSinAsignar.length > 0 && (
            <div className="alerta alerta-info">
              ⚠️ <strong>{tareasSinAsignar.length} tarea(s)</strong> sin empleado asignado
              <button className="alerta-btn" onClick={() => navigate('/tareas')}>
                Asignar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resumen empleados */}
      <h2 className="dashboard-seccion-titulo">👥 Estado del Equipo</h2>
      <div className="resumen-tareas">
        <div className="resumen-item">
          <span className="resumen-numero">{totalEmpleados}</span>
          <span className="resumen-label">👥 Total</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#2e7d32' }}>
            {empleadosDisponibles}
          </span>
          <span className="resumen-label">✅ Disponibles</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#1565c0' }}>
            {empleadosOcupados}
          </span>
          <span className="resumen-label">🔄 Ocupados</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#f57f17' }}>
            {empleadosVacaciones}
          </span>
          <span className="resumen-label">🌴 Vacaciones</span>
        </div>
      </div>

      {/* Resumen tareas */}
      <h2 className="dashboard-seccion-titulo">📋 Estado de Tareas</h2>
      <div className="resumen-tareas">
        <div className="resumen-item">
          <span className="resumen-numero">{totalTareas}</span>
          <span className="resumen-label">📋 Total</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#f57f17' }}>
            {tareasPendientes}
          </span>
          <span className="resumen-label">⏳ Pendientes</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#1565c0' }}>
            {tareasEnProgreso}
          </span>
          <span className="resumen-label">🔄 En Progreso</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#2e7d32' }}>
            {tareasCompletadas}
          </span>
          <span className="resumen-label">✅ Completadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: '#999' }}>
            {tareasCanceladas}
          </span>
          <span className="resumen-label">❌ Canceladas</span>
        </div>
      </div>

      {/* Fila inferior */}
      <div className="dashboard-fila">
        {/* Empleado del mes */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-titulo">🏆 Mejor Rendimiento</h2>
          {empleadoDelMes ? (
            <div className="empleado-mes">
              <div className="empleado-mes-avatar">{empleadoDelMes.empleado.nombre.charAt(0)}</div>
              <div className="empleado-mes-info">
                <h3>{empleadoDelMes.empleado.nombre}</h3>
                <p>{empleadoDelMes.empleado.cargo}</p>
                <div>{renderEstrellas(empleadoDelMes.metricas.calificacionPromedio)}</div>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                  {empleadoDelMes.metricas.calificacionPromedio}⭐ promedio —{empleadoDelMes.metricas.totalCompletadas} tareas completadas
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: '#999', fontSize: '14px' }}>Sin evaluaciones aún</p>
          )}

          {/* Promedio del equipo */}
          <div className="promedio-equipo">
            <p>📊 Promedio general del equipo:</p>
            <span className="promedio-numero">{promedioEquipo > 0 ? `${promedioEquipo} ⭐` : 'Sin datos'}</span>
          </div>
        </div>

        {/* Últimas completadas */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-titulo">✅ Últimas Completadas</h2>
          {ultimasCompletadas.length > 0 ? (
            <div className="ultimas-lista">
              {ultimasCompletadas.map((tarea) => (
                <div key={tarea.id} className="ultima-item">
                  <div className="ultima-info">
                    <p className="ultima-titulo">{tarea.titulo}</p>
                    <p className="ultima-empleado">👤 {tarea.empleadoAsignado || 'Sin asignar'}</p>
                  </div>
                  <div className="ultima-meta">
                    {tarea.evaluacion && <div>{renderEstrellas(tarea.evaluacion.calificacion)}</div>}
                    {tarea.tiempoReal && <span className="ultima-tiempo">{tarea.tiempoReal} min</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontSize: '14px' }}>Sin tareas completadas aún</p>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <h2 className="dashboard-seccion-titulo">⚡ Accesos Rápidos</h2>
      <div className="accesos-rapidos">
        <button className="acceso-btn" onClick={() => navigate('/empleados')}>
          <span>👥</span>
          <span>Gestionar Empleados</span>
        </button>
        <button className="acceso-btn" onClick={() => navigate('/tareas')}>
          <span>📋</span>
          <span>Gestionar Tareas</span>
        </button>
        <button className="acceso-btn" onClick={() => navigate('/metricas')}>
          <span>📈</span>
          <span>Ver Métricas</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
