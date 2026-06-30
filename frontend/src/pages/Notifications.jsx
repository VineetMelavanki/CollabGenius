import React from "react";
import {FiCheckSquare} from "react-icons/fi";
import { XSquare } from "lucide-react";
import TeamJoiningreq from "../Components/Notifications/Teamjoiningreq";
import Teaminvitation from "../Components/Notifications/Teaminvitation";
import Teamassignment from "../Components/Notifications/Assignment";
import FriendRequest from "../Components/Notifications/FriendRequest";
export default function Notificationsection({onClose}){
      return(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
            <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-y-auto">
                <div className="flex items-start justify-start flex-col gap-3 p-4 min-h-full border-2">
                    <div className="flex flex-row gap-2 p-2 w-full">
                       <h1 className="text-slate-600 font-dm text-lg">Notifications</h1>
                       <div className="flex flex-1 justify-end mx-2">
                        <button>
                            <h1 className="text-lg text-red-500 font-bold" onClick={()=>onClose()}>X</h1>
                        </button>
                       </div>
                    </div>
                    <div className="w-full h-px bg-gray-300" />
                  <TeamJoiningreq/>
                  <Teaminvitation/>
                  <Teamassignment/>
                  <FriendRequest/>
                </div>
            </div>
      </div>
      );
}