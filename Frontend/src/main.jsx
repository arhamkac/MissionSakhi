import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId='377143313020-6aiq6ldas908pvuntvb5rit52t4muec8.apps.googleusercontent.com'>
    <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
