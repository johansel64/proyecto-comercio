  import { db } from "./FirebaseConfig";
  import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    runTransaction,
    where,
    query,
  } from "firebase/firestore";
  //CAMPOS - numeroPlaca, descripcion, marca, idFuncionarioResponsable
  const collectionNameActivos = "Activos";
  //CAMPOS - nombreDepartamento, codigo, ubicacion
  const collectionNameDepartamentos = 'Departamentos';
  //CAMPOS - idFuncionario, nombreCompleto, fechaRegistro, idDepartamento, rol
  const collectionNameFuncionarios = "Funcionarios";


  //FUNCIONARIOS
  export const saveFuncionario = async (data) => {
    try {
      const registerDate = Math.floor(Date.now() / 1000);
      const funcionarioData = {
        nombreCompleto: data.nombreCompleto,
        fechaRegistro: registerDate,
        idDepartamento: "6h5fT242Xux8fRgojb0H",
        rol: "user",
      };
      console.log(funcionarioData);
      await addDoc(collection(db, collectionNameFuncionarios), funcionarioData);
      return { success: true, message: 'Funcionario guardado exitosamente' };
    } catch (error) {
      console.error('Error al guardar el funcionario:', error);
      return { success: false, message: 'Error al guardar el funcionario' };
    }
  };
  
  export const updateFuncionario = async (funcionarioId, nombreCompleto, idDepartamento, rol) => {
    try {
      const funcionarioRef = doc(db, collectionNameFuncionarios, funcionarioId);
  
      // Verificar si el funcionario existe antes de actualizar
      const doc = await funcionarioRef.get();
      if (!doc.exists) {
        return { success: false, message: 'El funcionario no existe' };
      }
  
      const updatedData = {
        nombreCompleto,
        idDepartamento,
        rol
      };
  
      await funcionarioRef.update(updatedData);
      return { success: true, message: 'Funcionario actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar el funcionario:', error);
      return { success: false, message: 'Error al actualizar el funcionario' };
    }
  };
  
  export const fetchFuncionarios = async () => {
    try {
      const funcionariosCollection = collection(db, collectionNameFuncionarios);
      const querySnapshot = await getDocs(funcionariosCollection);
      const funcionarios = [];
  
      querySnapshot.forEach((doc) => {
        const funcionario = {
          id: doc.id,
          ...doc.data()
        };
        funcionarios.push(funcionario);
      });
  
      return { success: true, data: funcionarios };
    } catch (error) {
      console.error('Error al obtener funcionarios:', error);
      return { success: false, message: 'Error al obtener funcionarios' };
    }
  };

  export const fetchFuncionario = async (funcionarioId) => {
    try {
      const fncionarioRef = doc(db, collectionNameFuncionarios, funcionarioId);
      const docSnapshot = await getDoc(fncionarioRef);
  
      if (docSnapshot.exists()) {
        return { success: true, data: docSnapshot.data() };
      } else {
        return { success: false, message: 'El funcionario no existe' };
      }
    } catch (error) {
      console.error('Error al obtener el funcionario:', error);
      return { success: false, message: 'Error al obtener el funcionario' };
    }
  };

  //DEPARTAMENTOS
  export const saveDepartamento = async (codigo, nombreDepartamento, ubicacion) => {
    try {
      // Validar que los campos requeridos estén completos
      if (!codigo || !nombreDepartamento || !ubicacion) {
        return { success: false, message: 'Completa todos los campos' };
      }
  
      const departamentoData = {
        codigo,
        nombreDepartamento,
        ubicacion,
      };
  
      // Guardar el activo en la colección "Activos"
      await addDoc(collection(db, collectionNameDepartamentos), departamentoData);
  
      return { success: true, message: 'Departamento guardado exitosamente' };
    } catch (error) {
      console.error('Error al guardar el departamento:', error);
      return { success: false, message: 'Error al guardar el departamento' };
    }
  };

  export const updateDepartamento = async (departamentoId, nombreDepartamento, codigo, ubicacion) => {
    try {
      // Validar que los campos requeridos estén completos
      if (!nombreDepartamento || !codigo || !ubicacion) {
        return { success: false, message: 'Completa todos los campos' };
      }
  
      const departamentoRef = doc(db, collectionNameDepartamentos, departamentoId);
  
      // Actualizar el departamento en la colección "Departamentos"
      await updateDoc(departamentoRef, {
        nombreDepartamento,
        codigo,
        ubicacion
      });
  
      return { success: true, message: 'Departamento actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar el departamento:', error);
      return { success: false, message: 'Error al actualizar el departamento' };
    }
  };
  
  export const fetchDepartamentos = async () => {
    try {
      const departamentosCollection = collection(db, collectionNameDepartamentos);
      const querySnapshot = await getDocs(departamentosCollection);
      const departamentos = [];
  
      querySnapshot.forEach((doc) => {
        const departamento = {
          id: doc.id,
          ...doc.data()
        };
        departamentos.push(departamento);
      });
  
      return { success: true, data: departamentos };
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
      return { success: false, message: 'Error al obtener departamentos' };
    }
  };
  
  export const deleteDepartamento = async (departamentoId) => {
    try {
      const departamentoRef = doc(db, collectionNameDepartamentos, departamentoId);
  
      // Eliminar el departamento de la colección "Departamentos"
      await deleteDoc(departamentoRef);
  
      return { success: true, message: 'Departamento eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar el departamento:', error);
      return { success: false, message: 'Error al eliminar el departamento' };
    }
  };


//ACTIVOS
export const saveActivo = async (numeroPlaca, descripcion, marca, idFuncionarioResponsable) => {
  try {
    // Validar que los campos requeridos estén completos
    if (!numeroPlaca || !descripcion || !marca || !idFuncionarioResponsable) {
      return { success: false, message: 'Completa todos los campos' };
    }

    const activoData = {
      numeroPlaca,
      descripcion,
      marca,
      idFuncionarioResponsable
    };

    // Guardar el activo en la colección "Activos"
    await addDoc(collection(db, collectionNameActivos), activoData);

    return { success: true, message: 'Activo guardado exitosamente' };
  } catch (error) {
    console.error('Error al guardar el activo:', error);
    return { success: false, message: 'Error al guardar el activo' };
  }
};

export const updateActivo = async (activoId, numeroPlaca, descripcion, marca, idFuncionarioResponsable) => {
  try {
    const activoRef = doc(db, collectionNameActivos, activoId);

    // Verificar si el activo existe antes de actualizar
    const docSnapshot = await getDoc(activoRef);
    if (!docSnapshot.exists()) {
      return { success: false, message: 'El activo no existe' };
    }

    const updatedData = {
      numeroPlaca,
      descripcion,
      marca,
      idFuncionarioResponsable
    };

    await updateDoc(activoRef, updatedData);
    return { success: true, message: 'Activo actualizado exitosamente' };
  } catch (error) {
    console.error('Error al actualizar el activo:', error);
    return { success: false, message: 'Error al actualizar el activo' };
  }
};

export const fetchActivo = async (activoId) => {
  try {
    const activoRef = doc(db, collectionNameActivos, activoId);
    const docSnapshot = await getDoc(activoRef);

    if (docSnapshot.exists()) {
      return { success: true, data: docSnapshot.data() };
    } else {
      return { success: false, message: 'El activo no existe' };
    }
  } catch (error) {
    console.error('Error al obtener el activo:', error);
    return { success: false, message: 'Error al obtener el activo' };
  }
};

export const fetchActivos = async () => {
  try {
    const activosCollection = collection(db, collectionNameActivos);
    const querySnapshot = await getDocs(activosCollection);
    const funcionarios = await fetchFuncionarios()
    const activos = [];

    querySnapshot.forEach((doc) => {
      const funcionario = funcionarios.data?.find((element) => element.id == doc.data()?.idFuncionarioResponsable)
      console.log('funcionario :>> ', funcionario);
      const activo = {
        nombreFuncionario: funcionario.nombreCompleto,
        id: doc.id,
        ...doc.data()
      };
      activos.push(activo);
    });
    return { success: true, data: activos };
  } catch (error) {
    console.error('Error al obtener activos:', error);
    return { success: false, message: 'Error al obtener activos' };
  }
};

export const deleteActivo = async (activoId) => {
    try {
      const activoRef = doc(db, collectionNameActivos, activoId);
  
      // Eliminar el activo de la colección "Activos"
      await deleteDoc(activoRef);
  
      return { success: true, message: 'Activo eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar el activo:', error);
      return { success: false, message: 'Error al eliminar el activo' };
    }
  };