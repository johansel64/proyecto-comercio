import React, { useEffect, useState } from "react";
import CardsOrder from "../../components/cardOrder/CardsOrder";
import { getAllOrders } from "../../firebase/Api";
import Loading from "../../components/loading/Loading";
import { Card, Typography } from "@mui/material";
import { Description } from "@mui/icons-material";

import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState();

  useEffect(() => {
    getAllListOrder();
  }, []);

  // Obtener todos las ordenes y sus productos asociados
  const getAllListOrder = async () => {
    await getAllOrders()
      .then((orders) => {
        if (orders && orders.length > 0) {
          console.log(orders);
          setOrders(orders);
        } else {
          console.log("No hay Ordenes en la base de datos.");
          setOrders([])
        }
      })
      .catch((error) => {
        console.error("Error al obtener la lista de Ordenes:", error);
      });
  };

  const refreshOrder = async () => {
    return await getAllListOrder();
  };

  const filterOrder = (state) => {
    return orders?.filter((order) => order.orderData.state === state).length;
  };
console.log('orders :>> ', orders);
  return (
    <>
      <Card sx={{ minWidth: 300, width: "100%", marginTop: "50px" }}>
        <Typography sx={{ fontSize: 25, textAlign: "center", fontWeight: "bold" }} color="text.secondary" gutterBottom>
          ORDENES <Description />
        </Typography>
      </Card>

      {orders ? (
        orders.length > 0 ? (
          <div>
            {" "}
            <div className="centerH4">
              <h4>
                {" "}
                ORDENES NUEVAS = {filterOrder("new")} &#160; &#160; &#160; ORDENES EN PROCESO = {filterOrder("inprogress")}{" "}
              </h4>{" "}
            </div>{" "}
            <CardsOrder orders={orders} refreshOrder={refreshOrder} />
          </div>
        ) : (
          <div className="sinOrdenes">
            <p>No existen ordenes pendientes.</p>
          </div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Orders;
