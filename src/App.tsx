import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { EmpleadosProvider } from './context/EmpleadosContext'
import { TareasProvider } from './context/TareasContext'
import { MetricasProvider } from './context/MetricasContext'
import { MensajesProvider } from './context/MensajesContext'
import { EmpresaProvider } from './context/EmpresaContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Empleados from './pages/Empleados'
import Tareas from './pages/Tareas'
import Perfil from './pages/Perfil'
import Metricas from './pages/Metricas'
import Mensajes from './pages/Mensajes'
import Empresa from './pages/Empresa'
import './App.css'

function RutaProtegida({ children, soloAdmin = false }: { children: ReactNode; soloAdmin?: boolean }) {
  const { usuarioActual } = useAuth()
  if (!usuarioActual) return <Navigate to="/" />
  if (soloAdmin && usuarioActual.rol !== 'admin') return <Navigate to="/perfil" />
  return children
}

function AppContenido() {
  const { usuarioActual } = useAuth()

  return (
    <>
      {usuarioActual && <Navbar />}
      <div className="contenido">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RutaProtegida soloAdmin={true}>
                <Dashboard />
              </RutaProtegida>
            }
          />
          <Route
            path="/empleados"
            element={
              <RutaProtegida soloAdmin={true}>
                <Empleados />
              </RutaProtegida>
            }
          />
          <Route
            path="/tareas"
            element={
              <RutaProtegida soloAdmin={true}>
                <Tareas />
              </RutaProtegida>
            }
          />
          <Route
            path="/metricas"
            element={
              <RutaProtegida soloAdmin={true}>
                <Metricas />
              </RutaProtegida>
            }
          />
          <Route
            path="/empresa"
            element={
              <RutaProtegida soloAdmin={true}>
                <Empresa />
              </RutaProtegida>
            }
          />
          <Route
            path="/mensajes"
            element={
              <RutaProtegida>
                <Mensajes />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmpresaProvider>
          <EmpleadosProvider>
            <TareasProvider>
              <MetricasProvider>
                <MensajesProvider>
                  <AppContenido />
                </MensajesProvider>
              </MetricasProvider>
            </TareasProvider>
          </EmpleadosProvider>
        </EmpresaProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
