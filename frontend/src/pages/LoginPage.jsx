import React,{ useState } from "react";
import './forms.css';
import axios from 'axios';
export default function Login()
{
    const[formdata,setformdata]=useState({
        email : '',
        password: '',
    });
    const[message,setmessage]=useState(null);
    const[error,seterror]=useState(null);
    const handlechange=(e)=>{
        setformdata(prev=>({... prev,[e.target.name] : e.target.value}));
    };
    const submitchange= async (e)=>{
        e.preventDefault();
        setmessage(null);
        seterror(null);
        try {
            const response =await axios.post('http://localhost:8000/api/User/login',formdata);
            setmessage(response.data.msg || "Login Successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Login failed ");
            }
            else
            {
                seterror("Network error");
            }
        }
    }

return(
    <div className="fullscreen-background">
        <div className="form-container">
        {message && <p style={{ color: 'green' }}>{message}</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}

        <h2>Login page </h2>
        <form onSubmit={submitchange}>
            <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formdata.email}
            onChange={handlechange}/>
            <br/>
            <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formdata.password}
            onChange={handlechange}/>
            <br/>
            <button type="submit">Login</button>
        </form>
    </div>
    </div>
);
}