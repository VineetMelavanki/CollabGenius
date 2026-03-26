import { useNavigate } from "react-router-dom";
function Navbar({children}) {

  const navigate = useNavigate();

  return (
    <div className="flex-h-screen bg-gray-200 flex-col gap-3">
      <nav className="flex justify-between items-center px-8 py-4  bg-white shadow" dark >

      <h1 className="text-2xl font-bold text-blue-600">
        Collab-Genius
      </h1>

      <div className="flex flex-row gap-5">
        <button
                onClick={() => navigate("/About")}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                About
              </button>
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Sign-in
        </button>
        <button
          onClick={() => navigate("/register")}
          className="text-blue-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Sign-up
        </button>
        
      </div>
    </nav>
    <div className="w-full flex-1">
       {children}
    </div>
      </div>
    
  );
}
export default Navbar;
