import React from 'react'
import api from '../api'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../styles/index.css"
import "../styles/formStyle.css"
import Loading from './Loading';
export default function Form({ method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); //for login 
    const [error, setError] = useState('');



    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (method === "Login") {
        try {
          const res = await api.post("token/", { username, password });
          localStorage.setItem("access", res.data.access);
          localStorage.setItem("refresh", res.data.refresh);
          // console.log("login successful");
          navigate("/");
        } catch (error) {
          setError('Invalid credentials. Please try again.');
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data.error);
            console.log(error.response.data)
          }
        } finally {
          setLoading(false);
        }
      } 
      else {
        try {
          const res = await api.post("signup/", { username, email, password });
          if (res.status === 201) {
            console.log("Sign Up successful");
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            navigate("/profile/update");
          }
        } catch (error) {
          if (error.response && error.response.data) {
            console.error("Error response:", error.response.data);
            setErrorMessages(error.response.data);
          }
        } finally {
          setLoading(false);
        }
      }
    };



    const allErrors = Object.values(errorMessages).flat();
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
            {method === "Signup" ? (
              <input
                type="email"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email: "
                required
              />
            ) : (
              <span></span>
            )}
            <input
              type="password"
              placeholder="Password: "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* display error messages for sign up */}
            {allErrors.length > 0 && (
              <div className="warning-message">
                {allErrors.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            )}


            {/* display error messages for login */}
            {/* {errorMessage && (
              <div className="warning-message">
                <p>{errorMessage}</p>
              </div>
            )} */}

            {error && (<div className='warning-message'>{error}</div>)}
          </div>

          <h2>Forget password?</h2>

          <button type="submit" className="form-button">
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
      {loading ? <Loading />: <span></span>}
    </div>
  );
}
