import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getRolUser,
  saveFuncionario,
} from "../firebase/Api";

/* Creating a context object. */
export const authContext = createContext();

/**
 * UseAuth() is a function that returns the context object that was created by the useContext() hook.
 */
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log("error creating auth context");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState();

  /* A hook that is called when the component is mounted and when the component is updated. */
  useEffect(() => {
    const subscribed = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.log("no hay usuario suscrito");
        setUser("");
      } else {
        /*setUser(currentUser);
        const docRefRol = await getRolUser(currentUser.uid);
        const userData = { id: currentUser.uid, rol: docRefRol };
        setUserInfo(userData)
        sessionStorage.setItem("userData", JSON.stringify(userData));*/
      }
    });
    return () => subscribed();
  }, []);

  /**
   * "register" is a function that takes two arguments, "email" and "password", and then calls the
   * "createUserWithEmailAndPassword" function with the "auth" object and the "email" and "password"
   * arguments.
   */
  const register = async (email, password, nombreCompleto) => {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((user) => {
      return user;
    });
    const funcionarioData = {
      idUsuario: response.user.uid,
      nombreCompleto
    };
    await saveFuncionario(funcionarioData)
  };
  /**
   * "login" is a function that takes two parameters, "email" and "password", and returns a promise that
   * resolves to the result of calling "signInWithEmailAndPassword" with the parameters "auth", "email",
   * and "password".
   */
  const login = async (email, password) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
  };
  /**
   * The loginWithGoogle function is an async function that returns the result of the signInWithPopup
   * function, which takes the auth and responseGoogle parameters.
   *The responseGoogle object is being returned.
   */
  const loginWithGoogle = async () => {
    const responseGoogle = new GoogleAuthProvider();
    return await signInWithPopup(auth, responseGoogle);
  };
  /**
   * The logout function is an asynchronous function that calls the signOut function and logs the
   * response to the console.
   */
  const logout = async () => {
    const response = await signOut(auth);
    console.log(response);
  };
  return (
    <authContext.Provider
      value={{
        register,
        login,
        loginWithGoogle,
        logout,
        user,
        loading,
        userInfo
      }}
    >
      {children}
    </authContext.Provider>
  );
}