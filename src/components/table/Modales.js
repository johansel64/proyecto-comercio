import React, { useState } from 'react';
import TextInput from '../textInput/TextInput';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
  } from '@mui/material';
import Button from '../button/Button';



const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, state }) => {
    const [values, setValues] = useState(() =>
      columns.reduce((acc, column) => {
        acc[column.accessorKey ?? ''] = '';
        return acc;
      }, {}),
    );
  
    const handleSubmit = () => {
      //put your validation logic here
      onSubmit(values);
      onClose();
    };
  
    return (
      <Dialog 
        open={open}  PaperProps={{ sx: { borderRadius: '16px' } }} >
        <DialogTitle textAlign="center">{state === 'new' ? 'Agregar Producto' : 'Editar Producto'}</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              {columns.map((column) => (
                column.accessorKey !== 'id' &&
                <TextInput
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  placeholder={column.header}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button style={{backgroundColor: 'red'}} onClick={onClose}>Cancelar</Button>
          <Button style={{backgroundColor: 'green'}} onClick={() => handleSubmit()}>
            {state === 'new' ? 'Agregar' : 'Editar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

export default CreateNewAccountModal;
