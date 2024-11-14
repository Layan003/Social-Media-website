import React from 'react'
import "./styles/home.css"
import "./styles/index.css"
import Posts from './components/Posts'
import Profile from './components/Profile'
import Mutuals from './components/Mutuals'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <div className="app-body">
      <Navbar />
      <div className="app-container">
        {/* profile */}
        <Profile/>

        {/* posts */}
        <Posts/>

        {/* mutuals */}
        <Mutuals/>
        
      </div>
    </div>
  )
}
