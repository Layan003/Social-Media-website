import React from 'react'
import "./styles/home.css"
import "./styles/index.css"
import Posts from './components/Posts'
import Profile from './components/Profile'
import Mutuals from './components/Mutuals'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import { useUser } from './UserContext'
import api from './api'

export default function Home() {
    const { updateUser, user } = useUser();
    
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const res = await api.get("user/");
          if( res.status === 200) {
            const userData = {
              id: res.data.id,
              username: res.data.username,
            };
            updateUser(userData);
          } 
        } catch (error) {
          console.log(error);
        }
      }
      fetchUserData();
    }, [])


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
