import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMensajes } from '../context/MensajesContext'

function Navbar() {
  const { usuarioActual, logout } = useAuth()
  const { conversacionesNoLeidas } = useMensajes()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <span className="navbar-logo">ITALICA BOLIVIA</span>
      <div className="navbar-links">
        {usuarioActual?.rol === "admin" && (
          <>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/empleados">👥 Empleados</Link>
            <Link to="/tareas">📋 Tareas</Link>
            <Link to="/metricas">📈 Métricas</Link>
            <Link to="/empresa">🏢 Empresa</Link>
          </>
        )}
        <Link to="/mensajes" className="navbar-mensajes">
          📨 Mensajes
          {conversacionesNoLeidas > 0 && (
            <span className="navbar-badge">{conversacionesNoLeidas}</span>
          )}
        </Link>
        <Link to="/perfil">👤 {usuarioActual?.nombre}</Link>
        <button className="btn-logout" onClick={handleLogout}>
          🚪 Salir
        </button>
      </div>
    </nav>
  )
}

export default Navbar