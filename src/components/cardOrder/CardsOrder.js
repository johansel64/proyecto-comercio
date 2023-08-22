import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "../../components/button/Button";
import Typography from "@mui/material/Typography";
// import { updateOrder } from '../../firebase/Api';
import toast, { Toaster } from 'react-hot-toast';


import "./CardsOrder.css";


const imgSinFotoOrder = 'https://firebasestorage.googleapis.com/v0/b/inventariobastos-294b7.appspot.com/o/descarga.png?alt=media&token=b2c327fd-e524-40fa-b5f4-6bb5a9ed429a';
const CardsOrder = ({ orders, refreshOrder }) => {

  const handleStateOrder = async (idOrder, state, id) => {
    // await updateOrder(idOrder, state)
    toast.dismiss(id); // Cierra el toast una vez que el producto se haya eliminado
    toast.promise(refreshOrder(),
    {
      loading: 'Actualizando...',
      success: <b>Orden actualizada!</b>,
      error: <b>Error al guardar.</b>,
    }
  );

  }

  const udploadStateorder = (id, state) => {
    toast((t) => (
      <div className="delete-toast">
        <p>¿Estás seguro de que deseas cambiar el estado de la orden a {state === "inprogress" ? "pendiente" : "finalizado"}?</p>
        <div className="button-container">
          <button className="confirm-button" onClick={() => handleStateOrder(id, state, t.id)}>Sí</button>
          <button className="cancel-button" onClick={() => toast.dismiss(t.id)}>No</button>
        </div>
      </div>
    ), {
      autoClose: false,
      position: "top-center",
    });
  }; 
  return (
    <div className="contentCardsOrders">
      {orders.map((order) => {
        const img = order.platilloImg != null ? order.platilloImg : imgSinFotoOrder;
        return (
          <div className="card" id={order.id} key={order.id}>
            <Card sx={{ maxWidth: 380 }}>
              <CardMedia
                sx={{ height: 250 }}
                image={img}
                title="Imagen de la orden"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {order.platilloName}
                </Typography>
                <p>Estado de orden: </p>
                <p>{order.orderData.state === 'new' ? (<span className="new_order">NUEVA </span>) : (<span className="progres_order">EN PROGRESO</span>)}</p>
              </CardContent>
              <CardActions >
              {order.orderData.state === "new" ? (
                <Button style={{ background: "green" }} onClick={() => udploadStateorder(order.id, "inprogress")} >Procesar</Button>
              ) : (
                <Button style={{ background: "red" }}  onClick={() => udploadStateorder(order.id, "finalized")} >Finalizar</Button>
              )}
              </CardActions>
            </Card>
          </div>
        );
      })}
      <Toaster
        // position="top-right"
        toastOptions={{
          // Define default options
          style: {
            background: '#363636',
            color: '#fff',
          }
        }}      
      />
    </div>
  );
};

export default CardsOrder;