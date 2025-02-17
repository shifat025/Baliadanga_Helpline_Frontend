import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import useAuth from "./useAuth";

// Flags to handle token refresh
let isRefreshing = false; // Prevent multiple simultaneous token refreshes
let refreshPromise = null; // Promise for managing token refresh

export const useAxios = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add a request intercepter
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        const authToken = auth?.authToken;
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response intercepter
    const responseIntercept = api.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (error) => {
        const orginalRequest = error.config; // Original request causing error
        if (error.response?.status === 401 && !orginalRequest._retry) {
          orginalRequest._retry = true;

          // Ensure only one refresh request at a time
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshAccessToken(auth, setAuth, navigate);
          }

          try {
            const accessToken = await  refreshPromise; // Wait for token refresh

            orginalRequest.headers.Authorization = `Bearer ${accessToken}`; // Retry request with new token

            return axios(orginalRequest); // Retry the original request
          } catch (error) {
            console.error("Failed to refresh token:", error);
            throw error; // Propagate error if refresh fails
          } finally {
            isRefreshing = false;
            refreshPromise = null; // Reset refresh state
          }
        }
        return Promise.reject(error); // Return configured Axios instance
      }
    );
    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth, navigate]);

  return { api };
};

// Function to refresh access token
const refreshAccessToken = async (auth, setAuth, navigate) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_BASE_URL}/user/token/refresh/`,
      { refresh: auth?.refreshToken }
    );

    const { access, refresh } = response.data;

    // Update auth state and cookies
    setAuth({ ...auth, authToken: access, refreshToken: refresh });
    Cookies.set("authToken", access, { secure: true, sameSite: "Strict" });
    Cookies.set("refreshToken", refresh, {
      secure: true,
      sameSite: "Strict",
    });

    return access;
  } catch (error) {
    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    navigate("/login");
    throw error;
  }
};
