import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../api";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      toast.error("Both fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/user/login/", {
        username,
        password,
      });

      if (response.status === 200) {
        const { tokens, user } = response.data;
        if (tokens && user) {
          const { access_token, refresh_token } = tokens;

          setAuth({
            authToken: access_token,
            refreshToken: refresh_token,
            user,
          });

          Cookies.set("authToken", access_token, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("refreshToken", refresh_token, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("user", JSON.stringify(user), {
            secure: true,
            sameSite: "Strict",
          });

          toast.success("Login successful!");
          navigate("/home"); // Redirect to home page
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
