import React,{useEffect, useState} from 'react';
import axios from 'axios';
export default function Totalteams()
{
    const[teams,setteams]=useState([]);
    const[loading,setloading]=useState(false);
    const[error,seterror]=useState(null);

    useEffect(()=>
    {
        const load= async ()=>
        {
            try{
                setloading(true);
                const response = await axios.get('http://localhost:8000/api/Project/getallprojects');
                setteams(response.data.data || []);

            }catch(error)
            {
                seterror(error.response.data.msg || "Failed to load teams");
            }finally{
                setloading(false);
            }
        };
       load();
    },[]);
 
    return (
        <div>
            <h2> ALL teams </h2>
            {loading && <p>{loading}</p>}
            {error && <p style={{color :'red'}}>{error}</p>}

           {teams.length === 0 ? (
            <p>No teams found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="border rounded-xl shadow-md p-4 hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold">{team.title}</h3>
                  <p className="text-gray-600">{team.ownerId}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Members: {team.members?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          )}
       </div>
    );
}

