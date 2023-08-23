import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../../components/textInput/TextInput";
import Button from "../../components/button/Button";

//CSS File
import "./Registro.css";

const Registro = () => {
    const auth = useAuth();
  // const { displayName } = auth?.user;

  const [email1, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const [error, setError] = useState();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setNombre(e.target.value);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError(undefined)
    if (email1 && password && nombre) {
      try {
        const data = {
            nombreCompleto: nombre,
            email: email1,
            password: password
        }
        
      } catch (error) {
        setError("Lo sentimos, ha ocurrido un error al registrarte, por favor, intente de nuevo.")
      }
    } else {
      setError("Por favor completa los campos requeridos.")
    }
  };

  return (
    <div className="registerContainer">
      <div className="boxRegister">
        <div className="registerContent">
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmitLogin}>
            <div className="formGroup">
              <TextInput type="email" label="Email" name="email" placeholder="Email" value={email1} onChange={handleEmailChange} />
            </div>
            <div className="formGroup">
              <TextInput
                type="password"
                label="Contraseña"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="formGroup">
              <TextInput type="text" label="Nombre Completo" name="name" placeholder="Nombre Completo" value={nombre} onChange={handleNameChange} />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="buttonSubmit">
              <Button style={{ backgroundColor: "green" }} type="submit">
                Registrarse
              </Button>
              <p>¿Ya posees cuenta?</p>
              <Button style={{ backgroundColor: "gold" }} onClick={() => (window.location.href = "/")}>
                Inicia Sesión
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
