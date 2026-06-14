import { createContext, useContext } from 'react'
import { useEmpleados } from './EmpleadosContext'
import { useTareas } from './TareasContext'

export const MetricasContext = createContext<any>(null)

export function MetricasProvider({ children }) {
  const { empleados } = useEmpleados()
  const { tareas } = useTareas()

  // Calcula métricas completas de un empleado
  function calcularMetricas(nombreEmpleado) {
    // Filtra todas las tareas completadas del empleado
    const tareasCompletadas = tareas.filter(
      (t) => t.empleadoAsignado === nombreEmpleado && t.estado === "completada"
    )

    // Filtra las que tienen evaluación
    const tareasEvaluadas = tareasCompletadas.filter((t) => t.evaluacion)

    // ── Calificación promedio ──
    const calificacionPromedio = tareasEvaluadas.length > 0
      ? Number((tareasEvaluadas.reduce((sum, t) => sum + t.evaluacion.calificacion, 0) / tareasEvaluadas.length).toFixed(1))
      : 0

    // ── Puntualidad ──
    // Una tarea es puntual si el tiempo real es menor o igual al estimado
    const tareasConTiempo = tareasCompletadas.filter(
      (t) => t.tiempoReal !== null && t.fechaFin && t.horaFin
    )

    const tareasPuntuales = tareasConTiempo.filter((t) => {
      if (!t.timestampInicio || !t.horaFinReal) return false
      const finProgramado = new Date(`${t.fechaFin}T${t.horaFin}`)
      const finReal = new Date()
      const [h, m] = t.horaFinReal.split(":").map(Number)
      finReal.setHours(h, m, 0)
      return finReal <= finProgramado
    })

    const porcentajePuntualidad = tareasConTiempo.length > 0
      ? Math.round((tareasPuntuales.length / tareasConTiempo.length) * 100)
      : 0

    // ── Tiempo promedio por tipo ──
    const tiempoPorTipo = {}
    tareasCompletadas.forEach((t) => {
      if (t.tiempoReal && t.tipo) {
        if (!tiempoPorTipo[t.tipo]) {
          tiempoPorTipo[t.tipo] = { total: 0, cantidad: 0 }
        }
        tiempoPorTipo[t.tipo].total += t.tiempoReal
        tiempoPorTipo[t.tipo].cantidad += 1
      }
    })

    const tiempoPromedioPorTipo = {}
    Object.keys(tiempoPorTipo).forEach((tipo) => {
      tiempoPromedioPorTipo[tipo] = Math.round(
        tiempoPorTipo[tipo].total / tiempoPorTipo[tipo].cantidad
      )
    })

    // ── Mejor y peor tipo de tarea ──
    const calificacionPorTipo = {}
    tareasEvaluadas.forEach((t) => {
      if (!calificacionPorTipo[t.tipo]) {
        calificacionPorTipo[t.tipo] = { total: 0, cantidad: 0 }
      }
      calificacionPorTipo[t.tipo].total += t.evaluacion.calificacion
      calificacionPorTipo[t.tipo].cantidad += 1
    })

    let mejorTipo = null
    let peorTipo = null
    let mejorProm = 0
    let peorProm = 6

    Object.keys(calificacionPorTipo).forEach((tipo) => {
      const prom = calificacionPorTipo[tipo].total / calificacionPorTipo[tipo].cantidad
      if (prom > mejorProm) { mejorProm = prom; mejorTipo = tipo }
      if (prom < peorProm)  { peorProm = prom;  peorTipo = tipo }
    })

    // ── Tendencia ──
    // Compara las últimas 3 calificaciones con las anteriores
    const ultimasCalificaciones = tareasEvaluadas
      .slice(-5)
      .map((t) => t.evaluacion.calificacion)

    let tendencia = "estable"
    if (ultimasCalificaciones.length >= 3) {
      const mitad = Math.floor(ultimasCalificaciones.length / 2)
      const primera = ultimasCalificaciones.slice(0, mitad)
      const segunda = ultimasCalificaciones.slice(mitad)
      const promPrimera = primera.reduce((a, b) => a + b, 0) / primera.length
      const promSegunda = segunda.reduce((a, b) => a + b, 0) / segunda.length
      if (promSegunda > promPrimera + 0.3)      tendencia = "mejorando"
      else if (promSegunda < promPrimera - 0.3) tendencia = "bajando"
    }

    // ── Resultados por tipo ──
    const satisfactorias = tareasEvaluadas.filter(
      (t) => t.evaluacion.resultado === "satisfactorio"
    ).length

    const porcentajeSatisfaccion = tareasEvaluadas.length > 0
      ? Math.round((satisfactorias / tareasEvaluadas.length) * 100)
      : 0

    return {
      totalCompletadas: tareasCompletadas.length,
      totalEvaluadas: tareasEvaluadas.length,
      calificacionPromedio,
      porcentajePuntualidad,
      porcentajeSatisfaccion,
      tiempoPromedioPorTipo,
      mejorTipo,
      peorTipo,
      tendencia,
      ultimasCalificaciones,
    }
  }

  // Calcula métricas de todos los empleados
  function calcularTodasMetricas() {
    return empleados.map((emp) => ({
      empleado: emp,
      metricas: calcularMetricas(emp.nombre),
    }))
  }

  return (
    <MetricasContext.Provider value={{ calcularMetricas, calcularTodasMetricas }}>
      {children}
    </MetricasContext.Provider>
  )
}

export function useMetricas() {
  return useContext(MetricasContext)
}