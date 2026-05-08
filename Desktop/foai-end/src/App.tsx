import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { IssTrackingPage } from './pages/IssTrackingPage'
import { NewsPage } from './pages/NewsPage'
import { AiAssistantPage } from './pages/AiAssistantPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/iss" replace />} />
        <Route path="/iss" element={<IssTrackingPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/ai" element={<AiAssistantPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
