import React, { useEffect, useState } from "react";
import TextInput from "../textInput/TextInput";
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import Button from "../button/Button";
import { fetchFuncionarios } from "../../firebase/Api";
import Select from "react-select";

const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, state, dataColumn }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      console.log(column.accessorKey)
      console.log(dataColumn)
      return acc;
    }, {})
  );
  const [funcionarios, setFuncionarios] = useState();
  const [funcionarioACargo, setFuncionarioACargo] = useState();
  useEffect(() => {
    getFuncionarios();
  }, []);

  const getFuncionarios = async () => {
    const funcionariosData = await fetchFuncionarios();
    const funcionariosOrder = funcionariosData.data?.map((item) => {
      return { value: item?.id, label: item?.nombreCompleto };
    });

    setFuncionarios(funcionariosOrder);
  };

  const handleSubmit = () => {
    //put your validation logic here
    const data = {
      descripcion: values.descripcion,
      idFuncionarioResponsable: funcionarioACargo.value,
      marca: values.marca,
      numeroPlaca: values.numeroPlaca,
    }
    onSubmit(data);
    onClose();
  };
  return (
    <Dialog open={open} PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle textAlign="center">{state === "new" ? "Agregar Activo" : "Editar Activo"}</DialogTitle>
      <DialogContent sx={{ minHeight: 500 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
              textAlign: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {columns.map(
              (column) =>
                column.accessorKey !== "id" &&
                column.accessorKey !== "nombreFuncionario" && (
                  <TextInput
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    placeholder={column.header}
                    onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                  />
                )
            )}
            {funcionarios && (
              <div style={{width: 220}}>
                  <p>Funcionario</p>
                <Select options={funcionarios} placeholder='Selecciona un Funcionario' value={funcionarioACargo} onChange={setFuncionarioACargo} />
              </div>
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button style={{ backgroundColor: "red" }} onClick={onClose}>
          Cancelar
        </Button>
        <Button style={{ backgroundColor: "green" }} onClick={() => handleSubmit()}>
          {state === "new" ? "Agregar" : "Editar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewAccountModal;
