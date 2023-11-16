import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './pages/Hero'
import Test from './components/Test'

function App() {

  return (
    <>
      <Navbar />
      <Hero />
    </>
  )
}

export default App
