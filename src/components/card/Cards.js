import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "../../components/button/Button";
import Typography from "@mui/material/Typography";
// import { addNewOrder } from "../../firebase/Api";
import { priceFormatter } from "../../utils/Utils";

import "./Cards.css";
import AgregarOrdenModal from "../../screens/platillos/agregarOrdenModal/AgregarOrdenModal";
import IngredientesModal from "../../screens/platillos/ingredientesModal/IngredientesModal";

const imgSinFoto =
  "https://firebasestorage.googleapis.com/v0/b/inventariobastos-294b7.appspot.com/o/descarga.png?alt=media&token=b2c327fd-e524-40fa-b5f4-6bb5a9ed429a";
const Cards = ({ platillos, handleUpdatePlatillos }) => {
  const [modalAgregarOrden, setModalAgregarOrden] = useState(false);
  const [modalIngredientes, setModalIngredientes] = useState(false);
  const [idSelectedPlatillo, setIdSelectedPlatillo] = useState();
  const [ingredientes, setIngredientes] = useState();

  const handleCreateOrder = async (id, cantidad) => {
    try {
      // return await addNewOrder(id, cantidad);
    } catch (error) {
      return { status: 400, message: "No hay suficientes ingredientes para este platillo." };
    }
  };

  const openModalAddOrder = (id) => {
    setIdSelectedPlatillo(id);
    setModalAgregarOrden(true);
  };

  const openModalIngredientes = (platillo) => {
    setIngredientes(platillo);
    setModalIngredientes(true);
  };

  return (
    <div className="contentCards">
      {platillos.map((platillo) => {
        const img = platillo.img != null ? platillo.img : imgSinFoto;
        return (
          <div className="card" id={platillo.id} key={platillo.id}>
            <Card sx={{ maxWidth: 380, textAlign: "center" }}>
              <CardMedia sx={{ height: 250 }} image={img} title="Imagen del platillo" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" className="platilloName">
                  {platillo.name}
                </Typography>
                <hr></hr>
                <p>Precio en base a los produtos:</p>
                <strong>₡ {priceFormatter(platillo.precioTotal)}</strong>
                <p>
                  Precio de venta: <strong>₡ {priceFormatter(platillo.price)}</strong>
                </p>
                <p>
                  Cantidad Maxima de a preparar = <strong>{platillo.cantidadDePlatillos}</strong>
                </p>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
                <Button style={{ background: "green" }} onClick={() => openModalAddOrder(platillo.id)} >
                  Ordenar
                </Button>
                <Button style={{ background: "#FFBF00" }} onClick={() => openModalIngredientes(platillo)} >
                  Editar
                </Button>
              </CardActions>
            </Card>
          </div>
        );
      })}
      <AgregarOrdenModal
        isOpen={modalAgregarOrden}
        onClose={() => setModalAgregarOrden(!modalAgregarOrden)}
        onSave={handleCreateOrder}
        idPlatillo={idSelectedPlatillo}
        handleUpdatePlatillos={handleUpdatePlatillos}
      />
      <IngredientesModal
        isOpen={modalIngredientes}
        onClose={() => setModalIngredientes(!modalIngredientes)}
        ingredientes={ingredientes}
        handleUpdatePlatillos={handleUpdatePlatillos}
      />
    </div>
  );
};

export default Cards;
