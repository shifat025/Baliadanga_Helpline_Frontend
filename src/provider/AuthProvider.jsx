import Cookies from "js-cookie";
import { useState } from "react";
import { AuthContext } from "../context";

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    authToken: Cookies.get("authToken"),
    refreshToken: Cookies.get("refreshToken"),
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  });
  // console.log(auth?.user_id);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
