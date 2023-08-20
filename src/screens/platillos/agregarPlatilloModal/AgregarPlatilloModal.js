import React, { useEffect, useState } from "react";
import Select from "react-select";

import "./AgregarPlatilloModal.css";
import Modal from "../../../components/modal/Modal";
import TextInput from "../../../components/textInput/TextInput";
import { getAllProducts, savePlatillosWithExistingProducts, uploadFiles } from "../../../firebase/Api";
import Button from "../../../components/button/Button";

const AgregarPlatilloModal = ({ isOpen, onClose, onSaveHandler }) => {
  const [options, setOptions] = useState([]);
  const [optionsSelected, setOptionsSelected] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [error, setError] = useState();

  const getProducts = async () => {
    const data = await getAllProducts();
    const optionsData = data?.map((item) => {
      return { value: item?.id, label: item?.name };
    });
    setOptions(optionsData);
  };
  //value label
  useEffect(() => {
    getProducts();
  }, []);

  const onSave = async () => {
    if (name && price && description && optionsSelected && image) {
      const products = [];
      optionsSelected.forEach((item) => {
        products.push(item.value);
      });
      const urlFile = await uploadFiles(image);
      const newPlatillo = {
        name: name,
        price: price,
        descripcion: description,
        img: urlFile
      };
      savePlatillosWithExistingProducts(newPlatillo, products)
      .then (() => {
        console.log('platillo Guardado exitosamente');
        onClose();
      })
      .catch((error) => {
        console.log("Error:", error);
        setError("Por favor verifica que todos los campos esten completos.")
      })
    } else {
      setError("Por favor verifica que todos los campos esten completos.")
      console.log("no");
    }
  };

  const handleChange = (e, setValue, isFile) => {
    setValue(isFile ? e.target.files[0] : e.target.value);
  };

  return (
    <Modal isOpen={isOpen} closeModal={onClose} className="modalContainer">
      <h2>Agregar Platillo</h2>
      <div className="containerForm">
        <TextInput
          type="text"
          label="Nombre"
          name="nombre"
          placeholder="Nombre de Platillo"
          value={name}
          onChange={(e) => handleChange(e, setName)}
        />
        <TextInput type="number" label="Precio" name="precio" placeholder="Precio" value={price} onChange={(e) => handleChange(e, setPrice)} />
        <TextInput
          type="text"
          label="Descripción"
          name="descripcion"
          placeholder="Descripción"
          value={description}
          onChange={(e) => handleChange(e, setDescription)}
        />
        <p>Imagen del platillo</p>
        <input type="file" onChange={(e) => handleChange(e, setImage, true)} />
        <p>Ingredientes:</p>
        <Select options={options} isMulti value={optionsSelected} onChange={setOptionsSelected} />
        {error && <p style={{color: 'red'}}>{error}</p>}
        <div className="containerButton">
          <Button style={{ background: "#1b5e20" }} onClick={() => onSave()}>
            Agregar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AgregarPlatilloModal;
