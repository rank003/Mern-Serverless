import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Booking from './components/Booking'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Booking />
      <Footer />
    </div>
  )
}

export default App
