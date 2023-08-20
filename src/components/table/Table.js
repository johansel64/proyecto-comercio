import React, { useState, useMemo, useCallback } from "react";
//import { toast } from "react-toastify";
import toast, { Toaster } from 'react-hot-toast';
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import { updateProduct, getAllProducts, saveProduct, deleteProduct } from "../../firebase/Api";
import { priceFormatter } from "../../utils/Utils";
import CreateNewAccountModal from "./Modales";

//CSS File
import "./Table.css";
import { useAuth } from "../../context/AuthContext";
import Button from "../button/Button";

const Table = ({ data = [] }) => {
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
        accessorKey: "name", //access nested data with dot notation
        header: "Producto",
        size: 200,
      },
      {
        accessorKey: "price",
        header: "Precio",
        size: 100,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={() => ({
              borderRadius: "0.25rem",
              color: "#000",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {"₡ " + priceFormatter(cell.getValue())}
          </Box>
        ),
      },
      {
        accessorKey: "count", //normal accessorKey
        header: "Cantidad",
        size: 50,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() < 10
                  ? theme.palette.error.dark
                  : cell.getValue() >= 10 && cell.getValue() < 25
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue()}
          </Box>
        ),
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
    editProduct(values);
    setTableData([...tableData]);
    exitEditingMode();
  };

  const handleDeleteRow = useCallback(
    (row, id) => {
      deleteProductSelected(row.original.id);
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
      toast.dismiss(id); // Cierra el toast una vez que el producto se haya eliminado
      toast.success("Producto eliminado exitosamente");
    },
    [tableData]
  );

  const addProduct = async (product) => {
    toast.promise(saveProduct(product),
       {
         loading: 'Guardando...',
         success: <b>Producto guardado!</b>,
         error: <b>Error al guardar.</b>,
       }
     );
    getAllProducts();

  };

  const editProduct = async (product) => {
    toast.promise(updateProduct(product),
       {
         loading: 'Actualizando...',
         success: <b>Producto actualizado!</b>,
         error: <b>Error al actualizar.</b>,
       }
     );
  };

  const deleteProductSelected = async (id) => {
    await deleteProduct(id);
    getAllProducts();
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
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
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
        editingMode={auth.userInfo?.rol ==='admin' ? "modal" : null} //default
        enableColumnOrdering={auth.userInfo?.rol ==='admin'}
        enableEditing={auth.userInfo?.rol ==='admin'}
        onEditingRowSave={auth.userInfo?.rol ==='admin' ? handleSaveRowEdits : () => {}}
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
          auth.userInfo?.rol ==='admin' && <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
            <Button style={{backgroundColor: 'green'}} onClick={() => setCreateModalOpen(true)} >
              Agregar Producto
            </Button>
            <Button
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              leftIcon={<FileDownloadIcon />}
              style={{ background: "#FFBF00" }}
            >
              Exportar Productos
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
              Exportar productos seleccionados
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

export default Table;
