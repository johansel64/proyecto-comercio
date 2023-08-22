import Table from "../../components/table/Table";
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
//import { toast } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { saveProduct, getAllProducts } from "../../firebase/Api";
import Loading from "../../components/loading/Loading";
import { Inventory2 } from "@mui/icons-material";

import "./inventario.css";

const Inventario = () => {
  const initialProduct = {
    name: "",
    price: "",
    count: "",
  };

  const [product, setProduct] = useState(initialProduct);
  const [allProduct, setAllProduct] = useState();
  //const { tableData, setTableData } = useState([]);

  useEffect(() => {
    getAllProductsTable();
  }, []);

  const getAllProductsTable = async () => {
    // const data = await getAllProducts();
    // setAllProduct(data);
    // console.log(data);
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
            INVENTARIO <Inventory2 />
          </Typography>
        </Card>
        {allProduct ? <Table data={allProduct} /> : <Loading />}
        <ToastContainer />
      </div>
    </>
  );
};

export default Inventario;
