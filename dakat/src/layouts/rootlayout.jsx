import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../pages/shared/Navbar/navbar'
import Footer from '../pages/shared/Navbar/Footer/footer'

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
