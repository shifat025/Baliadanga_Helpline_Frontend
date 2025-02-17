import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleLogout = () => {
    Cookies.remove("authToken", { secure: true, sameSite: "Strict" });
    Cookies.remove("refreshToken", { secure: true, sameSite: "Strict" });
    Cookies.remove("user", { secure: true, sameSite: "Strict" });

    toast.success("Logged out successfully!");

    // Navigate to the login page
    navigate("/");
  };

 

  return (
    <header className="bg-blue-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl font-bold">Baliadanga Helpline</h1>
        <nav>
          <ul className="flex space-x-6">
            {(auth?.user.role === "blood_secretary" ||
              auth?.user.role === "secretary") && (
              <li>
                <button
                  onClick={() => navigate("/member")}
                  className="text-xl font-bold"
                >
                  Member
                </button>
              </li>
            )}

            <li>
              <a
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
