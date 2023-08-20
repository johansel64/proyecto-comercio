import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/modal/Modal";
import TextInput from "../../../components/textInput/TextInput";
import Button from "../../../components/button/Button";
import Select from "react-select";
import { getAllProducts, updatePlatillo, uploadFiles } from "../../../firebase/Api";
import { Toaster, toast } from "react-hot-toast";

// CSS File
import "./IngredientesModal.css";

const IngredientesModal = ({ isOpen, onClose, ingredientes, handleUpdatePlatillos }) => {
  const [options, setOptions] = useState([]);
  const [optionsSelected, setOptionsSelected] = useState();
  const [price, setPrice] = useState();
  const [error, setError] = useState();
  const [buttonEnable, setButtonEnable] = useState(false);
  const [keyPrice, setKeyPrice] = useState(1);
  const handleChange = (e, setValue, isFile) => {
    setValue(isFile ? e.target.files[0] : e.target.value);
  };

  const onSave = async () => {
    setButtonEnable(true);
    if (price && optionsSelected) {
      const products = [];
      optionsSelected.forEach((item) => {
        products.push(item.value);
      });
      const platillo = {
        price: price,
        productosIds: products,
      };
      try {
        const res = await updatePlatillo(ingredientes?.id, platillo);
        if (res?.id) {
          await handleUpdatePlatillos();
          onClose();
          setButtonEnable(false);

          return true;
        } else {
          setButtonEnable(false);
          return false;
        }
      } catch (error) {
        setButtonEnable(false);
        return false;
      }
    }
  };

  const getProducts = async () => {
    const data = await getAllProducts();
    const optionsData = data?.map((item) => {
      return { value: item?.id, label: item?.name };
    });
    setOptions(optionsData);
  };
  //value label

  useEffect(() => {
    const productos = ingredientes?.productos?.map((item) => {
      return { value: item?.id, label: item?.nombre };
    });
    console.log("ingredientes?.price :>> ", ingredientes?.price);
    setOptionsSelected(productos);
    setPrice(ingredientes?.price);
    setKeyPrice(Math.floor(Math.random() * (50 - 0 + 1)) + 0);
  }, [ingredientes, ingredientes?.price]);

  useEffect(() => {
    getProducts();
  }, []);

  const handlePromiseOnSave = async () => {
    var iconStyle;
    toast.promise(
      onSave(),
      {
        loading: "Cargando...",
        success: (data) => {
          return data ? "✅  Actualizado exitosamente" : "❌  Se ha presentado un incoveniente";
        },
      },
      {
        success: {
          duration: 3000,
          icon: "",
        },
      }
    );
    console.log("iconStyle :>> ", iconStyle);
  };

  console.log("price :>> ", price);
  return (
    <>
      <Modal isOpen={isOpen} closeModal={onClose} className="modalContainer">
        <div key={keyPrice} className="containerMasVendido">
          <h2>Editar Platillo</h2>
          <div>
            <h4>{ingredientes?.name}</h4>
            <TextInput type="number" label="Precio" name="precio" placeholder="Precio" value={price} onChange={(e) => handleChange(e, setPrice)} />
            <p>Ingredientes:</p>
            <Select options={options} isMulti value={optionsSelected} onChange={setOptionsSelected} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="containerButton">
              <Button style={{ background: "#1b5e20" }} disabled={buttonEnable} onClick={() => handlePromiseOnSave()}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default IngredientesModal;
