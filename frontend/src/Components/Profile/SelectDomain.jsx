import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
export default function SelectDomain({onClose,selecteddomain,setselecteddomain}){
    const[domains,setdomains]=useState([]);
    useEffect(()=>{
        const fetchdomains=async()=>{
            try{
              const response=await axios.get("http://localhost:8000/api/Profile/get-domains",{
                withCredentials:true,
              });
              setdomains(response.data.domains);
          
            }catch(error)
            {
                if(error.response)
                {
                    alert(error.response?.data?.msg || "Cannot fetch domains");
                }
                else
                {
                    alert("Internal server error");
                }
            }
        }
        fetchdomains();
    },[]);
    const handlesdomainselect=(domain)=>{
        let updateddomains;
        if(selecteddomain.includes(domain))
        {
            updateddomains=selecteddomain.filter((s)=>s!==domain);
        }
        else
        {
            updateddomains=[...selecteddomain,domain];
        }
        setselecteddomain(updateddomains);
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center ">
            <div className="absolute inset-0 bg-black/40 " onClick={()=>onClose()}/>
            <div className=" relative  p-4 z-50 bg-white flex rounded-xl max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                   <h1 className="text-black text-lg font-sans">Select your Domains</h1>
                   <div className="flex flex-1 justify-end">
                    <button onClick={()=>onClose()} className="text-red-500 font-bold text-lg">x</button>
                   </div>
                </div>
                  {domains.length> 0 &&
                  <div className="flex flex-wrap gap-2">
                    {domains.map((domain)=>(
                      <div key={domain}
                      onClick={()=>handlesdomainselect(domain)}
                      className={`rounded-full bg-black px-4 py-2 text-sm font-medium
                      ${selecteddomain.includes(domain) ?
                        "bg-green-200 text-green-700"
                        :"bg-purple-200 text-purple-700"
                      }`}>
                        {domain}
                      </div>
                    ))}
                    </div>}
              </div>
            </div>
        </div>
    )
} 