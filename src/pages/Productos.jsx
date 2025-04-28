import "../styles/Productos.css";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Alert from "@mui/joy/Alert";
import Table from "../components/Table";
import HeaderGroup from "../components/HeaderGroup";
import Modal from "../components/Modal";
import CamposProductos from "../components/CamposProductos";
import ModalConfirmacion from "../components/ModalConfirmacion";
import useModal from "../hooks/UseModal";
import tipoProductoService from "../services/tipoProductoService";
import productoService from "../services/productoService";

const columnas = [
  "ID",
  "Nombre",
  "Peso ($RD)",
  "Dolares ($US)",
  "Tipo de producto",
];

export default function Productos() {
  const [isModal, setIsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [rows, setRows] = useState([]);
  const [palabraFiltro, setPalabraFiltro] = useState("");
  const [busqueda, setBusqueda] = useState([]);
  const [nombre, setNombre] = useState("");
  const [costo, setCosto] = useState("");
  const [costoEnDolares, setCostoEnDolares] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [opcionesTipoProducto, setOpcionesTipoProducto] = useState([]);
  let [tipoProductoId, setTipoProductoId] = useState(null);

  const [
    isError,
    setIsError,
    mensajeAlerta,
    setMensajeAlerta,
    isModalConfirmacion,
    setIsModalConfirmacion,
    cancelarEliminacion,
  ] = useModal();

  useEffect(() => {
    fetchTipoProductos();
    fetchProductos();
  }, []);

  const fetchTipoProductos = async () => {
    try {
      const tiposProducto = await tipoProductoService.getAll();
      setOpcionesTipoProducto(tiposProducto);
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  const fetchProductos = async () => {
    try {
      const productos = await productoService.getAll();
      setRows(productos);
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  const handleShowModal = (id) => {
    limpiarCampos();
    setIsModal(true);
    setIsEditing(false);

    if (typeof id === "number" && !isNaN(id)) {
      setIdSeleccionado(id);
      setIsEditing(true);
      editarFila(id);
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setCosto("");
    setCostoEnDolares("");
    setTipoProducto("");
  };

  const handleValidarInformacion = async () => {
    if (
      rows
        .filter((row) => row.id !== idSeleccionado)
        .some((row) => row.nombre.trim() === nombre.trim())
    ) {
      setMensajeAlerta("Producto ya existe");
      setIsError(true);
      return;
    }

    if ([nombre, costo, tipoProducto].includes("")) {
      setMensajeAlerta("Campos no pueden ir vacíos");
      setIsError(true);
      return;
    }

    if(nombre.length > 50){
      setMensajeAlerta("Nombre de producto muy largo");
      setIsError(true);
      return;
    }

    if (costo <= 0) {
      setMensajeAlerta("Producto no tiene costo");
      setIsError(true);
      return;
    }

    if (costoEnDolares < 0) {
      setMensajeAlerta("Producto no tiene costo en dolares");
      setIsError(true);
      return;
    }

    if (!isTipoProductoExistente()) {
      try {
        const nuevoTipo = await tipoProductoService.create(tipoProducto);
        setOpcionesTipoProducto(prev => [...prev, nuevoTipo]);
        setTipoProductoId(nuevoTipo.id);
        tipoProductoId = nuevoTipo.id;
      } catch (error) {
        setMensajeAlerta(error.message);
        setIsError(true);
        return;
      }
    }
    
    setIsModal(false);
    limpiarCampos();

    try {
      if (!isEditing) {
        await agregarProducto();
      } else {
        await editarProducto();
      }
      await fetchProductos();
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }

  };

  const isTipoProductoExistente = () => {
    const tipoExistente = opcionesTipoProducto.find(
      (producto) => producto.nombre === tipoProducto
    );
    if (tipoExistente) {
      setTipoProductoId(tipoExistente.id);
      tipoProductoId = tipoExistente.id;
      return true;
    }
    return false;
  };

  const agregarProducto = async () => {
    try {
      await productoService.create({
        nombre,
        costo,
        costoEnDolares,
        tipoproducto_id: tipoProductoId
      });
    } catch (error) {
      throw error;
    }
  };

  const editarProducto = async () => {
    try {
      await productoService.update(idSeleccionado, {
        nombre,
        costo,
        costoEnDolares,
        tipoproducto_id: tipoProductoId
      });
      setIsEditing(false);
    } catch (error) {
      throw error;
    }
  };

  const eliminarElemento = async (id) => {
    try {
      await productoService.delete(id);
      await fetchProductos();
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  const editarFila = (id) => {
    const fila = rows.find((row) => row.id === id);
    if (fila) {
      setNombre(fila.nombre);
      setCosto(fila.costo);
      setCostoEnDolares(fila.costoEnDolares);
      setTipoProducto(fila.tipodeproducto);
      setTipoProductoId(fila.tipoproducto_id);
    }
  };

  const filtrarTabla = (palabraBusqueda) => {
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
  };

  const eliminarTipoProducto = async (index) => {
    const tipoProductoAEliminar = opcionesTipoProducto[index];
    try {
      await tipoProductoService.delete(tipoProductoAEliminar.id);
      const listaActualizada = opcionesTipoProducto.filter((_, i) => i !== index);
      setOpcionesTipoProducto(listaActualizada);
      setTimeout(() => {
        setTipoProducto("");
        setTipoProductoId(null);
      }, 0.2);
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="productos-container">
      <header className="productos-header">
        <h1 className="productos-title">Productos</h1>
        <HeaderGroup
          nombreBtn={"Productos"}
          onShowModal={handleShowModal}
          onFiltrarTabla={filtrarTabla}
        />
      </header>

      <main>
        <Table
          columnas={columnas}
          data={palabraFiltro.length > 0 ? busqueda : rows}
          setIsModalConfirmacion={setIsModalConfirmacion}
          onShowModal={handleShowModal}
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
        <Modal setIsModal={setIsModal} modalNombre="Productos">
          {mensajeAlerta && (
            <div>
              <Alert color="danger">{mensajeAlerta}</Alert>
            </div>
          )}

          <CamposProductos
            nombre={nombre}
            setNombre={setNombre}
            costo={costo}
            setCosto={setCosto}
            costoEnDolares={costoEnDolares}
            setCostoEnDolares={setCostoEnDolares}
            tipoProducto={tipoProducto}
            setTipoProducto={setTipoProducto}
            opcionesTipoProducto={opcionesTipoProducto}
            onEliminarTipoProducto={eliminarTipoProducto}
          />
          <Button
            className="productos-button"
            variant="contained"
            color={isEditing ? "warning" : "success"}
            onClick={handleValidarInformacion}
          >
            {isEditing ? "Editar Producto" : "Agregar Producto"}
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
