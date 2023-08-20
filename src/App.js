import ReactDOM from "react-dom/client";
import "./normalize.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Routers from "./routes/Routers";
import Navbar from "./components/navbar/Navbar";

function App() {
  // ReactDOM.createRoot(document.getElementById("root")).render(
  return <BrowserRouter>
    <AuthProvider>
      <div className="mainContainer">
        <div className="generalContainer">
          <Routers />
        </div>
      </div>
    </AuthProvider>
  </BrowserRouter>;
  // );
}

export default App;
