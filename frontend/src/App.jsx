import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import { Footer, Header } from './component'


function App() {

  
  return (
    <>
      <div className=' min-h-screen bg-gray-400 flex flex-wrap content-between'>
      <div className=' w-full block'>
      <Header/>
      
      <main>
       <Outlet/>
      </main>
      <Footer/>
      </div>
    </div>
    </>
  )
}

export default App
