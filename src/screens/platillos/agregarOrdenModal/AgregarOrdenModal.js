import React, { useState } from "react";
import TextInput from "../../../components/textInput/TextInput";

//CSS FILE
import "./AgregarOrdenModal.css";
import Modal from "../../../components/modal/Modal";
import Button from "../../../components/button/Button";
import { addNewOrder } from "../../../firebase/Api";
import { Toaster, toast } from "react-hot-toast";

const AgregarOrdenModal = ({ isOpen, onClose, onSave, idPlatillo, handleUpdatePlatillos }) => {
  const [numberOrders, setNumberOrders] = useState(1);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState();

  const handleChange = (e, setValue, isFile) => {
    const value = isFile ? e.target.files[0] : e.target.value;
    if (/^[0-9]*$/.test(value) || value === "") {
      setValue(value);
    }
  };

  const handleOnSave = async () => {
    setError(false);
    setLoading(true);
    if (numberOrders && numberOrders > 0) {
      try {
        const res = await onSave(idPlatillo, numberOrders);
        if (res.status === 400) {
          setMessageStatus(res.message);
          setError(true);
          setLoading(false);
          return false;
        } else {
          await handleUpdatePlatillos();
          onClose();
          setLoading(false);
          return true;
        }
      } catch (error) {
        console.log("error :>> ", error);
      }
    } else {
      setLoading(false);
      setError(true);
      return false;
    }
  };

  const handlePromiseOnSave = async () => {
    toast.promise(
      handleOnSave(),
      {
        loading: "Cargando...",
      success: (data) => {
        return data ? "✅  Guardado exitosamente" : "❌  Se ha presentado un incoveniente";
      },
      },
      {
        success: {
          duration: 3000,
          icon:  '',
        },
      }
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} closeModal={onClose} className="modalContainer">
        <h2>Agregar Orden</h2>
        <div className="containerForm">
          <TextInput
            type="number"
            label="Platillos a Ordenar"
            name="orderPlatillos"
            placeholder="Platillos a Ordenar"
            value={numberOrders}
            onChange={(e) => handleChange(e, setNumberOrders)}
          />
          {error ? (
            messageStatus ? (
              <p style={{ color: "red" }}>{messageStatus}</p>
            ) : (
              <p>Revisa todos los campos que cumplan con lo requerido</p>
            )
          ) : null}
          <div className="containerButton">
            <Button disabled={!numberOrders || numberOrders < 1 || loading} style={{ background: "#1b5e20" }} onClick={() => handlePromiseOnSave()}>
              Agregar Orden
            </Button>
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

export default AgregarOrdenModal;
