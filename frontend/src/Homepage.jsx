import React from 'react';
import {useNavigate} from 'react-router-dom';
export default function Homepage()
{
    const navigate=useNavigate();
    return(
        <div>
            <h1>Welcome to collab Genius</h1>
            <button onClick={()=>navigate("/login")}>login</button>
            <button onClick={()=>navigate("/register")}>Register</button>
        </div>
    )
};