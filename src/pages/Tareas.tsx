import { useState } from 'react'
import { useTareas } from '../context/TareasContext'
import FormularioTarea from '../components/FormularioTarea'
import TarjetaTarea from '../components/TarjetaTarea'
import PanelEvaluacion from '../components/PanelEvaluacion'
import AsignadorIA from '../components/AsignadorIA'

function Tareas() {
  const { tareas, agregarTarea, eliminarTarea, editarTarea, cambiarEstado, asignarEmpleado } = useTareas()
  const [tareaEditando, setTareaEditando] = useState(null)
  const [tareaEvaluando, setTareaEvaluando] = useState(null)
  const [tareaAsignando, setTareaAsignando] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const tareasFiltradas = tareas.filter((t) => {
    const coincideBusqueda = t.titulo.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || t.estado === filtroEstado
    const coincidePrioridad = filtroPrioridad === 'todos' || t.prioridad === filtroPrioridad
    return coincideBusqueda && coincideEstado && coincidePrioridad
  })

  const pendientes = tareas.filter((t) => t.estado === 'pendiente').length
  const enProgreso = tareas.filter((t) => t.estado === 'en progreso').length
  const completadas = tareas.filter((t) => t.estado === 'completada').length

  function handleGuardarEvaluacion(evaluacion) {
    const tarea = tareas.find((t) => t.id === tareaEvaluando.id)
    editarTarea({ ...tarea, evaluacion })
    setTareaEvaluando(null)
  }

  function handleAsignarIA(idTarea, nombreEmpleado) {
    asignarEmpleado(idTarea, nombreEmpleado)
    setTareaAsignando(null)
  }

  return (
    <div className="pagina">
      <h1>📋 Tareas</h1>

      <div className="resumen-tareas">
        <div className="resumen-item">
          <span className="resumen-numero">{pendientes}</span>
          <span className="resumen-label">⏳ Pendientes</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{enProgreso}</span>
          <span className="resumen-label">🔄 En Progreso</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{completadas}</span>
          <span className="resumen-label">✅ Completadas</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{tareas.length}</span>
          <span className="resumen-label">📋 Total</span>
        </div>
      </div>

      <FormularioTarea onAgregar={agregarTarea} onEditar={editarTarea} tareaEditando={tareaEditando} />

      <div className="filtros">
        <input className="buscador" placeholder="🔍 Buscar tarea..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ flex: 2, margin: 0 }} />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">⏳ Pendiente</option>
          <option value="en progreso">🔄 En Progreso</option>
          <option value="completada">✅ Completada</option>
          <option value="cancelada">❌ Cancelada</option>
        </select>
        <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
          <option value="todos">Todas las prioridades</option>
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>
      </div>

      <div className="lista">
        {tareasFiltradas.map((tarea) => (
          <TarjetaTarea key={tarea.id} tarea={tarea} onEliminar={eliminarTarea} onEditar={setTareaEditando} onCambiarEstado={cambiarEstado} onEvaluar={setTareaEvaluando} onAsignarIA={setTareaAsignando} />
        ))}
      </div>

      {tareasFiltradas.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>No se encontraron tareas con ese filtro.</p>}

      {tareaEvaluando && <PanelEvaluacion tarea={tareaEvaluando} onGuardar={handleGuardarEvaluacion} onCerrar={() => setTareaEvaluando(null)} />}

      {tareaAsignando && <AsignadorIA tarea={tareaAsignando} onCerrar={() => setTareaAsignando(null)} onAsignar={handleAsignarIA} />}
    </div>
  )
}

export default Tareas
