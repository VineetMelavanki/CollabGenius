import { useNavigate } from "react-router-dom";
function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-8 py-4  bg-white shadow" dark >

      <h1 className="text-2xl font-bold text-blue-600">
        Collab-Genius
      </h1>

      <div className="space-x-4">
        <button
                onClick={() => navigate("/About")}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                About
              </button>
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 font-semibold"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Register
        </button>
        
      </div>
    </nav>
  );
}
export default Navbar;
