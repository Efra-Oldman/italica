import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError]           = useState("")
  const [cargando, setCargando]     = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleLogin() {
    if (email === "" || password === "") {
      setError("Por favor completa todos los campos")
      return
    }

    setCargando(true)
    const resultado = await login(email, password)
    setCargando(false)

    if (resultado) {
      setError("")
      if (resultado.rol === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/perfil")
      }
    } else {
      setError("Email o contraseña incorrectos")
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="login-contenedor">
      <div className="login-caja">

        <div className="login-header">
          <div className="login-logo">🏢</div>
          <h1>ITALICA BOLIVIA</h1>
          <p>Sistema CRM Empresarial</p>
        </div>

        <div className="login-formulario">

          <div className="campo">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Ej: admin@italica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="campo">
            <label>Contraseña</label>
            <div className="input-password">
              <input
                type={verPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn-ver-password"
                onClick={() => setVerPassword(!verPassword)}
                type="button"
              >
                {verPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={cargando}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="usuarios-prueba">
            <p>👥 Usuarios de prueba:</p>
            <div className="prueba-lista">
              <div className="prueba-item" onClick={() => { setEmail("admin@italica.com"); setPassword("admin123") }}>
                <span>👑 Admin</span>
                <span className="prueba-credencial">admin@italica.com</span>
              </div>
              <div className="prueba-item" onClick={() => { setEmail("carlos@italica.com"); setPassword("carlos123") }}>
                <span>👤 Carlos</span>
                <span className="prueba-credencial">carlos@italica.com</span>
              </div>
              <div className="prueba-item" onClick={() => { setEmail("ana@italica.com"); setPassword("ana123") }}>
                <span>👤 Ana</span>
                <span className="prueba-credencial">ana@italica.com</span>
              </div>
              <div className="prueba-item" onClick={() => { setEmail("luis@italica.com"); setPassword("luis123") }}>
                <span>👤 Luis</span>
                <span className="prueba-credencial">luis@italica.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login