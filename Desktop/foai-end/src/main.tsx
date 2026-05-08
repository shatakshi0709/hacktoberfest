import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { ThemeSync } from './components/ThemeSync.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeSync />
        <App />
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgb(var(--panel))',
            color: 'rgb(var(--text))',
            border: '1px solid rgb(var(--border))',
          },
        }}
      />
    </ErrorBoundary>
  </StrictMode>,
)
