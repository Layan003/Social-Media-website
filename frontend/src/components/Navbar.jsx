import React from 'react'
import { Link } from 'react-router-dom';
// import '../styles/index.css'
// import '../styles/navbar.css'
import { useState } from 'react';
import api from '../api';

export default function Navbar({setReload, setPosts}) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const res = await api.get(`search?query=${encodeURIComponent(query)}`)
      // console.log(query)
      // console.log(res.data);
      if (res.status == 200){
        setPosts(res.data);
        setReload(true);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="nav-body bg-white shadow-md p-2 px-4 md:px-10 md:py-3">
      <nav className=" flex justify-between items-center">
          <div className='flex gap-3 items-center '>
          <Link to='/' style={{textDecoration: 'none'}} className='text-black '>Home</Link>
          <Link to='/logout' style={{textDecoration: 'none'}} className='text-black '>Logout</Link>
          </div>

        <div className="search-box flex shadow-md p-2 gap-3 rounded-lg">
          <input className="search-input w-[90%] outline-none" type="text" placeholder="Search" style={{border: 'none'}} value={query} onChange={(e) => setQuery(e.target.value)} />
          {/* <a className="search-icon" onClick={handleSearch} > */}
            <svg
            onClick={handleSearch}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000"
            >
              <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
            </svg>
          {/* </a> */}
        </div>
      </nav>
    </div>
  );
}
