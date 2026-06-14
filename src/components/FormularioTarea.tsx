import { useState, useEffect } from 'react'
import { useEmpleados } from '../context/EmpleadosContext'

function FormularioTarea({ onAgregar, onEditar, tareaEditando }) {
  const { empleados } = useEmpleados()

  const [titulo, setTitulo]           = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [tipo, setTipo]               = useState("")
  const [prioridad, setPrioridad]     = useState("media")
  const [area, setArea]               = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [horaInicio, setHoraInicio]   = useState("")
  const [fechaFin, setFechaFin]       = useState("")
  const [horaFin, setHoraFin]         = useState("")
  const [empleadoAsignado, setEmpleadoAsignado] = useState("")
  const [errores, setErrores]         = useState<Record<string, string>>({})

  // Estados del corrector IA
  const [corrigiendo, setCorrigiendo]         = useState(false)
  const [sugerencia, setSugerencia]           = useState(null)
  const [mostrarSugerencia, setMostrarSugerencia] = useState(false)

  const empleadosDisponibles = empleados.filter((e) => e.estado === "disponible")

  useEffect(() => {
    if (tareaEditando) {
      setTitulo(tareaEditando.titulo)
      setDescripcion(tareaEditando.descripcion)
      setTipo(tareaEditando.tipo)
      setPrioridad(tareaEditando.prioridad)
      setArea(tareaEditando.area)
      setFechaInicio(tareaEditando.fechaInicio || "")
      setHoraInicio(tareaEditando.horaInicio || "")
      setFechaFin(tareaEditando.fechaFin || "")
      setHoraFin(tareaEditando.horaFin || "")
      setEmpleadoAsignado(tareaEditando.empleadoAsignado || "")
    } else {
      setTitulo("")
      setDescripcion("")
      setTipo("")
      setPrioridad("media")
      setArea("")
      setFechaInicio("")
      setHoraInicio("")
      setFechaFin("")
      setHoraFin("")
      setEmpleadoAsignado("")
      setErrores({})
      setSugerencia(null)
      setMostrarSugerencia(false)
    }
  }, [tareaEditando])

  // ── Corrector de IA ──
  async function corregirConIA() {
    if (titulo.trim() === "" && descripcion.trim() === "") {
      alert("Escribe al menos el título o descripción antes de corregir")
      return
    }

    setCorrigiendo(true)
    setSugerencia(null)
    setMostrarSugerencia(false)

    const prompt = `Eres un asistente de gestión de tareas para ITALICA BOLIVIA, empresa comercializadora de herrajes y productos Häfele.

El administrador escribió la siguiente tarea:

TÍTULO ACTUAL: "${titulo}"
DESCRIPCIÓN ACTUAL: "${descripcion}"
TIPO DE TAREA: "${tipo || "No especificado"}"
ÁREA: "${area || "No especificada"}"

Tu trabajo es mejorar el título y la descripción para que sean:
1. Claros y profesionales
2. Específicos y detallados
3. Con verbos de acción al inicio
4. Útiles para que el empleado sepa exactamente qué hacer

Responde ÚNICAMENTE en este formato JSON exacto, sin texto adicional:
{
  "tituloMejorado": "Título mejorado aquí",
  "descripcionMejorada": "Descripción mejorada aquí",
  "explicacion": "Breve explicación de los cambios realizados"
}`

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        })
      })

      const data = await response.json()
      const texto = data.choices[0].message.content

      const jsonLimpio = texto
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      const resultado = JSON.parse(jsonLimpio)
      setSugerencia(resultado)
      setMostrarSugerencia(true)

    } catch (err) {
      alert("Error al conectar con la IA. Intenta de nuevo.")
    }

    setCorrigiendo(false)
  }

  // Acepta la sugerencia de la IA
  function aceptarSugerencia() {
    setTitulo(sugerencia.tituloMejorado)
    setDescripcion(sugerencia.descripcionMejorada)
    setMostrarSugerencia(false)
    setSugerencia(null)
  }

  // Rechaza la sugerencia
  function rechazarSugerencia() {
    setMostrarSugerencia(false)
    setSugerencia(null)
  }

  function validar() {
    const nuevosErrores: Record<string, string> = {}
    const ahora = new Date()

    if (!titulo)      nuevosErrores.titulo      = "El título es obligatorio"
    if (!descripcion) nuevosErrores.descripcion = "La descripción es obligatoria"
    if (!tipo)        nuevosErrores.tipo        = "Selecciona el tipo de tarea"
    if (!area)        nuevosErrores.area        = "Selecciona el área"
    if (!fechaInicio) nuevosErrores.fechaInicio = "La fecha de inicio es obligatoria"
    if (!horaInicio)  nuevosErrores.horaInicio  = "La hora de inicio es obligatoria"
    if (!fechaFin)    nuevosErrores.fechaFin    = "La fecha de fin es obligatoria"
    if (!horaFin)     nuevosErrores.horaFin     = "La hora de fin es obligatoria"

    if (fechaInicio && horaInicio) {
      const inicioCompleto = new Date(`${fechaInicio}T${horaInicio}`)
      if (inicioCompleto < ahora) {
        nuevosErrores.fechaInicio = "La fecha y hora de inicio no puede ser en el pasado"
      }
      if (fechaFin && horaFin) {
        const finCompleto = new Date(`${fechaFin}T${horaFin}`)
        if (finCompleto <= inicioCompleto) {
          nuevosErrores.fechaFin = "La fecha de fin debe ser posterior a la de inicio"
        }
      }
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  function handleGuardar() {
    if (!validar()) return

    const datos = {
      titulo,
      descripcion,
      tipo,
      prioridad,
      area,
      fechaInicio,
      horaInicio,
      fechaFin,
      horaFin,
      empleadoAsignado: empleadoAsignado || null,
      estado: tareaEditando ? tareaEditando.estado : "pendiente",
    }

    if (tareaEditando) {
      onEditar({ id: tareaEditando.id, ...datos })
    } else {
      onAgregar(datos)
    }

    setTitulo("")
    setDescripcion("")
    setTipo("")
    setPrioridad("media")
    setArea("")
    setFechaInicio("")
    setHoraInicio("")
    setFechaFin("")
    setHoraFin("")
    setEmpleadoAsignado("")
    setErrores({})
    setSugerencia(null)
    setMostrarSugerencia(false)
  }

  return (
    <div className="formulario-empleado">
      <h2>{tareaEditando ? "✏️ Editar Tarea" : "➕ Nueva Tarea"}</h2>

      <div className="formulario-grid">

        <div className="campo">
          <label>Título de la tarea</label>
          <input
            placeholder="Ej: Atención cliente showroom"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          {errores.titulo && <span className="error-msg">{errores.titulo}</span>}
        </div>

        <div className="campo">
          <label>Tipo de tarea</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Selecciona el tipo</option>
            <option value="Atención Showroom">🛍️ Atención Showroom</option>
            <option value="Visita Comercial">💼 Visita Comercial</option>
            <option value="Cotización">📄 Cotización</option>
            <option value="Soporte Técnico">🔧 Soporte Técnico</option>
            <option value="Seguimiento Pedido">📦 Seguimiento Pedido</option>
            <option value="Reporte">📊 Reporte</option>
            <option value="Limpieza">🧹 Limpieza</option>
            <option value="Mantenimiento">🔨 Mantenimiento</option>
            <option value="Viaje a Sucursal">🚗 Viaje a Sucursal</option>
          </select>
          {errores.tipo && <span className="error-msg">{errores.tipo}</span>}
        </div>

        <div className="campo">
          <label>Área responsable</label>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Selecciona el área</option>
            <option value="Ventas">Ventas</option>
            <option value="Showroom">Showroom</option>
            <option value="Soporte">Soporte</option>
            <option value="Administración">Administración</option>
            <option value="Atención al Cliente">Atención al Cliente</option>
          </select>
          {errores.area && <span className="error-msg">{errores.area}</span>}
        </div>

        <div className="campo">
          <label>Prioridad</label>
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>

        <div className="campo">
          <label>📅 Fecha de inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          {errores.fechaInicio && <span className="error-msg">{errores.fechaInicio}</span>}
        </div>

        <div className="campo">
          <label>🕐 Hora de inicio</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
          {errores.horaInicio && <span className="error-msg">{errores.horaInicio}</span>}
        </div>

        <div className="campo">
          <label>📅 Fecha de finalización</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          {errores.fechaFin && <span className="error-msg">{errores.fechaFin}</span>}
        </div>

        <div className="campo">
          <label>🕐 Hora de finalización</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />
          {errores.horaFin && <span className="error-msg">{errores.horaFin}</span>}
        </div>

        <div className="campo">
          <label>👤 Asignar empleado</label>
          <select
            value={empleadoAsignado}
            onChange={(e) => setEmpleadoAsignado(e.target.value)}
          >
            <option value="">Sin asignar (usar IA después)</option>
            {empleadosDisponibles.map((e) => (
              <option key={e.id} value={e.nombre}>
                {e.nombre} — {e.cargo} ({e.area})
              </option>
            ))}
          </select>
          {empleadosDisponibles.length === 0 && (
            <span className="error-msg">
              ⚠️ No hay empleados disponibles
            </span>
          )}
        </div>

      </div>

      {/* Descripción */}
      <div className="campo" style={{ marginBottom: "16px" }}>
        <label>Descripción detallada</label>
        <textarea
          className="textarea-descripcion"
          placeholder="Describe detalladamente lo que se debe hacer..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />
        {errores.descripcion && <span className="error-msg">{errores.descripcion}</span>}
      </div>

      {/* Botón corrector IA */}
      <button
        className="btn-corrector-ia"
        onClick={corregirConIA}
        disabled={corrigiendo}
        type="button"
      >
        {corrigiendo ? "🤖 Analizando texto..." : "🤖 Mejorar título y descripción con IA"}
      </button>

      {/* Sugerencia de la IA */}
      {mostrarSugerencia && sugerencia && (
        <div className="sugerencia-ia">
          <p className="sugerencia-titulo">🤖 Sugerencia de la IA:</p>

          <div className="sugerencia-comparacion">
            <div className="sugerencia-lado">
              <p className="sugerencia-label">📝 Título mejorado:</p>
              <p className="sugerencia-texto">{sugerencia.tituloMejorado}</p>
            </div>
            <div className="sugerencia-lado">
              <p className="sugerencia-label">📋 Descripción mejorada:</p>
              <p className="sugerencia-texto">{sugerencia.descripcionMejorada}</p>
            </div>
          </div>

          <p className="sugerencia-explicacion">
            💡 {sugerencia.explicacion}
          </p>

          <div className="sugerencia-botones">
            <button className="btn-rechazar" onClick={rechazarSugerencia}>
              ❌ Ignorar
            </button>
            <button className="btn-aceptar" onClick={aceptarSugerencia}>
              ✅ Aceptar sugerencia
            </button>
          </div>
        </div>
      )}

      <button className="btn-principal" onClick={handleGuardar} style={{ marginTop: "16px" }}>
        {tareaEditando ? "💾 Guardar Cambios" : "➕ Crear Tarea"}
      </button>

    </div>
  )
}

export default FormularioTarea