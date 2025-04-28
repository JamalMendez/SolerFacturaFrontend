import "../styles/Ncf.css";
import Table from "../components/Table";
import HeaderGroup from "../components/HeaderGroup";
import { useState } from "react";
import UseStorage from "../hooks/UseStorage";

const columnas = ["Serie", "Tipo", "Secuencia", "Fecha De Creacion"];

const date = new Date();
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();
const regex = /^\d{8,13}$/;

const fechaCreacion = `${year}-${month}-${day}`;

export default function Ncf() {
  const [isModal, setIsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [
    insertarLocalStorage,
    retornarLocalStorage,
    insertarUltimoId,
    retornarUltimoId,
  ] = UseStorage();

  const nombreTabla = "tablaNcf";
  const [rows, setRows] = useState(retornarLocalStorage(nombreTabla) || []);
  const [palabraFiltro, setPalabraFiltro] = useState("");
  const [busqueda, setBusqueda] = useState([]);
  const [id, setId] = useState(retornarUltimoId(nombreTabla));

  function filtrarTabla(palabraBusqueda) {
    setPalabraFiltro(palabraBusqueda);  

    if (palabraBusqueda === "") {
      setBusqueda([]);
    } else {
      const filtro = rows.filter((row) =>
        Object.values(row).some((elemento) =>
          String(elemento).toLowerCase().includes(palabraBusqueda.toLowerCase())
        )
      );
      setBusqueda(filtro);
    }
  }

  return (
    <div className="factura-container">
      <header className="factura-header">
        <h1 className="factura-title">Historial NCF</h1>
        <HeaderGroup onFiltrarTabla={filtrarTabla} />
      </header>

      <main>
        <Table
          columnas={columnas}
          data={palabraFiltro.length > 0 ? busqueda : rows}
        />
        {busqueda.length === 0 && palabraFiltro.length > 0 ? (
          <h1 style={{ textAlign: "center", marginTop: "30px" }}>
            No hay datos de búsqueda
          </h1>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}
