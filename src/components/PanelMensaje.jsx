import { useState, useEffect, useRef } from 'react'
import { useMensajes } from '../context/MensajesContext'

function PanelMensaje({ conversacion, usuarioActual, onCerrar }) {
  const { enviarMensaje } = useMensajes()
  const [texto, setTexto] = useState("")
  const chatRef = useRef(null)

  // Scroll automático al último mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [conversacion.mensajes])

  function getTipoInfo(tipo) {
    if (tipo === "mensaje")              return { emoji: "💬", label: "Mensaje General" }
    if (tipo === "solicitud-skill")      return { emoji: "📋", label: "Solicitud de Skill" }
    if (tipo === "solicitud-vacaciones") return { emoji: "🌴", label: "Solicitud Vacaciones" }
    if (tipo === "reporte-problema")     return { emoji: "⚠️", label: "Reporte Problema" }
    return { emoji: "💬", label: "Mensaje" }
  }

  const tipoInfo = getTipoInfo(conversacion.tipo)

  function handleEnviar() {
    if (texto.trim() === "") return
    enviarMensaje(conversacion.id, usuarioActual.nombre, texto)
    setTexto("")
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <div className="panel-overlay">
      <div className="panel-chat">

        {/* Encabezado */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              {conversacion.empleado.charAt(0)}
            </div>
            <div>
              <h3>{conversacion.empleado}</h3>
              <p>{tipoInfo.emoji} {tipoInfo.label} — {conversacion.asunto}</p>
            </div>
          </div>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        {/* Historial de mensajes */}
        <div className="chat-mensajes" ref={chatRef}>
          {conversacion.mensajes.map((msg) => {
            const esMio = msg.de === usuarioActual.nombre
            const esAdmin = msg.de === "Administrador"
            return (
              <div
                key={msg.id}
                className={`chat-burbuja-contenedor ${esMio ? "mio" : "suyo"}`}
              >
                <div className={`chat-burbuja ${esMio ? "burbuja-mia" : "burbuja-suya"}`}>
                  <p className="chat-nombre">
                    {esAdmin ? "👑 Administrador" : `👤 ${msg.de}`}
                  </p>
                  <p className="chat-texto">{msg.contenido}</p>
                  <p className="chat-hora">
  {msg.fecha} {msg.hora}
  {msg.de === usuarioActual.nombre && (
    <span style={{
      color: esMio ? "rgba(255,255,255,0.8)" : "#1565c0",
      fontSize: "12px"
    }}>
      {/* Un check = enviado, dos checks = leído */}
      {conversacion.leido ? " ✓✓" : " ✓"}
    </span>
  )}
</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input para escribir */}
        <div className="chat-input-contenedor">
          <textarea
            className="chat-input"
            placeholder="Escribe un mensaje... (Enter para enviar)"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className="chat-btn-enviar"
            onClick={handleEnviar}
            disabled={texto.trim() === ""}
          >
            📨
          </button>
        </div>

      </div>
    </div>
  )
}

export default PanelMensaje