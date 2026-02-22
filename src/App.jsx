import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { useAnimeStore } from './hooks/useAnimeStore'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'

export default function App() {
  const { list, loading, error, addAnime, removeAnime, hasAnime } = useAnimeStore()

  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={
            <Home animeList={list} loading={loading} error={error} removeAnime={removeAnime} />
          } />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin addAnime={addAnime} hasAnime={hasAnime} animeCount={list.length} />
            </ProtectedRoute>
          } />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
