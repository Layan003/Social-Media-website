import React, { useState } from 'react'
// import "./styles/home.css"
// import "./styles/index.css"
import Posts from './components/Posts'
import Profile from './components/Profile'
import Mutuals from './components/Mutuals'
import Navbar from './components/Navbar'
import { useEffect } from 'react'
import { useUser } from './UserContext'
import api from './api'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import Loading from './components/Loading'


export default function Home() {
    const { user, fetchUserData } = useUser();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profileLoading, setProfileLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const {userId} = useParams();
    const [followings, setFollowings] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [isFollowed, setIsFollowed] = useState(null);
    // const [getViralPosts, setGetViralPosts] = useState(false);
    const location = useLocation();

    
    

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

    const fetchFollowCount = async (userID) => {
      try {
        const res = await api.get(`get-follow/${userID}/`);
        // console.log(res.data);
        setFollowings(res.data.followings)
        setFollowers(res.data.followers)
  
      } catch (error) {
        console.error(error);
      }
    };

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
    const fetchFollowed = async () => {
      try {
        if (userId) {
          const res = await api.get(`follow/${userId}/`);
          if (res.data.message === "followed") {
            setIsFollowed(true);
          } else if (res.data.message === "not followed") {
            setIsFollowed(false);
          }
          setReload((reload) => !reload);
        } else if (user.id) {
          const res = await api.get(`follow/${user.id}/`);
          if (res.data.message === "followed") {
            setIsFollowed(true);
          } else if (res.data.message === "not followed") {
            setIsFollowed(false);
          }
          setReload((reload) => !reload);
        }
        // console.log(res.status);
        
      } catch (error) {
        console.error(error);
      }
    };
 
    useEffect(() => {
      fetchUserData();

    }, [])
  


  const fetchViralPosts = async () => {
    try {
      const res = await api.get('posts/viral/')
      if (res.status === 200) {
        if (res.data) {
          setPosts(res.data);
          setPostsLoading(false);
          console.log(res.data)
        }
      }
      
    } catch (error) {
      console.error(error)
    }
  }

    useEffect(() => {
      // if (location.pathname == 'viral-posts') {
      //   fetchViralPosts();
      //   return
      // }
      if (userId) {
        fetchProfile(userId);
        fetchPosts(userId);
        fetchFollowCount(userId);
        fetchFollowed();
      }
      else if (user.id) {
        fetchProfile(user.id);
        fetchPosts(user.id)
        fetchFollowCount(user.id);
        fetchFollowed();
      }

    }, [user, userId]);

    if (profileLoading || postsLoading ) {
      return <Loading/>
    }

  

  return (
    <div className="">      
      <Navbar setReload={setReload} setPosts={setPosts} />
      <div className="grid-cols-1 md:grid md:grid-cols-3 p-3 gap-2 bg-gray-100 min-h-[100vh]">
        
        {/* profile */}
        <Profile profile={profile} followers={followers} followings={followings} fetchFollowCount={fetchFollowCount} fetchFollowed={fetchFollowed} setIsFollowed={setIsFollowed} isFollowed={isFollowed}/> 

        {/* posts */}
        <Posts posts={posts} setReload={setReload} fetchPosts={fetchPosts}/>

        {/* mutuals */}
        {/* <Mutuals/> */}
      </div>
    </div>
  )
}
