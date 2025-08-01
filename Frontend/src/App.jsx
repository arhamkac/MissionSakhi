import { useState } from 'react'
import Home from './Pages/Home'
import './App.css'
import Header from './Pages/Header'
import Footer from './Pages/Footer'
import Anonymous_Forum from './Pages/Anonymous_Forum'
import {Routes,Route} from 'react-router-dom'
import Chatbot from './Pages/Chatbot'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import MentalHealthSupport from './Pages/MentalHealthSupport'
import ReportingGuidelines from './Pages/ReportingGuidelines'
import OTPVerification from './Pages/OTPVerification'
import Chatbot_AI from './Pages/Chatbot_AI'
import Community from './Pages/Community'

function App() {

  return (
    <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-[#7D37A5] scrollbar-track-[#E8DFF5]'>
      <Header />
      <Routes>
        <Route path="/forum" element={<Anonymous_Forum />} />
        <Route path="/" element={<Home />} />
        <Route path='/ai-chatbot' element={<Chatbot />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/mental-health' element={<MentalHealthSupport />} />
        <Route path='/report' element={<ReportingGuidelines />} />
        <Route path='/otp-verify' element={<OTPVerification />} />
        <Route path='/chatbot' element={<Chatbot_AI />} />
        <Route path='/community-chat' element={<Community />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
