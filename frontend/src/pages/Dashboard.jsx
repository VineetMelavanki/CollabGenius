
import { useNavigate } from 'react-router-dom';
export default function Dashboard()
{
    const navigate= useNavigate();
    const handlelogout=()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    return(
        <div>
            <h1> DASHBOARD </h1>
        <button onClick={()=>navigate("/CreateTeam")}> Create Team </button>
        <button onClick={()=>navigate("/allteams")}> Total Teams </button>
        <button onClick={handlelogout}>Logout</button>
        </div>
    );
}