import "../styles/Clientes.css";
import Table from "../components/Table";
import HeaderGroup from "../components/HeaderGroup";
import Modal from "../components/Modal";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Alert from "@mui/joy/Alert";
import CamposClientes from "../components/CamposClientes";
import ModalConfirmacion from "../components/ModalConfirmacion";
import useModal from "../hooks/UseModal";
import clienteService from "../services/clienteService";

import {
  camposVacios,
  validarFormatoEmail,
  validarCedula,
  validarTelefonos,
  errorValidacion,
  limpiarError,
  validarCamposLargos,
  validarClienteExistente,
  validarCedulaExistente,
  validarTelefonosExistentes
} from "../../utilities/validarCamposCliente";

const columnas = [
  "Cedula",
  "Nombre",
  "Apellido",
  "E-mail",
  "Direccion",
  "Ciudad",
  "Telefono",
  "Celular",
];
const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function Clientes() {
  const [isModal, setIsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [rows, setRows] = useState([]);
  const [palabraFiltro, setPalabraFiltro] = useState("");
  const [busqueda, setBusqueda] = useState([]);
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [celular, setCelular] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [isError, setIsError] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const [isModalConfirmacion, setIsModalConfirmacion, cancelarEliminacion] =
    useModal();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const clientes = await clienteService.getAll();
      setRows(clientes);
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  function showModal(id) {
    limpiarCampos();
    limpiarError();
    setIsModal(true);
    setIsEditing(false);

    if (typeof id === "number" && !isNaN(id)) {
      setIdSeleccionado(id);
      setIsEditing(true);
      editarFila(id);
    }
  }

  async function validarInformacion() {
    limpiarError();
    if (
      camposVacios(
        cedula,
        nombre,
        apellido,
        direccion,
        ciudad
      ) ||
      !validarFormatoEmail(email, regex) ||
      !validarCedula(cedula) ||
      !validarTelefonos(telefono, celular) ||
      !validarTelefonosExistentes(rows, telefono, celular, idSeleccionado) ||
      !validarCamposLargos(nombre, apellido, direccion, ciudad, email) ||
      !validarClienteExistente(rows, nombre, idSeleccionado) ||
      !validarCedulaExistente(rows, cedula, idSeleccionado)
    ) {
      if (errorValidacion.hayError) {
        setMensajeAlerta(errorValidacion.mensaje);
        setIsError(true);

        setTimeout(() => {
          setMensajeAlerta("");
          setIsError(false);
        }, 2000);
      }
      return;
    }
    await procesarDatos();
  }

  async function procesarDatos() {
    setIsModal(false);
    limpiarCampos();

    try {
      if (!isEditing) {
        await agregarCliente();
      } else {
        await actualizarCliente();
      }
      await fetchClientes();
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  }

  function limpiarCampos() {
    setCedula("");
    setNombre("");
    setApellido("");
    setEmail("");
    setDireccion("");
    setCiudad("");
    setTelefono("");
    setCelular("");
  }

  async function agregarCliente() {
    try {
      await clienteService.create({
        cedula,
        nombre,
        apellido,
        email,
        direccion,
        ciudad,
        telefono,
        celular
      });
    } catch (error) {
      throw error;
    }
  }

  async function actualizarCliente() {
    try {
      await clienteService.update(idSeleccionado, {
        cedula,
        nombre,
        apellido,
        email,
        direccion,
        ciudad,
        telefono,
        celular
      });
      setIsEditing(false);
    } catch (error) {
      throw error;
    }
  }

  async function eliminarElemento(id) {
    try {
      await clienteService.delete(id);
      await fetchClientes();
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  }

  function editarFila(id) {
    const fila = rows.find((row) => row.id === id);
    if (fila) {
      setCedula(fila.rnc_cedula);
      setNombre(fila.nombre);
      setApellido(fila.apellido);
      setEmail(fila.email);
      setDireccion(fila.direccion);
      setCiudad(fila.ciudad);
      setTelefono(fila.telefono);
      setCelular(fila.celular);
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

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <h1 className="clientes-title">Clientes</h1>
        <HeaderGroup
          onFiltrarTabla={filtrarTabla}
          nombreBtn={"Clientes"}
          onShowModal={showModal}
        />
      </header>

      <main>
        <Table
          columnas={columnas}
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
        <Modal
          setIsModal={setIsModal}
          mensajeAlerta={mensajeAlerta}
          modalNombre="Clientes"
        >
          {isError && (
            <div className="alert">
              <Alert color="danger">{mensajeAlerta}</Alert>
            </div>
          )}

          <CamposClientes
            cedula={cedula}
            setCedula={setCedula}
            nombre={nombre}
            setNombre={setNombre}
            apellido={apellido}
            setApellido={setApellido}
            email={email}
            setEmail={setEmail}
            direccion={direccion}
            setDireccion={setDireccion}
            telefono={telefono}
            setTelefono={setTelefono}
            celular={celular}
            setCelular={setCelular}
            ciudad={ciudad}
            setCiudad={setCiudad}
            mensajeAlerta={mensajeAlerta}
          />
          <Button
            className="clientes-button"
            variant="contained"
            color={isEditing ? "warning" : "success"}
            onClick={validarInformacion}
          >
            {isEditing ? "Editar Cliente" : "Agregar Cliente"}
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
