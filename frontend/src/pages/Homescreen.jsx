import { useAuth } from "../AuthContext"
export default function Homescreen(){
   const {user}=useAuth();
    return(
        <div className="min-h-screen w-full">
          <div className="flex flex-col gap-2 w-full border p-2">
             <div className="flex sm:flex-col lg:flex-row gap-2 border  p-2">
               <div className="flex flex-col border sm:w-full lg:w-1/2">
                 <h1 className="text-3xl font-bold">WELCOME BACK, <span className="text-purple-500">{user?.name}</span> !</h1>
                 <h1 className="text-gray-500 text-md mt-1">Let's build something amazing today</h1>
                 <div className="flex flex-col p-4 rounded-2xl mt-8 mx-4 border bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50">
                   <h1 className="text-black font-bold mb-2">What do you want to build today?</h1>
                   <form className="max-w-lg">
                    <div className="flex items-center gap-3">
                      <input type="text"
                      placeholder="Describe your ideas , project or what you need"
                        className="flex-1 w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"/>

                          <button type="submit"
                            className="h-12 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                          >
                           ✨ Ask AI
                          </button>
                    </div>
                   </form>
                 </div>
               </div>
                <div className="flex flex-1 mx-2 border">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-row p-2 gap-2">
                        <h1 className="text-black font-grotesk mx-2">Collab AI assistance</h1>
                        <div className="flex flex-1 justify-end">
                            <h1 className="text-purple-500 mx-2 font-bold">View All</h1>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              
          </div>
        </div>
    )
}