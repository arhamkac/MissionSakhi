import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Pages/AuthContext.jsx'
import { PanicProvider } from './Pages/PanicContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PanicProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PanicProvider>
    </BrowserRouter>
  </StrictMode>
)
