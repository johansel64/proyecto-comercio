import React, { useEffect, useState } from "react";
import Cards from "../../components/card/Cards";
// import {
//   getAllPlatillos,
// } from "../../firebase/Api";
import Loading from "../../components/loading/Loading";
import { Card, Typography } from "@mui/material";
import "./Platillos.css";
import AgregarPlatilloModal from "./agregarPlatilloModal/AgregarPlatilloModal";
import Button from "../../components/button/Button";
import PlatilloMasVendido from "./platilloMasVendido/PlatilloMasVendido";
import { RestaurantMenu } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";


const Platillos = () => {
  const [platillos, setPlatillos] = useState();
  const [modalAgregarPlatillo, setModalAgregarPlatillo] = useState(false);
  const [modalPlatilloMasVendido, setModalPlatilloMasVendido] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    getAllListPlatillo();
  }, []);

  // Obtener todos los platillos y sus productos asociados
  const getAllListPlatillo = async () => {
    // await getAllPlatillos()
    //   .then((platillos) => {
    //     if (platillos && platillos.length > 0) {
    //       setPlatillos(platillos);
    //       console.log(platillos)
    //     } else {
    //       console.log("No hay platillos en la base de datos.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error al obtener la lista de platillos:", error);
    //   });
  };


  return (
    <>
      <Card sx={{ minWidth: 300, width: "100%", marginTop: "50px" }}>
        <Typography sx={{ fontSize: 25, textAlign: "center" }} color="text.secondary" gutterBottom>
          PLATILLOS <RestaurantMenu />
        </Typography>
      </Card>
      <div className="containerButtonsHeadPlatillos">
        {auth?.userInfo?.rol ==='admin' && <Button style={{ background: "#1b5e20" }} onClick={() => setModalAgregarPlatillo(!modalAgregarPlatillo)}>
          Agregar Platillo
        </Button>}
        <Button style={{ background: "#FF894D" }} onClick={() => setModalPlatilloMasVendido(!modalPlatilloMasVendido)}>
          Platillo Mas Vendido
        </Button>
      </div>
      {platillos ? platillos.length > 0 ? <Cards platillos={platillos} handleUpdatePlatillos={() => getAllListPlatillo()} /> : <p>No hay platillos en la base de datos.</p> : <Loading />}
      <AgregarPlatilloModal isOpen={modalAgregarPlatillo} onClose={() => setModalAgregarPlatillo(!modalAgregarPlatillo)} />
      <PlatilloMasVendido isOpen={modalPlatilloMasVendido} onClose={() => setModalPlatilloMasVendido(!modalPlatilloMasVendido)} />
    </>
  );
};

export default Platillos;
