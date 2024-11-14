import React from 'react'
import api from '../api'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../styles/index.css"
import "../styles/formStyle.css"


export default function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (method == "Login"){
          const res = await api.post("users/token/", {username, password})
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          console.log("login successful");
          navigate('/');
        }
        else {
          const res = await api.post("users/signup/", {username, email, password})
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          console.log("Sign Up successful");
          navigate('/');
        }
      }
      catch (error) {
        console.error("Error caught:", error);
        if (error.response) {
        // Server responded with a status other than 2xx
          alert(
            `Error: ${error.response.status} - ${JSON.stringify(
              error.response.data
            )}`
          );
        } else if (error.request) {
          // Request was made but no response received
          alert("No response received from the server.");
        } else {
          // Something else happened while setting up the request
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
              type="text"
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
          <button className="form-button">
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
