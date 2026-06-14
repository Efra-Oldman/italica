import { useState, useEffect } from 'react'
import { useEmpresa } from '../context/EmpresaContext'

function Empresa() {
  const { perfil, cargando, actualizarPerfil } = useEmpresa()

  const [form, setForm] = useState(perfil)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    setForm(perfil)
  }, [perfil])

  function handleChange(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  async function handleGuardar() {
    setGuardando(true)
    await actualizarPerfil(form)
    setGuardando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  if (cargando)
    return (
      <div className="pagina">
        <p>Cargando...</p>
      </div>
    )

  return (
    <div className="pagina">
      <h1>🏢 Perfil de ITALICA BOLIVIA</h1>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Esta información es usada por la IA para hacer recomendaciones más precisas y relevantes para tu empresa.</p>

      {/* Información básica */}
      <div className="formulario-empleado">
        <h2>📋 Información General</h2>
        <div className="formulario-grid">
          <div className="campo">
            <label>Nombre de la empresa</label>
            <input value={form.nombre || ''} onChange={(e) => handleChange('nombre', e.target.value)} />
          </div>

          <div className="campo">
            <label>Razón social</label>
            <input value={form.razonSocial || ''} onChange={(e) => handleChange('razonSocial', e.target.value)} />
          </div>

          <div className="campo">
            <label>Sucursales</label>
            <input value={form.sucursales || ''} onChange={(e) => handleChange('sucursales', e.target.value)} />
          </div>

          <div className="campo">
            <label>Áreas de la empresa</label>
            <input value={form.areas || ''} onChange={(e) => handleChange('areas', e.target.value)} />
          </div>
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Descripción general</label>
          <textarea className="textarea-descripcion" rows={3} value={form.descripcion || ''} onChange={(e) => handleChange('descripcion', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Misión</label>
          <textarea className="textarea-descripcion" rows={2} value={form.mision || ''} onChange={(e) => handleChange('mision', e.target.value)} />
        </div>
      </div>

      {/* Productos y clientes */}
      <div className="formulario-empleado">
        <h2>🛍️ Productos y Clientes</h2>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Productos que vende</label>
          <textarea className="textarea-descripcion" rows={3} value={form.productos || ''} onChange={(e) => handleChange('productos', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Marcas que maneja</label>
          <textarea className="textarea-descripcion" rows={2} value={form.marcas || ''} onChange={(e) => handleChange('marcas', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Clientes típicos</label>
          <textarea className="textarea-descripcion" rows={3} value={form.clientesTipicos || ''} onChange={(e) => handleChange('clientesTipicos', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Proceso de venta</label>
          <textarea className="textarea-descripcion" rows={3} value={form.procesoVenta || ''} onChange={(e) => handleChange('procesoVenta', e.target.value)} />
        </div>
      </div>

      {/* Empleados y KPIs */}
      <div className="formulario-empleado">
        <h2>👥 Empleados y Rendimiento</h2>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Valores y expectativas del empleado ideal</label>
          <textarea className="textarea-descripcion" rows={3} value={form.valoresEmpleado || ''} onChange={(e) => handleChange('valoresEmpleado', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>Modelo de negocio</label>
          <textarea className="textarea-descripcion" rows={2} value={form.modeloNegocio || ''} onChange={(e) => handleChange('modeloNegocio', e.target.value)} />
        </div>

        <div className="campo" style={{ marginBottom: '16px' }}>
          <label>KPIs importantes</label>
          <textarea className="textarea-descripcion" rows={2} value={form.kpis || ''} onChange={(e) => handleChange('kpis', e.target.value)} />
        </div>
      </div>

      {/* Preview del contexto IA */}
      <div className="formulario-empleado">
        <h2>🤖 Vista previa — Lo que ve la IA</h2>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Así es exactamente como la IA leerá la información de tu empresa en cada consulta.</p>
        <div
          style={{
            background: '#f3f4ff',
            border: '1px solid #c5cae9',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '12px',
            color: '#333',
            lineHeight: '1.8',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {`PERFIL DE LA EMPRESA:
─────────────────────
Nombre: ${form.nombre} (${form.razonSocial})
Descripción: ${form.descripcion}
Sucursales: ${form.sucursales}
Modelo de negocio: ${form.modeloNegocio}

PRODUCTOS Y MARCAS:
${form.productos}
Marcas: ${form.marcas}

PROCESO DE VENTA:
${form.procesoVenta}

ÁREAS DE LA EMPRESA:
${form.areas}

CLIENTES TÍPICOS:
${form.clientesTipicos}

VALORES Y EXPECTATIVAS DEL EMPLEADO:
${form.valoresEmpleado}

KPIs IMPORTANTES:
${form.kpis}

MISIÓN:
${form.mision}`}
        </div>
      </div>

      {/* Botón guardar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="btn-principal" onClick={handleGuardar} disabled={guardando} style={{ padding: '14px 32px', fontSize: '15px' }}>
          {guardando ? '⏳ Guardando...' : '💾 Guardar Perfil'}
        </button>
        {guardado && (
          <span
            style={{
              color: '#2e7d32',
              fontWeight: '600',
              fontSize: '14px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            ✅ Perfil guardado correctamente
          </span>
        )}
      </div>
    </div>
  )
}

export default Empresa
