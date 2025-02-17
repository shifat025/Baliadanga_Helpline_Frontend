import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { toast } from "react-toastify";  // Importing toast

// Import the CSS for react-toastify
import 'react-toastify/dist/ReactToastify.css';

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetLoading, setResetLoading] = useState(null);  // State to track reset button loading
  const [resetMyPasswordLoading, setResetMyPasswordLoading] = useState(false);  // State for secretary's own reset button
  const { api } = useAxios();

  const { auth } = useAuth();
  const role = auth?.user?.role;
  const userId = auth?.user?.id;  // Assuming the user ID is available in auth

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        let endpoint = "";

        if (role === "blood_secretary") {
          endpoint = "/user/members/list/";
        } else {
          endpoint = "/user/blood-secretaries/list/";
        }

        const response = await api.get(endpoint);
        if (response.status === 200) {
          setMembers(response.data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        setError("Failed to fetch members");
        toast.error("Error fetching members!");  // Error toast
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [role]);

  const handleResetPassword = async (id) => {
    setResetLoading(id);  // Set loading state for the specific member
    try {
      let endpoint = "";
      let data = {};

      if (role === "blood_secretary") {
        endpoint = "/user/reset-member-password/";
        data = { member_id: id };
      } else if (role === "secretary") {
        endpoint = "/user/reset-blood-secretary-password/";
        data = { blood_secretary_id: id };
      }

      const response = await api.post(endpoint, data);
      if (response.status === 200) {
        toast.success("Password reset successfully!");  // Success toast
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (err) {
      toast.error("Error resetting password: " + err.message);  // Error toast
    } finally {
      setResetLoading(null);  // Reset loading state after the request is done
    }
  };

  const handleResetMyPassword = async () => {
    setResetMyPasswordLoading(true);  // Start loading for secretary's own password reset
    try {
      const response = await api.post("/user/reset-secretary-password/", {
        secretary_id: userId,
      });
      if (response.status === 200) {
        toast.success("Your password has been reset successfully!");
      } else {
        throw new Error("Failed to reset your password");
      }
    } catch (err) {
      toast.error("Error resetting password: " + err.message);
    } finally {
      setResetMyPasswordLoading(false);  // Stop loading after request
    }
  };

  if (loading) {
    return <div className="text-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 min-h-screen">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-wrap justify-center items-center bg-gray-50 p-8">
      {role === "secretary" && (
        <div
          className="w-full sm:w-96 md:w-80 lg:w-96 mx-4 mb-6 p-6 bg-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reset My Password
            </h2>

            <div className="w-full flex justify-center mt-4">
              <button
                onClick={handleResetMyPassword}
                disabled={resetMyPasswordLoading}  // Disable button while loading
                className={`px-6 py-2 ${resetMyPasswordLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-medium rounded-full shadow-md transform hover:scale-105 transition duration-200 ${resetMyPasswordLoading ? 'cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {resetMyPasswordLoading ? 'Resetting...' : 'Reset My Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {members.map((member) => (
        <div
          key={member.id}
          className="w-full sm:w-96 md:w-80 lg:w-96 mx-4 mb-6 p-6 bg-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
        >
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {member.name}
            </h2>

            <div className="w-full text-sm text-gray-600">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Phone Number:</span>
                <span>{member.phone ? member.phone : "Not available"}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Role:</span>
                <span>{member.role}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Secretary Name:</span>
                <span>{member.secretary_name}</span>
              </div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <button
                onClick={() => handleResetPassword(member.id)}
                disabled={resetLoading === member.id}  // Disable button while loading
                className={`px-6 py-2 ${resetLoading === member.id ? 'bg-gray-400' : 'bg-blue-600'} text-white font-medium rounded-full shadow-md transform hover:scale-105 transition duration-200 ${resetLoading === member.id ? 'cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {resetLoading === member.id ? 'Resetting...' : 'Reset Password'}  {/* Show loading text */}
              </button>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};

export default MemberPage;
