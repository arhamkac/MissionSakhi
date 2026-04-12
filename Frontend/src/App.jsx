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
import PostDetail from './Pages/PostDetail'
import ProtectedRoute from './Pages/ProtectedRoute'
import Directory from './Pages/Directory'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="flex-grow flex flex-col min-h-0 w-full"
  >
    {children}
  </motion.div>
)

import { usePanic } from './Pages/PanicContext'
import Decoy from './Pages/Decoy'

function App() {
  const location = useLocation()
  const { isPanic } = usePanic()

  if (isPanic) return <Decoy />

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/forum"          element={<PageWrapper><Anonymous_Forum /></PageWrapper>} />
            <Route path="/post/:id"       element={<PageWrapper><PostDetail /></PageWrapper>} />
            <Route path="/ai-chatbot"     element={<PageWrapper><Chatbot /></PageWrapper>} />
            <Route path="/chatbot"        element={<PageWrapper><Chatbot_AI /></PageWrapper>} />
            <Route path="/login"          element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup"         element={<PageWrapper><SignUp /></PageWrapper>} />
            <Route path="/mental-health"  element={<PageWrapper><MentalHealthSupport /></PageWrapper>} />
            <Route path="/otp-verify"     element={<PageWrapper><OTPVerification /></PageWrapper>} />
            <Route path="/community-chat" element={<PageWrapper><Community /></PageWrapper>} />
            <Route path="/dashboard"      element={<PageWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>} />
            <Route path="/settings"       element={<PageWrapper><Settings /></PageWrapper>} />
            <Route path="/directory"      element={<PageWrapper><Directory /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
