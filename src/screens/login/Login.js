import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/img/logo-bastos-bn.png";

// CSS File
import "./Login.css";
import TextInput from "../../components/textInput/TextInput";
import Button from "../../components/button/Button";

const Login = () => {
  const auth = useAuth();
  // const { displayName } = auth?.user;

  const [email1, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError(undefined)
    if (email1 && password) {
      try {
        await auth.login(email1, password);
        if (auth?.user?.displayName || email1) {
          window.location.href = "/inventario";
        } else {
          document.body.innerHTML = "<h1>ERROR 404</h1>";
        }
      } catch (error) {
        setError("Usuario o contraseña incorrecta.")
      }
    } else {
      setError("Por favor completa los campos requeridos.")
    }
  };

  // const handleGoogle = (e) => {
  //   e.preventDefault();
  //   auth.loginWithGoogle();
  // };

  return (
    <div className="loginContainer">
      <div className="boxLogin">
        <div className="loginContent">
          <div className="imgLogo">
            <img src={logo} alt="Bastos" />
          </div>
          <h2>Iniciar sesión</h2>
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
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="buttonSubmit">
              <Button style={{backgroundColor: 'green'}} type="submit">Iniciar sesión</Button>
              {/* <Button onClick={(e) => handleGoogle(e)}>GOOGLE</Button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
