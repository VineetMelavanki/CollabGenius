import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

export default function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="homepage-container">
      <h1>Welcome to Collab Genius</h1>
      <p>Collaborate. Build. Innovate.</p>
      <div className="button-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}
