import './App.css'
import Header from './Pages/Header'
import Footer from './Pages/Footer'
import Home from './Pages/Home'
import Anonymous_Forum from './Pages/Anonymous_Forum'
import Chatbot from './Pages/Chatbot'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import MentalHealthSupport from './Pages/MentalHealthSupport'
import OTPVerification from './Pages/OTPVerification'
import Chatbot_AI from './Pages/Chatbot_AI'
import Community from './Pages/Community'
import Dashboard from './Pages/Dashboard'
import Settings from './Pages/Settings'
import ProtectedRoute from './Pages/ProtectedRoute'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/forum"          element={<Anonymous_Forum />} />
          <Route path="/ai-chatbot"     element={<Chatbot />} />
          <Route path="/chatbot"        element={<Chatbot_AI />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<SignUp />} />
          <Route path="/mental-health"  element={<MentalHealthSupport />} />
          <Route path="/otp-verify"     element={<OTPVerification />} />
          <Route path="/community-chat" element={<Community />} />
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings"       element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
