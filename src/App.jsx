
import "../src/styles/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Clientes from "./pages/Clientes";
import Ncf from "./pages/Ncf";
import Factura from "./pages/Factura";
import Productos from "./pages/Productos";
import CreacionFactura from './pages/CreacionFactura'
import Menu from "./components/Menu";

export default function App() {
  console.log("Frontend cargado desde App.jsx")
  return (
    <div className="container-app">
      <BrowserRouter>
        <Menu />

        <div className="container-routes">
          <Routes>
            <Route path="/" element={<Navigate to="/factura" />} />
            <Route path="/factura" element={<Factura />} />
            <Route path="/ncf" element={<Ncf />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/creacion-factura" element={<CreacionFactura />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
