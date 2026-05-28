import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminDashboard from "./pages/AdminDashboard"
import CreateUser from "./pages/CreateUser"
import './App.css'
import PublicRouter from "./pages/public/PublicRouter"
import UsersRouter from "./pages/users/UsersRouter"
import ProtectedRoute from "./components/ProtectedRoute"
import VideoCall from './components/VideoCall'

const params = new URLSearchParams(window.location.search);
const roomId = params.get('room') || 'room-test';
const isCaller = params.has('caller');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-user" element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        } />
        <Route path="/*" element={<PublicRouter />} />
        <Route path="/users/*" element={<UsersRouter />} />
        <Route path="/call" element={
          <ProtectedRoute>
            <div>
              <p>Room : <strong>{roomId}</strong> — Rôle : <strong>{isCaller ? 'Appelant' : 'Appelé'}</strong></p>
              <VideoCall roomId={roomId} isCaller={isCaller} />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App