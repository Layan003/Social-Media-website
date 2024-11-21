import React, { useState } from 'react'
import "./styles/home.css"
import "./styles/index.css"
import Posts from './components/Posts'
import Profile from './components/Profile'
import Mutuals from './components/Mutuals'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import { useUser } from './UserContext'
import api from './api'
import { useParams } from 'react-router-dom'

export default function Home() {
    const { user, fetchUserData } = useUser();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const {userId} = useParams();

    const fetchProfile = async (userId) => {
      try {
        const res = await api.get(`profile/${userId}/`);
        if (res.status === 200) {
          setProfile(res.data);
          // console.log(res.data)
          setProfileLoading(false);
        }
      }
      catch (error) {
        console.error(error);
      }
    }

    const fetchPosts = async () => {
      if (userId) {
        try {
          const res = await api.get(`user/${userId}/posts/`);
          if (res.status === 200) {
            if (res.data) {
              setPosts(res.data);
              setPostsLoading(false);
            }
          }
        } catch (error) {
          console.error(error);
        }
      } else if (user.id) {
        // fetch all posts
        try {
          const res = await api.get("posts/");
          if (res.status === 200) {
            if (res.data.length) {
              setPosts(res.data);
              setPostsLoading(false);
            } 
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
 
    useEffect(() => {
      fetchUserData();
    }, [])

    useEffect(() => {
      if (userId) {
        fetchProfile(userId);
        fetchPosts(userId);
      }
      else if (user.id) {
        fetchProfile(user.id);
        fetchPosts(user.id)
      }
    }, [user, userId, reload]);

    if (profileLoading || postsLoading ) {
      return <div>Loading...</div>
    }

  return (
    <div className="app-body">
      <div>
        {user.username}
        <br />
        {user.id}
      </div>
      
      <Navbar />
      <div className="app-container">
        
        {/* profile */}
        <Profile profile={profile}/> 

        {/* posts */}
        <Posts posts={posts} setReload={setReload}/>

        {/* mutuals */}
        <Mutuals/>
      </div>
    </div>
  )
}
