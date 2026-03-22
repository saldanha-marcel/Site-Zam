import { useState } from 'react'
import bannerImage from './assets/image-zam.png'
import { LeadCaptureForm } from './components/LeadCaptureForm'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8" style={{ backgroundColor: '#9FE63E' }}>
      <div className="w-full max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl mb-4 text-black font-extrabold">
            PRÉ-LANÇAMENTO
          </h1>
          <p className="text-xl md:text-3xl text-black mb-8">
            Para dar o segundo passo e não parar mais!
          </p>
          
          {/* Banner Image */}
          <div className="mb-12 flex justify-center">
            <img 
              src={bannerImage} 
              alt="Destrava 21Z" 
              className="w-full max-w-2xl rounded-lg shadow-2xl"
            />
          </div>
        </div>
        
        {/* Lead Capture Form */}
        <LeadCaptureForm />
      </div>
    </div>
  )
}

export default App
