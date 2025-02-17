import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Header = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken", { secure: true, sameSite: "Strict" });
    Cookies.remove("refreshToken", { secure: true, sameSite: "Strict" });
    Cookies.remove("user", { secure: true, sameSite: "Strict" });

    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <header className="bg-blue-500 text-white py-4 shadow-md relative">
    <div className="container mx-auto flex justify-between items-center px-4">
      <h1 className="text-xl font-bold">Baliadanga Helpline</h1>
  
      <button
        className="lg:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
      </button>
  
      <nav
        className={`absolute lg:static top-15 left-0 w-full lg:w-auto z-50 transition-all duration-300 ${
          isMenuOpen ? "block bg-blue-500/90 backdrop-blur-md" : "hidden"
        } lg:flex lg:items-center`}
      >
        <ul className="flex flex-col lg:flex-row lg:space-x-6 items-center p-4 lg:p-0">
          {(auth?.user.role === "blood_secretary" || auth?.user.role === "secretary") && (
            <li>
              <button
                onClick={() => navigate("/member")}
                className="text-lg font-bold block w-full py-2"
              >
                Member
              </button>
            </li>
          )}
  
          <li>
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer block w-full text-center"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  
  );
};

export default Header;
