import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { getBestSellingPlatilloLastMonth, getPlatilloById } from "../../../firebase/Api";
import { Card, CardContent, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { IMG_NULL } from "../../../constants/Constants";

// CSS File
import "./PlatilloMasVendido.css";

const PlatilloMasVendido = ({ isOpen, onClose, onSaveHandler }) => {
  const [data, setData] = useState();
  const image = useRef(IMG_NULL)

  useEffect(() => {
    getPlatilloMasVendido();
  }, []);


  const getPlatilloMasVendido = async () => {
    try {
      const res = await getBestSellingPlatilloLastMonth();
      const resPlatillo = await getPlatilloById(res?.bestSellingPlatilloId);
      image.current =  resPlatillo?.img === null ? IMG_NULL : resPlatillo?.img;
      setData({ ...res, ...resPlatillo });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  console.log("image.current :>> ", image.current);
  return (
    <Modal isOpen={isOpen} closeModal={onClose} className="modalContainer">
      <div className="containerMasVendido">
        <h2>Platillo Mas Vendido</h2>
        <Card>
          <div className="imgContainer">
            <CardMedia sx={{ maxWidth: 280, minHeight: 250 }} image={image.current} title="Imagen Platillo" />
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data?.name}
            </Typography>
            <p>Precio de Platillo {data?.price}</p>
            <p>Total Recaudado {data?.bestSellingPlatilloRevenue}</p>
            <p>Cantidad Vendida {data?.bestSellingPlatilloSales} </p>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default PlatilloMasVendido;
