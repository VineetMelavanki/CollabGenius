import React,{useState} from "react";
import axios from 'axios';
import "./Auth.css";
export default function CreateTeam()
{
    const[teamdata,setteamdata]=useState({
        name :'',
        owner :'',
        members :'',
        roles :'' 
    });
    const[message,setmessage]=useState(null);
    const[error,seterror]=useState(null);
    const handlechange =(e)=>{
        setteamdata(prev=>({...prev,[e.target.name] : e.target.value}));
    }
    const handlesubmit= async (e)=>{
        e.preventDefault();
        setmessage(null);
        seterror(null);
        
        try {
            const response= await axios.post("http://localhost:8000/api/dashboard/CreateTeam",teamdata);
            setmessage(response.data.msg || "Team created successfully");
        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Team creation failed");
            }
            else
            {
                seterror("Network error");
            }
        }
    }
    return (
    <main className="auth-container">
        <section className="auth-box">
            <header>
                <h1>Create Team</h1>
            </header>
            <form onSubmit={handlesubmit}>
                {error && <p style={{color:"red"}}>{error}</p>}
                {message && <p style={{color:"green"}}>{message}</p>}
                <input type="text" name="name" value={teamdata.name} placeholder="Enter team name" onChange={handlechange}/>
                <input type="text" name="owner" value={teamdata.owner} placeholder="Enter the name of the owner" onChange={handlechange}/>
                <button type="submit">Create Team</button>
            </form>
            
        </section>
    </main>
    );
}
