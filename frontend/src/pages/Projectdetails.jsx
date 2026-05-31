import React from "react";
import axios from "axios";
import { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaUserPlus, FaPencilAlt, FaArrowLeft, FaUsers, FaEnvelope, FaCrown } from "react-icons/fa";
import{io} from "socket.io-client";
export default function Projectdetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [message, setmessage] = useState("");
  const [loading, setloading] = useState(true);
  const [owner, setowner] = useState(null);
  const[Messages,setMessages]=useState([]);
  const [ownerId, setownerId] = useState(null);
  const [project, setproject] = useState(null);
  const [user, setuser] = useState(null);
  const[usechat,setusechat]=useState(false);
  const[popwork,setpopwork]=useState(false);
  const[works,setworks]=useState([]);
  const[listmsg,setlistmsg]=useState("");
  const[listerror,setlisterror]=useState("");
  const[projectdeletemsg,setprojectdeletemsg]=useState("");
  const[projectdeleteerror,setprojectdeleteerror]=useState("");
  const[workerror,setworkerror]=useState("");
   const[isMember,setisMember]=useState(null);
   const[error3,seterror3]=useState("");
   const[msg3,setmsg3]=useState("");
  const[workmsg,setworkmsg]=useState("");
  const[workformdata,setworkformdata]=useState({
    name:"",
  });
  const[isRequested,setisRequested]=useState(false);
  const[assignform,setassignform]=useState(false);
  const[selectedReceiver,setselectedReceiver]=useState(null);
  const[taskformdata,settaskformdata]=useState({
    task:"",
  });
  const [members, setmembers] = useState([]);
  const[chatinput,setchatinput]=useState("");
  const [showaddmodel, setshowaddmodel] = useState(false);
  const [formdata, setformdata] = useState({ email: "" });
  const [edit, setedit] = useState(false);
  const socketRef=useRef(null);
  const fetchWorks = async () => {
  const response = await axios.get(
    `http://localhost:8000/api/Work/get-works/${projectId}`,
    {
      withCredentials: true
    }
  );
  setworks(response.data.Project);
};
    useEffect(()=>{
      const checkisMember=async()=>{
        try{
         const response=await axios.get(`http://localhost:8000/api/Project/is-Member/${projectId}`,
          {
            withCredentials:true,
          }
         );
         setisMember(response.data.isMember);
        }catch(error)
        {
          if(error.response)
          {
            seterror(error?.response?.data?.msg || "You are not a member of this project");
          }
          else
          {
            seterror("Internal server error");
          }
        }
      }
      checkisMember();
  },[projectId]);
  useEffect(()=>{
     const getallProjects=async()=>{
      try{
        const response=await axios.get(`http://localhost:8000/api/Work/get-works/${projectId}`,
          {
            withCredentials: true
          }
        );
       setworks(response.data.Project);
      setlistmsg(response.data.msg || "ALL Projects fetched successfully")
      }catch(error)
      {
          if(error.response)
          {
            setlisterror(error?.response?.data?.msg || "No project Created");
          }
          else
          {
            setlisterror("Internal server error");
          }
      }
     }
     getallProjects();
  },[projectId]);
  useEffect(()=>{
    const socket=io("http://localhost:8000",
      {
        withCredentials: true
      }
    );
    socketRef.current=socket;
    socket.on("connect",()=>{
      console.log("User connected : ",socket.id)
      socket.emit("join-room",{projectId})
    });
    
    socket.on("receive-message",(msg)=>{
       setMessages((prev)=>[...prev,msg]);
    });
    socket.on("chat-history",(msgs)=>{
      setMessages(msgs);
    });
    return()=>{
      socket.disconnect();
    }
  },[projectId]);
  const handlechangetask=(e)=>{
    settaskformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  const handleassigntask=(e)=>{
      e.preventDefault();
      if(!taskformdata.task.trim())
      {
        return;
      }
      socketRef.current.emit("assign-task",{task:taskformdata.task,receiver:selectedReceiver});
      settaskformdata({task:""});
  }
  const handleSetmessage=(e)=>{
    e.preventDefault();
    if(!chatinput.trim())
    {
      return;
    }
    socketRef.current.emit("send-message",{content:chatinput});
    setchatinput("");
  }
  const handleChangeinWork=(e)=>{
    setworkformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  const SubmitWork=async(e)=>{
    e.preventDefault();
    setworkerror("");
    setworkmsg("");
    try{
     const response=await axios.post(`http://localhost:8000/api/Work/create-work/${projectId}`,workformdata,
      {
        withCredentials: true
      }
     );
    setworkmsg(response.data.msg || "Project Created successfully");
    setworks((prev)=>[...prev,response.data.Project]);
    setworkformdata({name : ""});
    setworkmsg("");
    fetchWorks();
    setworkerror(""); 
    }catch(error)
    {
       if(error.response)
       {
         setworkerror(error.response?.data?.msg || "Cannot create Project");
       }
       else
       {
        setworkerror("Internal server error");
       }
    }
  }
  const removemember = async (memberId) => {
    seterror("");
    setmessage("");
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/Project/remove-member/${projectId}/${memberId}`,
        { withCredentials: true }
      );
      setmembers((prev) => prev.filter((m) => (m._id || m).toString() !== memberId.toString()));
      setmessage(response.data.msg || "Member removed successfully");
      setedit(false);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot remove member");
    }
  };

  const addmembers = async (e) => {
    e.preventDefault();
    seterror("");
    setmessage("");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/Project/Add-members/${projectId}`,
        formdata,
        { withCredentials: true }
      );
      setmessage(response?.data?.msg || "Added member successfully");
      if (response.data.success) {
        const refreshed = await axios.get(
          `http://localhost:8000/api/Project/get-project/${projectId}`,
          { withCredentials: true }
        );
        setmembers(refreshed.data.projectdata.members || []);
      }
      setformdata({ email: "" });
      setshowaddmodel(false);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot add member");
    }
  };

  const handlechange = (e) => {
    setformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deleteproject = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    seterror("");
    setmessage("");
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/Project/delete/${projectId}`,
        { withCredentials: true }
      );
      setmessage(response.data?.msg || "Project deleted successfully");
      setTimeout(() => navigate("/getallprojects"), 1500);
    } catch (err) {
      seterror(err.response?.data?.msg || "Cannot delete project");
    }
  };
 const deleteaproject=async(workId)=>{
    try{
     const response=await axios.delete(`http://localhost:8000/api/Work/delete-work/${projectId}/${workId}`,
      {
        withCredentials: true
      }
     );
     setprojectdeletemsg(response.data.msg || 'Project deleted successfully');
     if(response.data.success)
     {
     fetchWorks();
     }
    }catch(error)
    {
        if(error.response)
        {
          setprojectdeleteerror(error.response?.data?.msg || "Project cannot be deleted");
        }
        else{
          setprojectdeleteerror("Internal server error");
        }
    }
 }

  useEffect(() => {
    const displayproject = async () => {
      setloading(true);
      seterror("");
      setmessage("");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Project/get-project/${projectId}`,
          { withCredentials: true }
        );
        const response1 = await axios.get("http://localhost:8000/api/Profile/View-Profile", {
          withCredentials: true,
        });
        const ProfileData = response1.data.Profile;
        const currentUser = ProfileData.userId;
        setuser(currentUser);
        const projectData = response.data.projectdata;
        setproject(projectData);
        setmessage(response.data.msg || "Project fetched successfully");
        setmembers(projectData.members || []);
        const oid =
          typeof projectData.ownerId === "object"
            ? projectData.ownerId._id
            : projectData.ownerId;
        setownerId(oid);
        const ownerIdVal =
          typeof projectData.ownerId === "object"
            ? projectData.ownerId._id || projectData.ownerId
            : projectData.ownerId;
        setowner(
          ownerIdVal &&
            (ownerIdVal.toString() === currentUser?.toString() || ownerIdVal === currentUser)
        );
      } catch (err) {
        seterror(err.response?.data?.msg || "Cannot fetch project");
      } finally {
        setloading(false);
      }
    };
    displayproject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }
 const handlejoinrequest=async()=>{
  try{
      const response=await axios.post(`http://localhost:8000/api/Request/send-request/${projectId}`,{},
        {
          withCredentials:true,
        }
      );
      setmsg3(response.data?.msg || "Request sent successfully");
      setisRequested(true);
      alert(response.data?.msg || "Request sent successfully");
  }catch(error)
  {
        if(error.response)
        {
          alert(error.response?.data?.msg || "Cannot send notification");
          seterror3(error.response?.data?.msg || "Cannot send notification");
        }else
        {
          seterror3("Internal server error");
        }
  }
 }
  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
       

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {project && (
          <div className="space-y-6">
            {/* Project header card */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "archived"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status?.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaUsers className="w-4 h-4" />
                      {members.length} {members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>
                {!isMember && !isRequested && (
                  <button  className="text-white bg-green-500 rounded-2xl p-2 font-bold hover:bg-green-600" onClick={handlejoinrequest}>Request</button>
                )}
                {!isMember && isRequested && (
                  <button  className="text-white bg-red-500 rounded-2xl p-2 font-bold hover:bg-red-600">Requested</button>
                )}
                {owner && (
                  <div className="flex flex-row gap-3">
                    <button onClick={()=>setpopwork(!popwork)} className="flex items-end gap-2  px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition text-sm font-medium">
                 Create Project
                </button>
                    <button
                      onClick={deleteproject}
                      className="flex  items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete Team
                    </button>
                  </div>
                )}
              </div>

              {/* Project info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium w-24">Owner</span>
                  <span className="flex items-center gap-1 text-gray-900">
                    <FaCrown className="w-4 h-4 text-amber-500" />
                    {typeof project.ownerId === "object"
                      ? project.ownerId.name || project.ownerId.email || "Leader"
                      : "Leader"}
                  </span>
                </div>
                {project.description && (
                  <div>
                    <span className="text-gray-500 text-sm font-medium block mb-1">Description</span>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Team members section */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaUsers className="w-5 h-5 text-blue-600" />
                  Team Members
                </h2>
                <div className="flex items-center gap-2">
                {isMember &&  <button className="text-lg border-2 text-white bg-blue-500 font-bold hover:bg-blue-600 rounded-xl p-2 px-4 py-1" onClick={()=>setusechat(!usechat)}>
                    Team chat
                  </button> } 
                  {owner && (
                    <>
                      <button
                        onClick={() => setshowaddmodel(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                      >
                        <FaUserPlus className="w-4 h-4" />
                        Add Member
                      </button>
                      <button
                        onClick={() => setedit(!edit)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                          edit
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaPencilAlt className="w-4 h-4" />
                        {edit ? "Done" : "Manage"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {edit && owner && (
                <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm">
                  Edit mode: Click the trash icon to remove a member.
                </div>
              )}
              
              {members.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No members yet</p>
                  {owner && (
                    <button
                      onClick={() => setshowaddmodel(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Add your first member
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={member._id || member || index}
                      
                      className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl shadow-lg  hover:shadow-md transition border border-gray-100"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div onClick={() => navigate(`/view-profile/${member._id}`)} className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {(member.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div  className="min-w-0">
                          <p onClick={() => navigate(`/view-profile/${member._id}`)} className="font-semibold text-gray-900 truncate">
                            {member.name || "Unknown"}
                            {ownerId && (member._id || member).toString() === ownerId.toString() && (
                              <span className="ml-2 text-amber-600 text-xs font-normal">(Leader)</span>
                            )}
                          </p>
                          {member.email && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                              <FaEnvelope className="w-3 h-3 shrink-0" />
                              {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                      {isMember && user && member._id!==user._id && (
                      <button className="px-4 py-2 border border-red-300 text-white bg-red-500 hover:bg-red-600 rounded-lg transition text-sm font-medium"
                        onClick={()=>{setassignform(!assignform);setselectedReceiver(member._id)}}>
                           Assign task
                        </button>
                      )}  
                        
                        {owner && edit && ownerId && (member._id || member).toString() !== ownerId.toString() && (
                          <button
                            onClick={() => removemember(member._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Remove member"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
       <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mt-6">
        
         {isMember && works.length===0 ? (
          <h1 className="text-lg text-red-500 font-bold">No Project exists</h1>
         ):(
          <div className="grid grid-cols-1 gap-3">
            <h1 className="flex items-start justify-start font-bold text-black">Projects</h1>
            {!isMember && <h1 className="text-lg text-red-400">Only team members can access the projects</h1>}
          {isMember && works.map((work,index)=>(
            <div key={work._id} className="bg-gray-50 flex flex-row gap-3 p-4 rounded-2xl shadow-lg hover:shadow-md">
              <div className="flex flex-1 flex-row gap-2">
                 <h1 className="text-black my-3 text-md">{index+1}</h1>
                  <h1 className="text-blue-400 font-bold p-2 text-xl">{work.name}</h1>
              </div>
                <div className="flex flex-row gap-5">
                  <button onClick={()=>navigate(`/Research/${projectId}/${work._id}`)} className="text-white bg-green-400 hover:bg-green-500 font-bold p-2 rounded-xl">Research</button>
                  <button onClick={()=>deleteaproject(work._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                   <FaTrash className="w-4 h-4" />
                  </button>
                </div>
            </div>
         
          ))}
          </div>
         )}
       </div>
        {assignform && (
          <div className="fixed inset-0 bg-black/50 flex  items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4">Assign task</h2>
               <form onSubmit={handleassigntask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task
                  </label>
                  <input type="text"
                  name="task"
                  placeholder="Enter task"
                  value={taskformdata.task}
                  onChange={handlechangetask}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" required/>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                   Assign
                  </button>
                  <button type="button" onClick={()=>setassignform(!assignform)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                      Cancel
                  </button>
                </div>
               </form>
            </div>
          </div>
        )}
        {/*Project creation section */}
        {popwork && (
          <div className="fixed inset-0 bg-black/50 flex  items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              {workerror && <p className="text-lg font-bold text-red-500 mb-2">{workerror}</p>}
              {workmsg && <p className="text-lg font-bold text-green-500 mb-2">{workmsg}</p>}
               <h2 className="text-xl font-bold text-gray-900 mb-4">Create Project</h2>
               <form onSubmit={SubmitWork} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <input type="text"
                  name="name"
                  placeholder="Enter Project name"
                  value={workformdata.name}
                  onChange={handleChangeinWork}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" required/>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
                   Create
                  </button>
                  <button type="button" onClick={()=>setpopwork(!popwork)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                      Cancel
                  </button>
                </div>
               </form>
            </div>
          </div>
        )}
        {usechat && (
  <div className="fixed inset-0 z-50 flex justify-end">

    {/* dark overlay — clicking it closes chat */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setusechat(false)}
    />

    {/* chat panel — fixed to right side */}
    <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">

      {/* header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Team Chat</h2>
        <button
          onClick={() => setusechat(false)}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          x
        </button>
      </div>

      {/* messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-8">
            No messages yet. Start the conversation.
          </p>
        ) : (
          Messages.map((msg) => {
            const isMe=msg.userId?.toString()===user?._id?.toString();
            return(
               <div key={msg._id} className={`flex gap-3 ${isMe ? "flex-row-reverse ": " flex justify-start"}`}>
                {!isMe && (
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {msg.username?.[0]?.toUpperCase()}
              </div>
                )}
              <div className={`flex flex-col gap-1 p-3 rounded-2xl max-w-xs ${isMe ? "bg-blue-200":"bg-gray-200"}`}>
                
                  {!isMe && (
                     <div className="flex  gap-2 ">
                       <span className="text-xs font-medium text-gray-800">
                           {msg.username}
                       </span>
                       <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                     </div>
                  )}
                  
              {!isMe && (
               <p className="text-md font-medium text-gray-700">{msg.content}</p>
              )}  
                {isMe && (
                  <div className="flex items-end gap-3  bg-blue-200 p-1 rounded-3xl">
                  <p className="text-sm font-medium text-gray-700">
                   {msg.content}
                  </p>
                   <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                </div>
                )}
                 
              </div>
              
            </div>
            )

})
        )}
      </div>

      {/* input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSetmessage} className="flex gap-2">
          <input
            value={chatinput}
            onChange={(e) => setchatinput(e.target.value)}
            placeholder="Message your team..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  </div>
)}
        {/* Add member modal */}
        {showaddmodel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>
              <form onSubmit={addmembers} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter member's email"
                    value={formdata.email}
                    onChange={handlechange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setshowaddmodel(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
