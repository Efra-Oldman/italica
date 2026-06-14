import { useState } from 'react'
import { useEmpresa } from '../context/EmpresaContext'

function PanelEvaluacion({ tarea, onGuardar, onCerrar }) {
  const { generarContextoIA } = useEmpresa()
  const [calificacion, setCalificacion] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [resultado, setResultado] = useState('satisfactorio')
  const [analizando, setAnalizando] = useState(false)
  const [analisisIA, setAnalisisIA] = useState('')

  async function analizarConIA() {
    if (comentario.trim() === '') {
      alert('Escribe un comentario antes de analizar con IA')
      return
    }

    setAnalizando(true)
    setAnalisisIA('')

    const prompt = `Eres un asistente experto en recursos humanos.

CONTEXTO DE LA EMPRESA:
${generarContextoIA()}

Un administrador evaluó la siguiente tarea completada por un empleado:

TAREA: ${tarea.titulo}
TIPO: ${tarea.tipo}
ÁREA: ${tarea.area}
EMPLEADO: ${tarea.empleadoAsignado}
TIEMPO REAL: ${tarea.tiempoReal || 'No registrado'} minutos
CALIFICACIÓN: ${calificacion} de 5 estrellas
RESULTADO: ${resultado}
COMENTARIO DEL ADMIN: "${comentario}"

Analiza este comentario considerando el contexto de la empresa y proporciona:
1. Un resumen breve del desempeño del empleado
2. Las fortalezas detectadas en base al comentario
3. Áreas de mejora si las hay
4. Una recomendación para futuras asignaciones similares en ITALICA BOLIVIA

Responde de forma concisa y profesional en español, máximo 150 palabras.`

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
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      const texto = data.choices[0].message.content
      setAnalisisIA(texto)
    } catch (_err) {
      setAnalisisIA('Error al conectar con la IA. Por favor intenta de nuevo.')
    }

    setAnalizando(false)
  }

  function handleGuardar() {
    if (calificacion === 0) {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas')
      return
    }
    if (comentario.trim() === '') {
      alert('Por favor escribe un comentario')
      return
    }

    onGuardar({
      calificacion,
      comentario,
      resultado,
      analisisIA,
      fechaEvaluacion: new Date().toLocaleDateString('es-BO'),
    })
  }

  return (
    <div className="panel-overlay">
      <div className="panel-evaluacion">
        <div className="panel-header">
          <h2>⭐ Evaluar Tarea</h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <div className="panel-tarea-info">
          <p>
            <strong>📋 Tarea:</strong> {tarea.titulo}
          </p>
          <p>
            <strong>👤 Empleado:</strong> {tarea.empleadoAsignado}
          </p>
          <p>
            <strong>⏱️ Tiempo real:</strong> {tarea.tiempoReal || 'No registrado'} minutos
          </p>
          <p>
            <strong>🕐 Inicio:</strong> {tarea.horaInicioReal || '—'}
          </p>
          <p>
            <strong>🕐 Fin:</strong> {tarea.horaFinReal || '—'}
          </p>
        </div>

        <div className="panel-seccion">
          <label className="panel-label">Calificación</label>
          <div className="estrellas">
            {[1, 2, 3, 4, 5].map((estrella) => (
              <span key={estrella} className={`estrella ${estrella <= (hover || calificacion) ? 'activa' : ''}`} onClick={() => setCalificacion(estrella)} onMouseEnter={() => setHover(estrella)} onMouseLeave={() => setHover(0)}>
                ★
              </span>
            ))}
            <span className="calificacion-texto">
              {calificacion === 0 && 'Sin calificar'}
              {calificacion === 1 && 'Deficiente'}
              {calificacion === 2 && 'Regular'}
              {calificacion === 3 && 'Bueno'}
              {calificacion === 4 && 'Muy Bueno'}
              {calificacion === 5 && 'Excelente'}
            </span>
          </div>
        </div>

        <div className="panel-seccion">
          <label className="panel-label">Resultado general</label>
          <div className="resultado-opciones">
            {['satisfactorio', 'regular', 'insatisfactorio'].map((op) => (
              <button key={op} className={`btn-resultado ${resultado === op ? 'activo-' + op : ''}`} onClick={() => setResultado(op)}>
                {op === 'satisfactorio' && '✅ Satisfactorio'}
                {op === 'regular' && '⚠️ Regular'}
                {op === 'insatisfactorio' && '❌ Insatisfactorio'}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-seccion">
          <label className="panel-label">Comentario del administrador</label>
          <textarea className="panel-textarea" placeholder="Describe el desempeño del empleado en esta tarea..." value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4} />
        </div>

        <button className="btn-ia" onClick={analizarConIA} disabled={analizando}>
          {analizando ? '🤖 Analizando...' : '🤖 Analizar con IA'}
        </button>

        {analisisIA && (
          <div className="panel-ia-resultado">
            <p className="panel-ia-titulo">🤖 Análisis de la IA:</p>
            <p className="panel-ia-texto">{analisisIA}</p>
          </div>
        )}

        <div className="panel-botones">
          <button className="btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-principal" onClick={handleGuardar}>
            💾 Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  )
}

export default PanelEvaluacion
