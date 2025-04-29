import "../styles/factura.css";
import Table from "../components/Table";
import HeaderGroup from "../components/HeaderGroup";
import Modal from "../components/Modal";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Alert from "@mui/joy/Alert";
import ModalConfirmacion from "../components/ModalConfirmacion";
import useModal from "../hooks/UseModal";
import clienteService from "../services/clienteService";

const columnas = [
  "ID",
  "Cliente",
  "Descripcion",
  "Fecha Creacion",
  "Fecha Vencimiento",
];

const date = new Date();
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();

const fechaCreacion = `${year}-${month}-${day}`;

export default function Factura() {
  const [isModal, setIsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowFiltrada, setRowFiltrada] = useState([]);
  const [palabraFiltro, setPalabraFiltro] = useState("");
  const [busqueda, setBusqueda] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isError, setIsError] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const [isModalConfirmacion, setIsModalConfirmacion, cancelarEliminacion] =
    useModal();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const clientesData = await clienteService.getAll();
      setClientes(clientesData);
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  function showModal(id) {
    setNombre("");
    setDescripcion("");
    setFechaVencimiento("");
    setIsModal(true);
    setIsEditing(false);

    if (typeof id === "number" && !isNaN(id)) {
      setIdSeleccionado(id);
      setIsEditing(true);
      editarFila(id);
    }
  }

  function validarInformacion() {
    if ([nombre, descripcion, fechaVencimiento].includes("")) {
      setMensajeAlerta("Campos no pueden ir vacios");
      setIsError(true);
      return;
    }

    setIsModal(false);
    setNombre("");
    setDescripcion("");
    setFechaVencimiento("");

    if (!isEditing) {
      setRows((rows) => {
        const nuevasRows = [
          {
            id,
            nombre,
            descripcion,
            fechacreacion: fechaCreacion,
            fechavencimiento: fechaVencimiento,
          },
          ...rows,
        ];
        return nuevasRows;
      });
    } else {
      setRows((rows) => {
        const nuevasRows = rows.map((row, i) =>
          i === idSeleccionado
            ? {
                ...row,
                nombre,
                descripcion,
                fechavencimiento: fechaVencimiento,
              }
            : row
        );
        return nuevasRows;
      });
      setIsEditing(false);
    }
  }

  function eliminarElemento(id) {
    setRows((rows) => {
      const nuevasRows = rows.filter((row) => row.id !== id);
      return nuevasRows;
    });
  }

  function editarFila(id) {
    const fila = rows.find((row, i) => i === id);
    if (fila) {
      setNombre(fila.nombre);
      setDescripcion(fila.descripcion);
      setFechaVencimiento(fila.fechavencimiento);
    }
  }

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

  function opcionFiltrada(filtro) {
    if (filtro === "COT") {
      const filasFiltrada = rows.filter((row) => row.isCot === true);
      setRows(filasFiltrada);
    } else if (filtro === "NCF") {
      const filasFiltrada = rows.filter((row) => row.isCot === false);
      setRows(filasFiltrada);
    } else {
      setRows(rows);
    }
  }

  return (
    <div className="factura-container">
      <header className="factura-header">
        <h1 className="factura-title">Factura</h1>
        <HeaderGroup
          nombreBtn={"Factura"}
          onShowModal={showModal}
          onFiltrarTabla={filtrarTabla}
          onOpcionFiltrada={opcionFiltrada}
        />
      </header>

      <main>
        <Table
          columnas={columnas}
          pagina={"factura"}
          data={palabraFiltro.length > 0 ? busqueda : rows}
          setIsModalConfirmacion={setIsModalConfirmacion}
          onShowModal={showModal}
        />
        {busqueda.length === 0 && palabraFiltro.length > 0 ? (
          <h1 style={{ textAlign: "center", marginTop: "30px" }}>
            No hay datos de búsqueda
          </h1>
        ) : (
          ""
        )}
      </main>

      {/* MODAL AGREGAR*/}
      {isModal && (
        <Modal setIsModal={setIsModal} modalNombre="Factura">
          {mensajeAlerta && (
            <div>
              <Alert color="danger">{mensajeAlerta}</Alert>
            </div>
          )}

          <Button
            className="factura-button"
            variant="contained"
            color={isEditing ? "warning" : "success"}
            onClick={validarInformacion}
          >
            {isEditing ? "Editar Factura" : "Agregar Factura"}
          </Button>
        </Modal>
      )}

      {/*MODAL CONFIRMACION DE ELIMINAR */}
      {isModalConfirmacion.active && (
        <ModalConfirmacion
          onEliminarElemento={eliminarElemento}
          setIsModalConfirmacion={setIsModalConfirmacion}
          id={isModalConfirmacion.id}
          onCancelar={cancelarEliminacion}
        />
      )}
    </div>
  );
}
