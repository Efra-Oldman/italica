import { useState } from 'react'

function TarjetaEmpleado({ empleado, onEliminar, onEditar }) {
  const [verCredenciales, setVerCredenciales] = useState(false)

  function getBadge(estado) {
    if (estado === "disponible") return <span className="badge-disponible">✅ Disponible</span>
    if (estado === "ocupado")    return <span className="badge-ocupado">🔴 Ocupado</span>
    if (estado === "vacaciones") return <span className="badge-vacaciones">🌴 Vacaciones</span>
  }

  return (
    <div className="tarjeta">
      <div className="tarjeta-header">
        <h3>👤 {empleado.nombre}</h3>
        {getBadge(empleado.estado)}
      </div>

      <p>💼 <strong>Cargo:</strong> {empleado.cargo}</p>
      <p>🏢 <strong>Área:</strong> {empleado.area}</p>

      <div className="habilidades">
        {empleado.habilidades?.map((h, index) => (
          <span key={index} className="habilidad-tag">{h}</span>
        ))}
      </div>

      {/* Credenciales de acceso */}
      <div className="credenciales-contenedor">
        <button
          className="btn-credenciales"
          onClick={() => setVerCredenciales(!verCredenciales)}
        >
          {verCredenciales ? "🔒 Ocultar acceso" : "🔑 Ver credenciales"}
        </button>

        {verCredenciales && (
          <div className="credenciales-box">
            <p>📧 <strong>Email:</strong> {empleado.email || "No asignado"}</p>
            <p>🔑 <strong>Contraseña:</strong> italica123</p>
            <p style={{ fontSize: "11px", color: "#999", marginTop: "6px" }}>
              💡 El empleado puede cambiar su contraseña después
            </p>
          </div>
        )}
      </div>

      <div className="tarjeta-botones">
        <button className="btn-secundario" onClick={() => onEditar(empleado)}>
          ✏️ Editar
        </button>
        <button className="btn-eliminar" onClick={() => onEliminar(empleado.id)}>
          ❌ Eliminar
        </button>
      </div>
    </div>
  )
}

export default TarjetaEmpleado