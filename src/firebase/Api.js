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
  import { storage, db } from "./FirebaseConfig";
  
  //CAMPOS - numeroPlaca, descripcion, marca, idFuncionarioResponsable
  const collectionNameActivos = "Activos";
  //CAMPOS - nombreDepartamento, codigo, ubicacion
  const collectionNameDepartamentos = 'Departamentos';
  //CAMPOS - idFuncionario, nombreCompleto, fechaRegistro, idDepartamento, rol
  const collectionNameFuncionarios = "Funcionarios";

  /*export const getRolUser = async (id) => {
    const userDoc = await getDoc(doc(db, collectionNameFuncionarios, id));
    if (userDoc) {
      const userData = userDoc.data();
      return userData.rol; // Reemplaza "rol" con el nombre del campo que almacena el rol en tu base de datos
    } else {
      throw new Error("El usuario no existe.");
    }
  };*/

  //FUNCIONARIOS
  export const saveFuncionario = async (id, nombreCompleto, idDepartamento, rol) => {
    try {
      const registerDate = firebase.firestore.FieldValue.serverTimestamp();
      const funcionarioData = {
        id,
        nombreCompleto,
        fechaRegistro: registerDate,
        idDepartamento,
        rol
      };
  
      await db.collection(collectionNameFuncionarios).add(funcionarioData);
      return { success: true, message: 'Funcionario guardado exitosamente' };
    } catch (error) {
      console.error('Error al guardar el funcionario:', error);
      return { success: false, message: 'Error al guardar el funcionario' };
    }
  };
  
  export const updateFuncionario = async (funcionarioId, nombreCompleto, idDepartamento, rol) => {
    try {
      const funcionarioRef = db.collection(collectionNameFuncionarios).doc(funcionarioId);
  
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
  
  

  //DEPARTAMENTOS
  export const saveDepartamentos = async (nombreDepartamento, codigo, ubicacion) => {
    try {
      // Validar que los campos requeridos estén completos
      if (!nombreDepartamento || !codigo || !ubicacion) {
        return { success: false, message: 'Completa todos los campos' };
      }
  
      // Guardar el departamento en la colección "Departamentos"
      await db.collection(collectionNameDepartamentos).add({
        nombreDepartamento,
        codigo,
        ubicacion
      });
  
      return { success: true, message: 'Departamento guardado exitosamente' };
    } catch (error) {
      console.error('Error al guardar el departamento:', error);
      return { success: false, message: 'Error al guardar el departamento' };
    }
  };

  export const fetchFuncionarios = async () => {
    try {
      const querySnapshot = await db.collection(collectionNameFuncionarios).get();
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

  export const updateDepartamento = async (departamentoId, nombreDepartamento, codigo, ubicacion) => {
    try {
      // Validar que los campos requeridos estén completos
      if (!nombreDepartamento || !codigo || !ubicacion) {
        return { success: false, message: 'Completa todos los campos' };
      }
  
      // Actualizar el departamento en la colección "Departamentos"
      await db.collection(collectionNameDepartamentos).doc(departamentoId).update({
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
      const querySnapshot = await db.collection(collectionNameDepartamentos).get();
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
      // Eliminar el departamento de la colección "Departamentos"
      await db.collection(collectionNameDepartamentos).doc(departamentoId).delete();
  
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

    // Guardar el activo en la colección "Activos"
    await db.collection(collectionNameActivos).add({
      numeroPlaca,
      descripcion,
      marca,
      idFuncionarioResponsable
    });

    return { success: true, message: 'Activo guardado exitosamente' };
  } catch (error) {
    console.error('Error al guardar el activo:', error);
    return { success: false, message: 'Error al guardar el activo' };
  }
};

export const updateActivo = async (activoId, numeroPlaca, descripcion, marca, idFuncionarioResponsable) => {
  try {
    const activoRef = db.collection(collectionNameActivos).doc(activoId);

    // Verificar si el activo existe antes de actualizar
    const doc = await activoRef.get();
    if (!doc.exists) {
      return { success: false, message: 'El activo no existe' };
    }

    const updatedData = {
      numeroPlaca,
      descripcion,
      marca,
      idFuncionarioResponsable
    };

    await activoRef.update(updatedData);
    return { success: true, message: 'Activo actualizado exitosamente' };
  } catch (error) {
    console.error('Error al actualizar el activo:', error);
    return { success: false, message: 'Error al actualizar el activo' };
  }
};

export const fetchActivo = async (activoId) => {
  try {
    const activoRef = db.collection(collectionNameActivos).doc(activoId);
    const doc = await activoRef.get();

    if (doc.exists) {
      return { success: true, data: doc.data() };
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
    const querySnapshot = await db.collection(collectionNameActivos).get();
    const activos = [];

    querySnapshot.forEach((doc) => {
      const activo = {
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
  
  
  