import TableActivos from "../../components/tableActivos/TableActivos";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
//import { toast } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { saveProduct, getactivoss } from "../../firebase/Api";
import Loading from "../../components/loading/Loading";
import { Inventory2 } from "@mui/icons-material";

import "./Activos.css";
import { fetchActivos, fetchDepartamentos } from "../../firebase/Api";

const Activos = () => {
  const initialProduct = {
    name: "",
    price: "",
    count: "",
  };

  const [product, setProduct] = useState(initialProduct);
  const [activos, setactivos] = useState();
  //const { tableData, setTableData } = useState([]);

  useEffect(() => {
    getAllProductsTable();
  }, []);

  const getAllProductsTable = async () => {
    const data = await fetchActivos();
    setactivos(data);
  };

  const addOrEditProduct = async (product) => {
    // await saveProduct(product);
    // await getAllProductsTable();
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
            ACTIVOS <Inventory2 />
          </Typography>
        </Card>
        {activos ? activos?.success ? <TableActivos data={activos?.data} /> : <p style={{textAlign: 'center', color: 'red', marginTop: 50}}>{activos?.message}</p> : <Loading />}
        <ToastContainer />
      </div>
    </>
  );
};

export default Activos;
