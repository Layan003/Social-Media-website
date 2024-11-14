import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login'
import SignUp from './components/Signup'
import Home from './Home';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function LogoutAndSignUp() {
  localStorage.clear()
  return <SignUp />
}


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' exact element={<ProtectedRoute component={Home} />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<LogoutAndSignUp/>} />
        <Route path='/logout' element={<Logout/>} />
      

      </Routes>
    </Router>
     
    </>
  )
}

export default App
