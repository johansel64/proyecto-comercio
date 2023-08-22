import React, { useState, useMemo, useCallback } from "react";
//import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
// import { updateProduct, getAllProducts, saveProduct, deleteProduct } from "../../firebase/Api";
import { priceFormatter } from "../../utils/Utils";
import CreateNewAccountModal from "./Modales";

//CSS File
import "./TableActivos.css";
import { useAuth } from "../../context/AuthContext";
import Button from "../button/Button";
import { deleteActivo, saveActivo, updateActivo } from "../../firebase/Api";

const TableActivos = ({ data = [] }) => {
  const auth = useAuth();

  const columns = useMemo(
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
        accessorKey: "numeroPlaca", //access nested data with dot notation
        header: "Numero de Placa",
        size: 200,
      },
      {
        accessorKey: "descripcion", //access nested data with dot notation
        header: "Descripcion",
        size: 200,
      },
      {
        accessorKey: "marca", //access nested data with dot notation
        header: "Marca",
        size: 200,
      },
      {
        accessorKey: "idFuncionarioResponsable", //access nested data with dot notation
        header: "idFuncionarioResponsable",
        size: 200,
      },
    ],
    []
  );

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const [tableData, setTableData] = useState(data);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateNewRow = async (values) => {
    addActivo(values);
    tableData.push(values);
    setTableData([...tableData]);

    //setTableData(...tableData, values);
  };
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values;
    editActivos(values);
    setTableData([...tableData]);
    exitEditingMode();
  };

  const handleDeleteRow = useCallback(
    (row, id) => {
      deleteActivoSelected(row.original.id);
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
      toast.dismiss(id); // Cierra el toast una vez que el Activo se haya eliminado
      toast.success("Activo eliminado exitosamente");
    },
    [tableData]
  );

  const addActivo = async (activo) => {
    // toast.promise(saveActivo(activo.numeroPlaca, activo.descripcion, activo.marca, activo.idFuncionarioResponsable),
    toast.promise(saveActivo(activo.numeroPlaca, activo.descripcion, activo.marca, 'ZA7bljb4E4XvGnWeSjcY'),
       {
         loading: 'Guardando...',
         success: <b>Activo guardado!</b>,
         error: <b>Error al guardar.</b>,
       }
     );

  };

  const editActivos = async (activo) => {
    toast.promise(updateActivo(activo.id, activo.numeroPlaca, activo.descripcion, activo.marca, activo.idFuncionarioResponsable),
       {
         loading: 'Actualizando...',
         success: <b>Activo actualizado!</b>,
         error: <b>Error al actualizar.</b>,
       }
     );
  };

  const deleteActivoSelected = async (id) => {
    await deleteActivo(id);
  };

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  const deleteProductToast = (row) => {
    toast((t) => (
      <div className="delete-toast">
        <p>¿Estás seguro de que deseas eliminar este activo?</p>
        <div className="button-container">
          <button className="confirm-button" onClick={() => handleDeleteRow(row, t.id)}>Sí</button>
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
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
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
              <IconButton color="error" onClick={() => deleteProductToast(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
            <Button style={{backgroundColor: 'green'}} onClick={() => setCreateModalOpen(true)} >
              Agregar Activo
            </Button>
            <Button
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar Activos
            </Button>
            <Button
              disabled={table.getPrePaginationRowModel().rows.length === 0}
              //export all rows, including from the next page, (still respects filtering and sorting)
              onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar todas las filas
            </Button>
            <Button
              disabled={table.getRowModel().rows.length === 0}
              //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
              onClick={() => handleExportRows(table.getRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar todas las columnas
            </Button>
            <Button
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
              >
              Exportar Activos seleccionados
            </Button>
          </Box>
        )}
      />
      <CreateNewAccountModal columns={columns} open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateNewRow} state={'new'} />
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

export default TableActivos;
