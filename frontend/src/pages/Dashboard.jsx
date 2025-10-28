import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
export default function Dashboard()
{
    const navigate= useNavigate();
    return(
        <div>
            <h1> DASHBOARD </h1>
        <button onClick={()=>navigate("/CreateTeam")}> Create Team </button>
        <button onClick={()=>navigate("/allteams")}> Total Teams </button>
        </div>
    );
}