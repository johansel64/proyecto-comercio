import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../screens/login/Login";
import ScreensProtected from "../layouts/ScreensProtected";
import Inventario from "../screens/inventario/Inventario";
import Platillos from "../screens/platillos/Platillos";
import { useAuth } from "../context/AuthContext";
import Orders from "../screens/orders/Orders";
import Departamentos from "../screens/departamentos/Departamentos";
import Activos from "../screens/activos/Activos";
import Registro from "../screens/registro/Registro";

const Routers = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="/register" element={<Registro />} />
      </Route>
      {auth /*&& auth?.user && auth?.user?.accessToken && auth?.user?.email*/ ? (
        <Route path="/departamentos" element={<ScreensProtected />}>
          <Route index element={<Departamentos />} />
          <Route path="/departamentos/funcionarios" element={<Orders />} />
          <Route path="/departamentos/activos" element={<Activos />} />
        </Route>
      ) : (
        <Route path="/departamentos" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
      )}
    </Routes>
  );
};

export default Routers;
