import React,{useState} from "react";
import axios from 'axios';
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
     <div>
        {message && <p style ={{color : 'green'}}>{message}</p>}
        {error && <p style={{color :'red'}}>{error}</p>}
        <h2> Create Team </h2>
        <form onSubmit={handlesubmit}>
            <input 
            type="text"
            name="name"
            placeholder="Enter team name here"
            value={teamdata.name}
            onChange={handlechange}
            />
            <br/>
            <input
            type="text"
            name="owner"
            placeholder="Enter the name of owner"
            value={teamdata.owner}
            onChange={handlechange}
            />
            <br/>
            <button type="submit">Create a new Team </button>
        </form>
     </div>
    );
}
