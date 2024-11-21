import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/index.css'
import '../styles/navbar.css'

export default function Navbar() {
  return (
    <div className="nav-body">
      <nav className="navbar-container">
        <ul className="nav-items">
          <li className="logo">
            <a href="#">SocialApp</a>
          </li>
          <li className="nav-item"><Link to='/'>Home</Link></li>
          <li className='nav-item'><Link to='/logout'>Logout</Link></li>
        </ul>
        <div className="search-box">
          <input className="search-input" type="text" placeholder="Search" />
          <a className="search-icon" href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000"
            >
              <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  );
}
