import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../screens/login/Login";
import ScreensProtected from "../layouts/ScreensProtected";
import Inventario from "../screens/inventario/Inventario";
import Platillos from "../screens/platillos/Platillos";
import { useAuth } from "../context/AuthContext";
import Orders from "../screens/orders/Orders";

const Routers = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      {auth && auth?.user && auth?.user?.accessToken && auth?.user?.email ? (
        <Route path="/inventario" element={<ScreensProtected />}>
          <Route index element={<Inventario />} />
          <Route path="/inventario/platillos" element={<Platillos />} />
          <Route path="/inventario/orders" element={<Orders />} />
        </Route>
      ) : (
        <Route path="/inventario" element={<AuthLayout />}>
          <></>
        </Route>
      )}
    </Routes>
  );
};

export default Routers;
