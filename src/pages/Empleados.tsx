import { useState } from 'react'
import { useEmpleados } from '../context/EmpleadosContext'
import FormularioEmpleado from '../components/FormularioEmpleado'
import TarjetaEmpleado from '../components/TarjetaEmpleado'

function Empleados() {
  const { empleados, agregarEmpleado, eliminarEmpleado, editarEmpleado } = useEmpleados()
  const [empleadoEditando, setEmpleadoEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  // Filtra empleados según búsqueda por nombre o área
  const empleadosFiltrados = empleados.filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.area.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="pagina">
      <h1>👥 Empleados</h1>
      <p className="contador">Total: {empleados.length} empleados</p>

      {/* Formulario agregar/editar */}
      <FormularioEmpleado onAgregar={agregarEmpleado} onEditar={editarEmpleado} empleadoEditando={empleadoEditando} />

      {/* Buscador */}
      <input className="buscador" placeholder="🔍 Buscar por nombre o área..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {/* Lista de empleados */}
      <div className="lista">
        {empleadosFiltrados.map((empleado) => (
          <TarjetaEmpleado key={empleado.id} empleado={empleado} onEliminar={eliminarEmpleado} onEditar={setEmpleadoEditando} />
        ))}
      </div>
    </div>
  )
}

export default Empleados
