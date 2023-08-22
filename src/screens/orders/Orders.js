import TableFuncionarios from "../../components/table/TableFuncionarios";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
//import { toast } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchFuncionarios  } from "../../firebase/Api";
import Loading from "../../components/loading/Loading";
import { Inventory2 } from "@mui/icons-material";

import "./Orders.css";

const Orders = () => {
  const initialProduct = {
    name: "",
    price: "",
    count: "",
  };

  const [product, setProduct] = useState(initialProduct);
  const [allFuncionarios, setAllFuncionarios] = useState();
  //const { tableData, setTableData } = useState([]);

  useEffect(() => {
    getAllFuncionariosTable();
  }, []);

  const getAllFuncionariosTable = async () => {
    console.log("Hola")
    const data = await fetchFuncionarios();
    if (data.success) {
      setAllFuncionarios(data.data);
    } else {
      console.error(data.message);
    }
  };

  const addOrEditProduct = async (product) => {
    // await saveProduct(product);
    // await getAllFuncionariosTable();
    toast.success("Guardado!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <div className="container">
        <Card sx={{ minWidth: 300, width: "100%", marginTop: "50px" }}>
          <Typography sx={{ fontSize: 25, textAlign: "center", fontWeight: "bold" }}color="text.secondary" gutterBottom>
            INVENTARIO <Inventory2 />
          </Typography>
        </Card>
        {allFuncionarios ? <TableFuncionarios data={allFuncionarios} /> : <Loading />}
        <ToastContainer />
      </div>
    </>
  );
};

export default Orders;
