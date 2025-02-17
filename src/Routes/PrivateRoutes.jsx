import { Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import useAuth from "../hooks/useAuth";

export default function PrivateRoutes() {
  const { auth } = useAuth();
  //   const user = auth?.user;

  return (
    <>
      {auth.authToken ? (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
