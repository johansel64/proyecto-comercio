import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../context/AuthContext";

// validar luego el logueo con el context
const ScreensProtected = () => {
  const auth = useAuth();

  return /*auth && auth?.user && auth?.user?.accessToken && auth?.user?.email ?*/ (
    <>
      <Navbar />
      <Outlet />
    </>
  ) 
  // : (
  //   <>Inicia sesion</>
  // );
};

export default ScreensProtected;
