import { Route, Routes } from "react-router-dom";
import BloodDonorList from "../blood donar/DonarList/Donar_List_Page";
import Login from "../components/Auth/Loging";
import PrivateRoutes from "./PrivateRoutes";
import { ToastContainer } from "react-toastify";
import MemberPage from "../blood donar/show_member";

export default function Routeing() {
  return (
    <>
      {/* <Header /> */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<BloodDonorList />} path="/home" />
          <Route element={<MemberPage/>} path="/member" />
        </Route>

        <Route element={<Login />} path="/login" exact />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}
