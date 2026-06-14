import { useState, useEffect } from 'react'

function FormularioEmpleado({ onAgregar, onEditar, empleadoEditando }) {
  const [nombre, setNombre] = useState('')
  const [cargo, setCargo] = useState('')
  const [area, setArea] = useState('')
  const [habilidades, setHabilidades] = useState('')
  const [estado, setEstado] = useState('disponible')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (empleadoEditando) {
      setNombre(empleadoEditando.nombre)
      setCargo(empleadoEditando.cargo)
      setArea(empleadoEditando.area)
      setHabilidades(empleadoEditando.habilidades.join(', '))
      setEstado(empleadoEditando.estado)
    } else {
      setNombre('')
      setCargo('')
      setArea('')
      setHabilidades('')
      setEstado('disponible')
    }
  }, [empleadoEditando])

  async function handleGuardar() {
    if (nombre === '' || cargo === '' || area === '') return

    const habilidadesArray = habilidades
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h !== '')

    const datos = { nombre, cargo, area, habilidades: habilidadesArray, estado }

    if (empleadoEditando) {
      onEditar({ id: empleadoEditando.id, ...datos })
    } else {
      try {
        setGuardando(true)
        const credenciales = await onAgregar(datos)
        if (credenciales) {
          alert(`✅ Empleado creado exitosamente\n\n📧 Email: ${credenciales.email}\n🔑 Contraseña: ${credenciales.password}\n\nComparte estas credenciales con el empleado.`)
        }
      } catch (error) {
        alert('❌ Error al crear el empleado. Intenta de nuevo.')
      } finally {
        setGuardando(false)
      }
    }

    setNombre('')
    setCargo('')
    setArea('')
    setHabilidades('')
    setEstado('disponible')
  }

  return (
    <div className="formulario-empleado">
      <h2>{empleadoEditando ? '✏️ Editar Empleado' : '➕ Agregar Empleado'}</h2>

      <div className="formulario-grid">
        <div className="campo">
          <label>Nombre completo</label>
          <input placeholder="Ej: Juan Perez" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>

        <div className="campo">
          <label>Cargo</label>
          <input placeholder="Ej: Vendedor Senior" value={cargo} onChange={(e) => setCargo(e.target.value)} />
        </div>

        <div className="campo">
          <label>Área</label>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Selecciona un área</option>
            <option value="Ventas">Ventas</option>
            <option value="Showroom">Showroom</option>
            <option value="Soporte">Soporte</option>
            <option value="Administración">Administración</option>
            <option value="Atención al Cliente">Atención al Cliente</option>
          </select>
        </div>

        <div className="campo">
          <label>Habilidades (separadas por comas)</label>
          <input placeholder="Ej: ventas, negociación, cotizaciones" value={habilidades} onChange={(e) => setHabilidades(e.target.value)} />
        </div>

        <div className="campo">
          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="disponible">✅ Disponible</option>
            <option value="ocupado">🔴 Ocupado</option>
            <option value="vacaciones">🌴 De Vacaciones</option>
          </select>
        </div>
      </div>

      <button className="btn-principal" onClick={handleGuardar} disabled={guardando}>
        {guardando ? '⏳ Creando empleado...' : empleadoEditando ? '💾 Guardar Cambios' : '➕ Agregar Empleado'}
      </button>
    </div>
  )
}

export default FormularioEmpleado
