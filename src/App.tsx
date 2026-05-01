import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SorteoProvider } from './context/SorteoContext'
import { SetupPage } from './pages/SetupPage'
import { SorteoPage } from './pages/SorteoPage'
import { PrivacyPage } from './pages/PrivacyPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <SorteoProvider>
        <Routes>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/sorteo" element={<SorteoPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </Routes>
      </SorteoProvider>
    </BrowserRouter>
  )
}

export default App
