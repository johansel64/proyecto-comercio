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
import "./TableDepartments.css";
import { useAuth } from "../../context/AuthContext";
import Button from "../button/Button";
import { deleteDepartamento, saveDepartamento, updateDepartamento } from "../../firebase/Api";

const TableDepartments = ({ data = [] }) => {
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
        accessorKey: "codigo", //access nested data with dot notation
        header: "Codigo",
        size: 200,
      },
      {
        accessorKey: "nombreDepartamento", //access nested data with dot notation
        header: "Departamento",
        size: 200,
      },
      {
        accessorKey: "ubicacion", //access nested data with dot notation
        header: "Ubicacion",
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
    addProduct(values);
    tableData.push(values);
    setTableData([...tableData]);

    //setTableData(...tableData, values);
  };
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    tableData[row.index] = values;
    editDepartment(values);
    setTableData([...tableData]);
    exitEditingMode();
  };

  const handleDeleteRow = useCallback(
    (row, id) => {
      deleteDepartmentSelected(row.original.id);
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
      toast.dismiss(id); // Cierra el toast una vez que el departamento se haya eliminado
      toast.success("Departamento eliminado exitosamente");
    },
    [tableData]
  );

  const addProduct = async (departamento) => {
    toast.promise( saveDepartamento(departamento.nombreDepartamento, departamento.codigo, departamento.ubicacion),
       {
         loading: 'Guardando...',
         success: <b>Producto guardado!</b>,
         error: <b>Error al guardar.</b>,
       }
     );
    // getAllProducts();

  };

  const editDepartment = async (departamento) => {
    toast.promise(updateDepartamento(departamento.id, departamento.nombreDepartamento, departamento.codigo, departamento.ubicacion),
       {
         loading: 'Actualizando...',
         success: <b>Departamento actualizado!</b>,
         error: <b>Error al actualizar.</b>,
       }
     );
  };

  const deleteDepartmentSelected = async (id) => {
    await deleteDepartamento(id);
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
        <p>¿Estás seguro de que deseas eliminar este departamento?</p>
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
              Agregar Departamentos
            </Button>
            <Button
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar Departamentos
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
              Exportar departamentos seleccionados
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

export default TableDepartments;
