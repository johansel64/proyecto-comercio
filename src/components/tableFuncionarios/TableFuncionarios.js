import React, { useState, useMemo, useCallback } from "react";
//import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { saveFuncionario } from "../../firebase/Api";
import { priceFormatter } from "../../utils/Utils";
import CreateNewAccountModal from "./Modales";

//CSS File
import "./TableFuncionarios.css";
import { useAuth } from "../../context/AuthContext";
import Button from "../button/Button";

const TableFuncionarios = ({ data = [] }) => {
  const auth = useAuth();
  //CAMPOS - idFuncionario, nombreCompleto, fechaRegistro, idDepartamento, rol
  const columnsFuncionarios = useMemo(
    () => [
      {
        accessorKey: "id", //access nested data with dot notation
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: "nombreCompleto", //access nested data with dot notation
        header: "nombreCompleto",
        size: 200,
      },
      {
        accessorKey: "fechaRegistro",
        header: "fechaRegistro",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: "idDepartamento", //normal accessorKey
        header: "idDepartamento",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: "rol", //normal accessorKey
        header: "rol",
        size: 100,
      },
    ],
    []
  );

  const csvOptionsFuncionarios = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columnsFuncionarios.map((c) => c.header),
  };

  const csvExporterFuncionarios = new ExportToCsv(csvOptionsFuncionarios);

  const [tableDataFuncionarios, setTableDataFuncionarios] = useState(data);
  const [createModalOpen, setCreateModalOpen] = useState(false);


  const addFuncionario = async (funcionario) => {
    toast.promise(saveFuncionario(funcionario),
       {
         loading: 'Guardando...',
         success: <b>Producto guardado!</b>,
         error: <b>Error al guardar.</b>,
       }
     );
  };

  const handleCreateNewRowFuncionario = async (values) => {
    addFuncionario(values);
    tableDataFuncionarios.push(values);
    setTableDataFuncionarios([...tableDataFuncionarios]);

  };

  const handleSaveRowEditsFuncionario = async ({ exitEditingMode, row, values }) => {

  };

  const handleDeleteRowFuncionario = useCallback(
   
  );

  
  const handleExportRowsFuncionarios = (rows) => {
    csvExporterFuncionarios.generateCsv(rows.map((row) => row.original));
  };

  const handleExportDataFuncionarios = () => {
    csvExporterFuncionarios.generateCsv(data);
  };

  const deleteFuncionariosToast = (row) => {
    toast((t) => (
      <div className="delete-toast">
        <p>¿Estás seguro de que deseas eliminar este Funcionario?</p>
        <div className="button-container">
          <button className="confirm-button" onClick={() => handleDeleteRowFuncionario(row, t.id)}>Sí</button>
          <button className="cancel-button" onClick={() => toast.dismiss(t.id)}>No</button>
        </div>
      </div>
    ), {
      autoClose: false,
    });
  };  

  return (
    <div className="tableContainer">
      <MaterialReactTable
        columns={columnsFuncionarios}
        data={tableDataFuncionarios}
        editingMode={auth.userInfo?.rol ==='admin' ? "modal" : null} //default
        enableColumnOrdering={auth.userInfo?.rol ==='admin'}
        enableEditing={auth.userInfo?.rol ==='admin'}
        onEditingRowSave={auth.userInfo?.rol ==='admin' ? handleSaveRowEditsFuncionario : () => {}}
        enableRowSelection
        positionToolbarAlertBanner="bottom"
        initialState={{ columnVisibility: { id: false } }}
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => deleteFuncionariosToast(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
           <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
            <Button style={{backgroundColor: 'green'}} onClick={() => setCreateModalOpen(true)} >
              Agregar Producto
            </Button>
            <Button
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportDataFuncionarios}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar Productos
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
              onClick={() => handleExportRowsFuncionarios(table.getPrePaginationRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar todas las filas
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
              onClick={() => handleExportRowsFuncionarios(table.getRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar todas las columnas
            </Button>
            <Button
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              //only export selected rows
              onClick={() => handleExportRowsFuncionarios(table.getSelectedRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
              >
              Exportar productos seleccionados
            </Button>
          </Box>
        )}
      />
      <CreateNewAccountModal columns={columnsFuncionarios} open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateNewRowFuncionario} state={'new'} />
      <Toaster
        position="top-right"
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

export default TableFuncionarios;
