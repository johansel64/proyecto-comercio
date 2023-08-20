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
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storage, db } from "./FirebaseConfig";
  import { v4 as uuidv4 } from "uuid";
  import imageCompression from "browser-image-compression";
  
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
      const registerDate = Math.floor(Date.now() / 1000);
      const docuRef = await addDoc(collection(db, collectionNameFuncionarios), {id, nombreCompleto, fechaRegistro:registerDate, idDepartamento, rol});
      console.log(docuRef);
    } catch (error) {
      
    }
  }
  
  export const saveProduct = async (newProduct) => {
    try {
      // Consultar la colección de productos
      const productsRef = collection(db, collectionNameActivos);
      const querySnapshot = await getDocs(productsRef);
  
      // Verificar si ya existe un producto con el mismo nombre
      const existingProduct = querySnapshot.docs.find(doc => doc.data().name === newProduct.name);
      if (existingProduct) {
        throw new Error(`Ya existe un producto con el nombre "${newProduct.name}".`);
      }
  
      // Agregar el nuevo producto si no existe uno con el mismo nombre
      const docRef = await addDoc(productsRef, newProduct);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const updateProduct = (updatedFields) => {
    return updateDoc(doc(db, collectionNameActivos, updatedFields.id), updatedFields);
  }
  
  export const getProducts = () => {return getDocs(collection(db, collectionNameActivos))};
  
  export const deleteProduct = (id) => deleteDoc(doc(db, collectionNameActivos, id));
  
  export const getProduct = (id) => getDoc(doc(db, collectionNameActivos, id));

  export const getAllProducts = async () => {
    const data = await getProducts();
    const sortedProducts = data.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .sort((a, b) => a.count - b.count); // Ordenar por count en orden ascendente
    return sortedProducts;
  };


  //GUARDAR PLATILLOS

  // Función para guardar un nuevo platillo y asociar los productos existentes
  export const savePlatillosWithExistingProducts = async (newPlatillo, existingProductsIds) => {
    // Agrega el campo "productosIds" al platillo con los IDs de los productos asociados
    newPlatillo.productosIds = existingProductsIds;

    const platilloRef = await addDoc(collection(db, collectionNameDepartamentos), newPlatillo);

    return platilloRef.id;
  };

  
  // Función para actualizar un platillo por su ID
  export const updatePlatillo = async (platilloId, updatedData) => {
    try {
      const platilloRef = doc(db, collectionNameDepartamentos, platilloId);

      await updateDoc(platilloRef, updatedData);

      const updatedPlatilloSnapshot = await getDoc(platilloRef);
      const updatedPlatilloData = updatedPlatilloSnapshot.data();

      return {
        id: platilloRef.id,
        data: updatedPlatilloData,
      };

    } catch (error) {
      throw error;
    }
  };
  
  // Función para obtener todos los platillos
  export const getAllPlatillos = async () => {
    try {
      const platillosRef = collection(db, collectionNameDepartamentos);
      const platillosSnapshot = await getDocs(platillosRef);
  
      const platillosWithProductos = [];
  
      for (const platilloDoc of platillosSnapshot.docs) {
        const platilloData = platilloDoc.data();
        const { productosIds } = platilloData;
  
        let precioTotalPlatillo = 0;
        let cantidadesPlatillos = [];
        const productos = [];
  
        for (const productId of productosIds) {
          const productDocRef = doc(db, collectionNameActivos, productId);
          const productSnapshot = await getDoc(productDocRef);
  
          if (!productSnapshot.exists()) {
            throw new Error(`El producto con ID ${productId} no fue encontrado.`);
          }
  
          const productData = productSnapshot.data();
          const precioProducto = parseFloat(productData.price);
          precioTotalPlatillo += precioProducto;
  
          const cantidadDisponible = parseInt(productData.count);
          cantidadesPlatillos.push(cantidadDisponible);
  
          // Agregar ID y nombre del producto al array de productos
          productos.push({ id: productId, nombre: productData.name });
        }
  
        const cantidadMaximaPlatillos = Math.min(...cantidadesPlatillos);
        cantidadesPlatillos = [];
  
        // Agregar el precio total y lista de productos al objeto del platillo
        const platilloConProductos = {
          id: platilloDoc.id,
          ...platilloData,
          precioTotal: precioTotalPlatillo,
          cantidadDePlatillos: cantidadMaximaPlatillos,
          productos: productos,
        };
        platillosWithProductos.push(platilloConProductos);
      }
  
      return platillosWithProductos;
    } catch (error) {
      console.error('Error al obtener los platillos:', error);
      throw error;
    }
  };


  export const getPlatilloById = async (platilloId) => {
      const platilloDocRef = doc(db, collectionNameDepartamentos, platilloId);
      const platilloSnapshot = await getDoc(platilloDocRef);
  
      if (!platilloSnapshot.exists()) {
        return null; // El platillo no fue encontrado.
      }
  
      const platilloData = platilloSnapshot.data();
      const { productosIds } = platilloData;
  
      // Cotizar los precios de los productos asociados al platillo
      let precioTotalPlatillo = 0;
      for (const productId of productosIds) {
        const productDocRef = doc(db, collectionNameActivos, productId);
        const productSnapshot = await getDoc(productDocRef);
  
        if (!productSnapshot.exists()) {
          throw new Error(`El producto con ID ${productId} no fue encontrado.`);
        }
  
        const productData = productSnapshot.data();
        const precioProducto = parseFloat(productData.price);
        precioTotalPlatillo += precioProducto;
      }
  
      // Agregar el precio total al objeto del platillo
      const platilloConPrecio = { id: platilloSnapshot.id, ...platilloData, precioTotal: precioTotalPlatillo };
  
      return platilloConPrecio;
  };
  

  // Función para borrar un platillo por su ID
  export const deletePlatillo = async (platilloId) => {
    const platilloRef = doc(db, collectionNameDepartamentos, platilloId);

    await deleteDoc(platilloRef);
  };


  //SUBIR ARCHIVOS
  export const uploadFiles = async (file) => {
    try {
      // Validar que el archivo sea un objeto File o Blob y tenga un tamaño válido
      if (!(file instanceof File) && !(file instanceof Blob)) {
        throw new Error("El archivo proporcionado no es válido.");
      }
  
      if (file.size === 0) {
        throw new Error("El archivo está vacío.");
      }
  
      // Comprimir la imagen antes de subirla
      const options = {
        maxSizeMB: 1, // Tamaño máximo después de la compresión (ajusta según tus necesidades)
        maxWidthOrHeight: 800, // Tamaño máximo de ancho o alto (ajusta según tus necesidades)
      };
      const compressedFile = await imageCompression(file, options);
  
      // Generar un nombre único para el archivo
      const uniqueFileName = `${uuidv4()}-${file.name}`;
      // Subir el archivo comprimido al almacenamiento
      const storageRef = ref(storage, "img/" + uniqueFileName);

      await uploadBytes(storageRef, compressedFile);
  
      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir el archivo comprimido:", error);
      throw error;
    }
  };

  ///////////////////////////ORDENES///////////////////////////////////

  export const addNewOrder = async (platilloId, count) => {
    try {
      const orderDate = Math.floor(Date.now() / 1000);
      const newOrder = { platilloId, count, orderDate, state: 'new' };
      const ordenRef = await addDoc(collection(db, collectionNameOrder), newOrder);
  
      const platilloDocRef = doc(db, collectionNameDepartamentos, platilloId);
      const platilloSnapshot = await getDoc(platilloDocRef);
  
      if (!platilloSnapshot.exists()) {
        return null; // El platillo no fue encontrado.
      }
  
      const platilloData = platilloSnapshot.data();
      const { productosIds } = platilloData;
  
      // Realizamos todas las operaciones de lectura necesarias fuera del bucle de la transacción
      const productosPromises = productosIds.map((productId) => {
        const productDocRef = doc(db, collectionNameActivos, productId);
        return getDoc(productDocRef);
      });
  
      // Esperamos a que todas las lecturas se completen antes de continuar con las operaciones de escritura
      const productosSnapshots = await Promise.all(productosPromises);
  
      // Cotizar los precios de los productos asociados al platillo
      await runTransaction(db, async (transaction) => {
        for (let i = 0; i < productosSnapshots.length; i++) {
          const productSnapshot = productosSnapshots[i];
  
          if (!productSnapshot.exists()) {
            throw new Error(`El producto con ID ${productosIds[i]} no fue encontrado.`);
          }
  
          const productData = productSnapshot.data();
          const countAvailable = parseFloat(productData.count);
  
          if (countAvailable < count) {
            throw new Error(`No hay suficientes unidades del producto con ID ${productosIds[i]}.`);
          }
  
          transaction.update(productSnapshot.ref, { count: countAvailable - count });
        }
      });
  
      return ordenRef.id;
    } catch (error) {
      console.error('Error al agregar la orden y restar los productos:', error);
      throw error;
    }
  };

  /////////////////////Actualiza una Orden//////////////////////

  export const updateOrder = async (orderId, newState) => {
    try {
      const orderRef = doc(db, collectionNameOrder, orderId);
  
      const orderSnapshot = await getDoc(orderRef);
      if (!orderSnapshot.exists()) {
        return null; // La orden no fue encontrada.
      }
  
      // Actualiza el estado de la orden
      await updateDoc(orderRef, { state: newState });
  
      return orderId;
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      throw error;
    }
  };


  export const getAllOrders = async () => {
    try {
      const ordersWithPlatillos = await fetchOrdersWithPlatillos();
      const sortedOrders = sortOrders(ordersWithPlatillos);
      return sortedOrders;
    } catch (error) {
      console.error('Error al obtener y ordenar las órdenes:', error);
      throw error;
    }
  };
  
  const fetchOrdersWithPlatillos = async () => {
    const ordersCollectionRef = collection(db, collectionNameOrder);
    const ordersQuerySnapshot = await getDocs(ordersCollectionRef);
    
    const ordersWithPlatillos = [];
    for (const orderDoc of ordersQuerySnapshot.docs) {
      const orderData = orderDoc.data();
      if (orderData.state !== "finalized") {
        const platilloDocRef = doc(db, collectionNameDepartamentos, orderData.platilloId);
        const platilloSnapshot = await getDoc(platilloDocRef);
        
        if (platilloSnapshot.exists()) {
          const platilloData = platilloSnapshot.data();
          ordersWithPlatillos.push({
            id: orderDoc.id,
            orderData,
            platilloName: platilloData.name,
            platilloImg: platilloData.img
          });
        }
      }
    }
    return ordersWithPlatillos;
  };
  
  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      if (a.orderData.state === "new" && b.orderData.state === "inprogress") {
        return -1;
      }
      if (a.orderData.state === "inprogress" && b.orderData.state === "new") {
        return 1;
      }
      return 0;
    });
  };
  
  

  export const getBestSellingPlatilloLastMonth = async () => {
    try {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const lastMonthInSeconds = nowInSeconds - 2592000;
  
      const ordersRef = collection(db, collectionNameOrder);
  
      // Consulta para obtener las órdenes finalizadas dentro del último mes
      const q = query(ordersRef, where('state', '==', 'finalized'), where('orderDate', '>=', lastMonthInSeconds));
  
      const querySnapshot = await getDocs(q);
  
      const platilloSales = {};
  
      // Calcular ventas y ganancias para cada platillo en las órdenes finalizadas del último mes
      for (const orderDoc of querySnapshot.docs) {
        const orderData = orderDoc.data();
        const platilloId = orderData.platilloId;
        const count = orderData.count;
  
        // Obtenemos el precio del platillo desde la colección "Platillos"
        const platilloDocRef = doc(db, collectionNameDepartamentos, platilloId);
        const platilloSnapshot = await getDoc(platilloDocRef);
  
        if (!platilloSnapshot.exists()) {
          continue; // El platillo no fue encontrado, pasamos al siguiente.
        }
  
        const platilloData = platilloSnapshot.data();
        const platilloPrice = platilloData.price;
  
        if (!platilloSales[platilloId]) {
          platilloSales[platilloId] = {
            count: 0,
            totalRevenue: 0,
          };
        }
  
        platilloSales[platilloId].count += count;
        platilloSales[platilloId].totalRevenue += platilloPrice * count;
      }
  
      // Encontrar el platillo con más ventas
      let bestSellingPlatilloId = null;
      let maxSalesCount = 0;
      for (const platilloId in platilloSales) {
        if (platilloSales[platilloId].count > maxSalesCount) {
          bestSellingPlatilloId = platilloId;
          maxSalesCount = platilloSales[platilloId].count;
        }
      }
  
      // Calcular las ganancias del platillo más vendido
      const bestSellingPlatilloRevenue = platilloSales[bestSellingPlatilloId]?.totalRevenue || 0;
  
      return {
        bestSellingPlatilloId,
        bestSellingPlatilloSales: maxSalesCount,
        bestSellingPlatilloRevenue,
      };
    } catch (error) {
      console.error('Error al obtener el platillo más vendido y sus ganancias:', error);
      throw error;
    }
  };
  
  
  