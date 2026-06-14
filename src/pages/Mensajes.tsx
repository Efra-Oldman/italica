import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMensajes } from '../context/MensajesContext'
import PanelMensaje from '../components/PanelMensaje'

function Mensajes() {
  const { usuarioActual } = useAuth()
  const {
    conversaciones,
    iniciarConversacion,
    marcarLeida,
    eliminarConversacion,
  } = useMensajes()

  const [convSeleccionada, setConvSeleccionada] = useState(null)
  const [filtro, setFiltro]                     = useState("todos")

  // Formulario nueva conversación
  const [tipo, setTipo]           = useState("mensaje")
  const [asunto, setAsunto]       = useState("")
  const [contenido, setContenido] = useState("")

  const esAdmin = usuarioActual.rol === "admin"

  // Admin ve todas, empleado solo las suyas
  const misConversaciones = esAdmin
    ? conversaciones
    : conversaciones.filter((c) => c.empleado === usuarioActual.nombre)

  const conversacionesFiltradas = misConversaciones.filter((c) => {
    if (filtro === "todos")    return true
    if (filtro === "noLeidos") return !c.leido
    if (filtro === "leidos")   return c.leido
    return c.tipo === filtro
  })

  const noLeidas    = misConversaciones.filter((c) => !c.leido).length
  const respondidas = misConversaciones.filter((c) => c.mensajes.length > 1).length

  function handleVerConversacion(conv) {
    setConvSeleccionada(conv)
    if (!conv.leido) marcarLeida(conv.id)
  }

  function handleIniciarConversacion() {
    if (asunto.trim() === "" || contenido.trim() === "") {
      alert("Por favor completa el asunto y el mensaje")
      return
    }
    iniciarConversacion(usuarioActual.nombre, tipo, asunto, contenido)
    setAsunto("")
    setContenido("")
    setTipo("mensaje")
    alert("✅ Mensaje enviado al administrador")
  }

  function getTipoInfo(tipo) {
    if (tipo === "mensaje")              return { emoji: "💬", color: "#1565c0" }
    if (tipo === "solicitud-skill")      return { emoji: "📋", color: "#2e7d32" }
    if (tipo === "solicitud-vacaciones") return { emoji: "🌴", color: "#f57f17" }
    if (tipo === "reporte-problema")     return { emoji: "⚠️", color: "#8B0000" }
    return { emoji: "💬", color: "#1565c0" }
  }

  // Obtiene el último mensaje de la conversación
  function ultimoMensaje(conv) {
    return conv.mensajes[conv.mensajes.length - 1]
  }

  return (
    <div className="pagina">
      <h1>📨 {esAdmin ? "Bandeja de Mensajes" : "Mis Mensajes"}</h1>

      {/* Resumen */}
      <div className="resumen-tareas">
        <div className="resumen-item">
          <span className="resumen-numero">{misConversaciones.length}</span>
          <span className="resumen-label">💬 Total</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: "#8B0000" }}>{noLeidas}</span>
          <span className="resumen-label">🔴 No leídos</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero" style={{ color: "#2e7d32" }}>{respondidas}</span>
          <span className="resumen-label">✅ Con respuesta</span>
        </div>
      </div>

      {/* Formulario nueva conversación — solo empleados */}
      {!esAdmin && (
        <div className="formulario-empleado">
          <h2>✍️ Nuevo Mensaje al Administrador</h2>
          <div className="formulario-grid">

            <div className="campo">
              <label>Tipo de mensaje</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="mensaje">💬 Mensaje general</option>
                <option value="solicitud-skill">📋 Solicitud de nueva skill</option>
                <option value="solicitud-vacaciones">🌴 Solicitud de vacaciones</option>
                <option value="reporte-problema">⚠️ Reporte de problema</option>
              </select>
            </div>

            <div className="campo">
              <label>Asunto</label>
              <input
                placeholder="Ej: Consulta sobre mi tarea"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
              />
            </div>

          </div>

          <div className="campo" style={{ marginBottom: "16px" }}>
            <label>Mensaje</label>
            <textarea
              className="textarea-descripcion"
              placeholder="Escribe tu mensaje aquí..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={3}
            />
          </div>

          <button className="btn-principal" onClick={handleIniciarConversacion}>
            📨 Enviar Mensaje
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros" style={{ marginTop: "16px" }}>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos los mensajes</option>
          <option value="noLeidos">🔴 No leídos</option>
          <option value="leidos">✅ Leídos</option>
          <option value="mensaje">💬 Mensajes</option>
          <option value="solicitud-skill">📋 Solicitudes skill</option>
          <option value="solicitud-vacaciones">🌴 Vacaciones</option>
          <option value="reporte-problema">⚠️ Problemas</option>
        </select>
      </div>

      {/* Lista de conversaciones */}
      {conversacionesFiltradas.length === 0 ? (
        <div className="sin-tareas">
          <p>📭 No hay mensajes aquí</p>
        </div>
      ) : (
        <div className="mensajes-lista">
          {conversacionesFiltradas.map((conv) => {
            const tipoInfo = getTipoInfo(conv.tipo)
            const ultimo   = ultimoMensaje(conv)
            return (
              <div
                key={conv.id}
                className={`mensaje-item ${!conv.leido ? "mensaje-no-leido" : ""}`}
                onClick={() => handleVerConversacion(conv)}
              >
                <div className="mensaje-item-izq">
                  <span style={{ fontSize: "28px" }}>{tipoInfo.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p className="mensaje-item-asunto">
                      {!conv.leido && <span className="mensaje-punto-rojo">● </span>}
                      {conv.asunto}
                    </p>
                    <p className="mensaje-item-de">
                      {esAdmin ? `👤 ${conv.empleado}` : "📨 Al administrador"}
                    </p>
                    <p className="mensaje-ultimo-texto">
                      {ultimo.de === "Administrador" ? "👑" : "👤"} {ultimo.contenido.substring(0, 50)}
                      {ultimo.contenido.length > 50 ? "..." : ""}
                    </p>
                  </div>
                </div>

                <div className="mensaje-item-der">
                  <span className="badge-disponible" style={{ fontSize: "11px" }}>
                    💬 {conv.mensajes.length} mensaje{conv.mensajes.length > 1 ? "s" : ""}
                  </span>
                  <p className="mensaje-item-fecha">{ultimo.fecha}</p>
                  {esAdmin && (
                    <button
                      className="btn-eliminar"
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        eliminarConversacion(conv.id)
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Panel chat */}
      {convSeleccionada && (
        <PanelMensaje
          conversacion={conversaciones.find((c) => c.id === convSeleccionada.id)}
          usuarioActual={usuarioActual}
          onCerrar={() => setConvSeleccionada(null)}
        />
      )}

    </div>
  )
}

export default Mensajes