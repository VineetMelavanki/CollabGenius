import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
export default function Chatsection({reservedprompt,response}){
     
    return(
        <div className="flex flex-col gap-2">
            {reservedprompt && (
                <div className="flex justify-end bg-gray-200">
                      <h1>{reservedprompt}</h1>
                </div>
            )}
            {response && (
                <div className="flex justify-start bg-white">
                   <h1>{response}</h1>
                </div>
            )}
        </div>
    )
}