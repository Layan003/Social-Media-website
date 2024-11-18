import React from 'react'
import api from '../api'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../styles/index.css"
import "../styles/formStyle.css"

export default function Form({ method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (method === "Login"){
          const res = await api.post("token/", {username, password})
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          console.log("login successful");
          navigate('/');
        }
        else {
          const res = await api.post("signup/", {username, email, password})
          if (res.status === 201){
            console.log("Sign Up successful");
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            navigate('/profile/create'); 
          }
          else if (res.status === 400){
            console.log("something wrong with your sign up. Try again...");
            navigate('/signup'); 
          }
        }

      }
      catch (error) {
        console.error("Error caught:", error);
        if (error.response) {
          alert(
            `Error: ${error.response.status} - ${JSON.stringify(
              error.response.data
            )}`
          );
        } else if (error.request) {
          alert("No response received from the server.");
        } else {
          alert(`Error: ${error.message}`);
        }
      }
      finally {
        setLoading(false);
      }
    }

    if (loading) {
      return <div>Loading...</div>
    }

  return (
    <div className="body">
      <div className="form-body">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-intro">
            <h1 className="form-title">
              {method === "Login" ? "Welcome Back!" : "Create Your Account"}
            </h1>
            <p>Please enter details below</p>
          </div>
          <div className="inputs-container">
            <input
              type="text"
              className="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            {
              method === "Signup" ? (<input
              type="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email: "
              required
            />) : (<span></span>)
            }
            <input
              type="password"
              placeholder="Password: "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <h2>Forget password?</h2>
          <button type='submit' className="form-button">
            {method === "Login" ? "Login" : "Signup"}
          </button>
          {method === "Login" ? (
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
