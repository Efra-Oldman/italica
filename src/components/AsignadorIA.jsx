import { useState } from 'react'
import { useEmpleados } from '../context/EmpleadosContext'
import { useTareas } from '../context/TareasContext'
import { useMetricas } from '../context/MetricasContext'
import { useEmpresa } from '../context/EmpresaContext'

function AsignadorIA({ tarea, onCerrar, onAsignar }) {
  const { empleados } = useEmpleados()
  const { tareas } = useTareas()
  const { calcularMetricas } = useMetricas()
  const { generarContextoIA } = useEmpresa()

  const [analizando, setAnalizando] = useState(false)
  const [recomendacion, setRecomendacion] = useState(null)
  const [error, setError] = useState('')

  function construirPerfilCompleto() {
    return empleados.map((emp) => {
      const metricas = calcularMetricas(emp.nombre)

      const tareasActivas = tareas.filter((t) => t.empleadoAsignado === emp.nombre && t.estado === 'en progreso').length

      return {
        nombre: emp.nombre,
        cargo: emp.cargo,
        area: emp.area,
        estado: emp.estado,
        habilidades: emp.habilidades.join(', '),
        tareasCompletadas: metricas.totalCompletadas,
        calificacionPromedio: metricas.calificacionPromedio || 'Sin datos',
        porcentajePuntualidad: metricas.porcentajePuntualidad + '%',
        porcentajeSatisfaccion: metricas.porcentajeSatisfaccion + '%',
        tendencia: metricas.tendencia,
        mejorTipo: metricas.mejorTipo || 'Sin datos',
        peorTipo: metricas.peorTipo || 'Sin datos',
        tiempoPromedioPorTipo: JSON.stringify(metricas.tiempoPromedioPorTipo),
        tareasActivas,
      }
    })
  }

  async function analizarConIA() {
    setAnalizando(true)
    setRecomendacion(null)
    setError('')

    const perfiles = construirPerfilCompleto()
    const empleadosActivos = perfiles.filter((e) => e.estado !== 'vacaciones')

    if (empleadosActivos.length === 0) {
      setError('No hay empleados disponibles — todos están de vacaciones')
      setAnalizando(false)
      return
    }

    const prompt = `Eres un asistente experto en recursos humanos.

CONTEXTO DE LA EMPRESA:
${generarContextoIA()}

TAREA A ASIGNAR:
- Título: ${tarea.titulo}
- Tipo: ${tarea.tipo}
- Área requerida: ${tarea.area}
- Prioridad: ${tarea.prioridad}
- Descripción: ${tarea.descripcion}

PERFILES COMPLETOS DE EMPLEADOS:
${empleadosActivos
  .map(
    (e, i) => `
EMPLEADO ${i + 1}: ${e.nombre}
- Cargo: ${e.cargo}
- Área: ${e.area}
- Estado: ${e.estado}
- Habilidades: ${e.habilidades}
- Tareas activas ahora: ${e.tareasActivas}

MÉTRICAS DE RENDIMIENTO:
- Tareas completadas: ${e.tareasCompletadas}
- Calificación promedio: ${e.calificacionPromedio} ⭐
- Puntualidad: ${e.porcentajePuntualidad}
- Satisfacción: ${e.porcentajeSatisfaccion}
- Tendencia: ${e.tendencia}
- Mejor en: ${e.mejorTipo}
- Necesita mejorar en: ${e.peorTipo}
- Tiempo promedio por tipo: ${e.tiempoPromedioPorTipo}
`,
  )
  .join('\n')}

REGLAS ESTRICTAS DE ASIGNACIÓN:
1. OBLIGATORIO: El empleado DEBE pertenecer al área "${tarea.area}" o tener habilidades directamente relacionadas con "${tarea.tipo}". Si ningún empleado del área está disponible, explícalo en advertencias.
2. NUNCA recomiendes un empleado de un área completamente diferente sin justificación técnica clara.
3. Prioriza en este orden:
   a) Mismo área + habilidades coincidentes
   b) Habilidades coincidentes aunque sea de otra área
   c) Disponibilidad y carga de trabajo
   d) Métricas de rendimiento
   e) Tendencia de mejora
4. Si el empleado está "ocupado" agrégalo como advertencia.
5. Si está "vacaciones" NUNCA lo recomiendes.
6. Justifica siempre con datos reales de las métricas.

Responde ÚNICAMENTE en este formato JSON exacto, sin texto adicional:
{
  "recomendado": "Nombre del empleado",
  "calificacionCompatibilidad": 85,
  "razonPrincipal": "Razón principal basada en métricas reales",
  "fortalezas": ["fortaleza 1 con dato real", "fortaleza 2", "fortaleza 3"],
  "advertencias": ["advertencia basada en métricas o vacío"],
  "alternativa": "Nombre del segundo mejor candidato",
  "tiempoEstimado": "Tiempo estimado en minutos basado en historial"
}`

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      const data = await response.json()
      const texto = data.choices[0].message.content

      const jsonLimpio = texto
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()

      const resultado = JSON.parse(jsonLimpio)
      setRecomendacion(resultado)
    } catch (err) {
      setError('Error al conectar con la IA. Verifica tu conexión e intenta de nuevo.')
      console.error('Error en AsignadorIA:', err)
    }
    setAnalizando(false)
  }

  return (
    <div className="panel-overlay">
      <div className="panel-evaluacion">
        <div className="panel-header">
          <h2>🤖 Asignador con IA</h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="panel-tarea-info">
          <p>
            <strong>📋 Tarea:</strong> {tarea.titulo}
          </p>
          <p>
            <strong>🏷️ Tipo:</strong> {tarea.tipo}
          </p>
          <p>
            <strong>🏢 Área:</strong> {tarea.area}
          </p>
          <p>
            <strong>⚡ Prioridad:</strong> {tarea.prioridad}
          </p>
        </div>

        <button className="btn-ia" onClick={analizarConIA} disabled={analizando}>
          {analizando ? '🤖 Analizando empleados...' : '🤖 Recomendar Empleado con IA'}
        </button>

        {error && (
          <div className="panel-ia-resultado" style={{ borderColor: '#8B0000' }}>
            <p style={{ color: '#8B0000' }}>⚠️ {error}</p>
          </div>
        )}

        {recomendacion && (
          <div className="recomendacion-contenedor">
            <div className="recomendacion-principal">
              <div className="recomendacion-header">
                <span className="recomendacion-icono">👤</span>
                <div>
                  <h3 className="recomendacion-nombre">{recomendacion.recomendado}</h3>
                  <p className="recomendacion-subtitulo">Recomendado por métricas reales</p>
                </div>
                <div className="compatibilidad-badge">
                  <span className="compatibilidad-numero">{recomendacion.calificacionCompatibilidad}%</span>
                  <span className="compatibilidad-label">Compatible</span>
                </div>
              </div>

              <p className="recomendacion-razon">💡 {recomendacion.razonPrincipal}</p>

              {recomendacion.tiempoEstimado && (
                <div
                  style={{
                    background: '#e8eaf6',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#1a237e',
                  }}
                >
                  ⏱️ <strong>Tiempo estimado:</strong> {recomendacion.tiempoEstimado}
                </div>
              )}

              <div className="recomendacion-seccion">
                <p className="recomendacion-seccion-titulo">✅ Fortalezas:</p>
                <ul className="recomendacion-lista">
                  {recomendacion.fortalezas.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {recomendacion.advertencias && recomendacion.advertencias.length > 0 && recomendacion.advertencias[0] !== '' && (
                <div className="recomendacion-seccion">
                  <p className="recomendacion-seccion-titulo">⚠️ Consideraciones:</p>
                  <ul className="recomendacion-lista advertencia">
                    {recomendacion.advertencias.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recomendacion.alternativa && (
                <p className="recomendacion-alternativa">
                  🔄 Alternativa: <strong>{recomendacion.alternativa}</strong>
                </p>
              )}
            </div>

            <div className="panel-botones" style={{ marginTop: '16px' }}>
              <button className="btn-secundario" onClick={onCerrar}>
                Cancelar
              </button>
              <button className="btn-principal" onClick={() => onAsignar(tarea.id, recomendacion.recomendado)}>
                ✅ Asignar a {recomendacion.recomendado}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AsignadorIA
