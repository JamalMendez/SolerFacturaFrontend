import React, { useEffect, useState } from "react";
import UseStorage from "../hooks/UseStorage";
import {
  TextField,
  Select,
  Checkbox,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import TextArea from "@mui/joy/Textarea";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "./Modal";
import CamposClientes from "./CamposClientes";
import Alert from "@mui/joy/Alert";
import CamposProductos from "./CamposProductos";
import clienteService from "../services/clienteService";
import tipoProductoService from "../services/tipoProductoService";
import productoService from "../services/productoService";

import {
  camposVacios,
  validarFormatoEmail,
  validarCedula,
  validarTelefonos,
  errorValidacion,
  limpiarError,
  validarCamposLargos,
  validarClienteExistente,
  validarCedulaExistente
} from "../../utilities/validarCamposCliente";

const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function CamposFactura({
  datosFacturaChange,
  productos: productosProp,
  clientes,
  setClientes,
  onGenerarPDF,
  productosSeleccionados,
  datosProductosChange,
  isDolar,
  isCot,
  onMonedaChange,
  onCotChange,
  datosFactura,
  iniciarPDF,
  editandoFila,
  filaEditar,
}) {
  const [
    insertarLocalStorage,
    retornarLocalStorage,
    insertarUltimoId,
    retornarUltimoId,
    guardarUltimoSecuencialNCF,
    obtenerUltimoSecuencialNCF,
  ] = UseStorage();

  const nombreTabla = "tablaClientes";

  // Estados para factura
  const [gastoEnvio, setGastoEnvio] = useState(
    editandoFila ? filaEditar.gastoEnvio : ""
  );
  const [medioPago, setMedioPago] = useState(
    editandoFila ? filaEditar.medioPago : ""
  );
  const [cliente, setCliente] = useState(
    editandoFila ? filaEditar.cliente || "" : ""
  );
  const [fechavencimiento, setFechavencimiento] = useState(
    editandoFila
      ? filaEditar.fechavencimiento || ""
      : ""
  );

  // NCF
  const [tipoNcf, setTipoNcf] = useState(
    editandoFila ? filaEditar.ncf?.substring(1,3) || "01" : "01"
  );
  const [serieNcf, setSerieNcf] = useState(
    editandoFila ? filaEditar.ncf?.substring(0,1) || "A" : "A"
  );
  const ultimoSecuencialNcf = obtenerUltimoSecuencialNCF();
  const [secuencialNcf, setSecuencialNcf] = useState(
    editandoFila ? filaEditar.ncf?.substring(3) : ultimoSecuencialNcf
  );

  // Estados para el modal de producto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCost, setNewProductCost] = useState("");
  const [newProductCostDollars, setNewProductCostDollars] = useState("");
  const [newProductType, setNewProductType] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [productError, setProductError] = useState("");

  // Estados para edición de productos
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [editingProductData, setEditingProductData] = useState({
    producto: "",
    cantidad: 1,
    precioUnitario: 0,
    costo: 0,
    costoEnDolares: 0,
    aplicarImpuesto: true,
  });

  // Estados para el modal de cliente
  const [isModal, setIsModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [rows, setRows] = useState(retornarLocalStorage(nombreTabla) || []);
  const [id, setId] = useState(retornarUltimoId(nombreTabla) || 1);

  // Estados del formulario de cliente
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [celular, setCelular] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [error, setError] = useState("");
  const [productoActual, setProductoActual] = useState({
    producto: "",
    cantidad: 1,
    precioUnitario: 0,
    tipoDeMoneda: "RD",
  });

  // Initialize form data when editing
  useEffect(() => {
    if (editandoFila) {
      if (filaEditar.cliente) {
        datosFacturaChange("cliente", filaEditar.cliente);
      }
      if (filaEditar.ncf) {
        datosFacturaChange("ncf", filaEditar.ncf);
      }
    }
  }, [editandoFila, filaEditar]);

  // Fetch productos and product types on component mount
  useEffect(() => {
    fetchProductos();
    fetchProductTypes();
  }, []);

  const fetchProductos = async () => {
    try {
      const productosData = await productoService.getAll();
      setProductos(productosData);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const tiposData = await tipoProductoService.getAll();
      setProductTypes(tiposData);
    } catch (error) {
      setError(error.message);
    }
  };

  // Update prices when currency changes
  useEffect(() => {
    const updatedProducts = productosSeleccionados.map((producto) => {
      const productInfo = productos.find((p) => p.nombre === producto.producto);
      if (productInfo) {
        const costo = isDolar ? productInfo.costoEnDolares : productInfo.costo;
        const subtotal = producto.cantidad * costo;
        return {
          ...producto,
          precioUnitario: costo,
          total: producto.aplicarImpuesto ? subtotal * 1.18 : subtotal,
          tipoDeMoneda: isDolar ? "USD" : "RD",
        };
      }
      return {
        ...producto,
        precioUnitario: 0,
        total: 0,
        tipoDeMoneda: isDolar ? "USD" : "RD",
        aplicarImpuesto: producto.aplicarImpuesto ?? true,
      };
    });

    datosProductosChange(updatedProducts);
  }, [isDolar, productos]);

  // Handle product changes
  const handleProductoChange = (index, field, value) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][field] = value;

    if (field === "cantidad" || field === "producto") {
      const productoSeleccionado = productos.find(
        (p) => p.nombre === nuevosProductos[index].producto
      );
      if (productoSeleccionado) {
        const costo = isDolar
          ? productoSeleccionado.costoEnDolares
          : productoSeleccionado.costo;
        nuevosProductos[index].precioUnitario = costo;

        const subtotal = nuevosProductos[index].cantidad * costo;
        nuevosProductos[index].total = nuevosProductos[index].aplicarImpuesto
          ? subtotal * 1.18
          : subtotal;
      }
    }

    datosProductosChange(nuevosProductos);
  };

  // Toggle impuesto para un producto específico
  const toggleImpuestoProducto = (index) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index].aplicarImpuesto =
      !nuevosProductos[index].aplicarImpuesto;

    const producto = nuevosProductos[index];
    if (producto.producto) {
      const productInfo = productos.find((p) => p.nombre === producto.producto);
      if (productInfo) {
        const costo = isDolar ? productInfo.costoEnDolares : productInfo.costo;
        const subtotal = producto.cantidad * costo;
        nuevosProductos[index].total = nuevosProductos[index].aplicarImpuesto
          ? subtotal * 1.18
          : subtotal;
      }
    }

    datosProductosChange(nuevosProductos);
  };

  // Add new product
  const agregarProducto = () => {
    if (!productoActual.producto) {
      setError("Debe seleccionar un producto");
      return;
    }

    if (productoActual.cantidad <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    if (productoActual.precioUnitario <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    const nuevosProductos = [...productosSeleccionados, productoActual];
    datosProductosChange(nuevosProductos);
    setProductoActual({
      producto: "",
      cantidad: 1,
      precioUnitario: 0,
      tipoDeMoneda: "RD",
    });
    setError("");
  };

  // Remove product
  const eliminarProducto = (index) => {
    const nuevosProductos = productosSeleccionados.filter(
      (_, i) => i !== index
    );
    datosProductosChange(nuevosProductos);
  };

  // Handle field changes
  const handleChange = (name, value) => {
    if (name === "cliente") {
      setCliente(value);
    } else if (name === "gastoEnvio") {
      setGastoEnvio(value);
    } else if (name === "medioPago") {
      setMedioPago(value);
    } else if (name === "fechavencimiento") {
      setFechavencimiento(value);
    }
    datosFacturaChange(name, value);
  };

  // Manejo del cambio de secuencial
  const handleSecuencialChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setSecuencialNcf("");
      return;
    }

    if (/^\d*$/.test(value)) {
      const truncatedValue = value.slice(0, 8);
      setSecuencialNcf(truncatedValue);
      datosFacturaChange("ncf", `${serieNcf}${tipoNcf}${"00000001"}`);
    }
  };

  // Update NCF when fields change
  useEffect(() => {
    datosFacturaChange(
      "ncf",
      `${serieNcf}${tipoNcf}${secuencialNcf}`
    );
  }, [tipoNcf, serieNcf, secuencialNcf]);

  // Funciones para edición de productos
  const iniciarEdicionProducto = (index) => {
    const producto = productosSeleccionados[index];
    const productoOriginal = productos.find(p => p.nombre === producto.producto);
    
    setEditingProductIndex(index);
    setEditingProductData({
      ...producto,
      costo: productoOriginal?.costo || 0,
      costoEnDolares: productoOriginal?.costoEnDolares || 0
    });
    setIsEditProductModalOpen(true);
  };

  const guardarEdicionProducto = () => {
    const nuevosProductos = [...productosSeleccionados];
    const nuevosProductosCatalogo = [...productos];
    
    // Actualizar el catálogo de productos si cambió el costo
    const productoIndex = nuevosProductosCatalogo.findIndex(
      p => p.nombre === editingProductData.producto
    );
    
    if (productoIndex !== -1) {
      nuevosProductosCatalogo[productoIndex] = {
        ...nuevosProductosCatalogo[productoIndex],
        costo: editingProductData.costo,
        costoEnDolares: editingProductData.costoEnDolares
      };
      
      setProductos(nuevosProductosCatalogo);
      insertarLocalStorage("tablaProductos", nuevosProductosCatalogo);
    }

    // Actualizar el producto en la factura
    const precioUnitario = isDolar ? 
      editingProductData.costoEnDolares : 
      editingProductData.costo;
    
    const subtotal = editingProductData.cantidad * precioUnitario;
    const total = editingProductData.aplicarImpuesto ? subtotal * 1.18 : subtotal;

    nuevosProductos[editingProductIndex] = {
      ...editingProductData,
      precioUnitario,
      total,
      tipoDeMoneda: isDolar ? "USD" : "RD"
    };

    datosProductosChange(nuevosProductos);
    setIsEditProductModalOpen(false);
  };

  const handleEditProductChange = (field, value) => {
    setEditingProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para el modal de producto
  const handleAddNewProduct = async () => {
    // Validaciones
    if (!newProductName || !newProductCost || !newProductType) {
      setProductError("Todos los campos son obligatorios");
      setTimeout(() => {
        setProductError("");
      }, 2000);
      return;
    }

    if (newProductName.length > 30) {
      setProductError("Nombre de producto muy largo");
      setTimeout(() => {
        setProductError("");
      }, 2000);
      return;
    }

    if (productos.some(p => p.nombre === newProductName)) {
      setProductError("Producto ya existe");
      setTimeout(() => {
        setProductError("");
      }, 2000);
      return;
    }

    try {
      // Crear nuevo producto
      const newProduct = await productoService.create({
        nombre: newProductName,
        costo: Number(newProductCost),
        costoEnDolares: Number(newProductCostDollars) || 0,
        tipoproducto: newProductType
      });

      // Actualizar lista de productos
      const updatedProducts = [newProduct, ...productos];
      setProductos(updatedProducts);

      // Si el tipo de producto es nuevo, agregarlo a las opciones
      if (!productTypes.some(t => t.nombre === newProductType)) {
        const newType = await tipoProductoService.create(newProductType);
        const updatedTypes = [...productTypes, newType];
        setProductTypes(updatedTypes);
      }

      // Limpiar y cerrar
      setNewProductName("");
      setNewProductCost("");
      setNewProductCostDollars("");
      setNewProductType("");
      setProductError("");
      setIsProductModalOpen(false);

      // Agregar el nuevo producto directamente a la factura
      const nuevosProductos = [
        ...productosSeleccionados,
        {
          producto: newProductName,
          cantidad: 1,
          precioUnitario: isDolar ? Number(newProductCostDollars) || 0 : Number(newProductCost),
          tipoDeMoneda: isDolar ? "USD" : "RD",
          aplicarImpuesto: true,
          total: isDolar ? 
            (Number(newProductCostDollars) || 0) * 1.18 : 
            Number(newProductCost) * 1.18
        }
      ];
      datosProductosChange(nuevosProductos);
    } catch (error) {
      setProductError(error.message);
      setTimeout(() => {
        setProductError("");
      }, 2000);
    }
  };

  const deleteProductType = async (index) => {
    try {
      const typeToDelete = productTypes[index];
      await tipoProductoService.delete(typeToDelete.id);
      const updatedTypes = productTypes.filter((_, i) => i !== index);
      setProductTypes(updatedTypes);
    } catch (error) {
      setError(error.message);
    }
  };

  // Funciones para el modal de cliente
  async function validarInformacionCliente() {
    limpiarError();

    if (
      camposVacios(
        cedula,
        nombre,
        apellido,
        email,
        direccion,
        telefono,
        celular,
        ciudad
      ) ||
      !validarFormatoEmail(email, regex) ||
      !validarCedula(cedula) ||
      !validarTelefonos(telefono, celular) ||
      !validarCamposLargos(nombre, apellido, direccion, ciudad, email)
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

    try {
      const nuevoCliente = {
        rnc_cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        email: email,
        direccion: direccion,
        ciudad: ciudad,
        telefono: telefono,
        celular: celular
      };

      await clienteService.create(nuevoCliente);
      
      // Refresh client list
      const clientesData = await clienteService.getAll();
      setClientes(clientesData);
      
      setIsModal(false);
      limpiarCamposCliente();
      iniciarPDF();
    } catch (error) {
      setMensajeAlerta(error.message);
      setIsError(true);
      setTimeout(() => {
        setMensajeAlerta("");
        setIsError(false);
      }, 2000);
    }
  }

  function limpiarCamposCliente() {
    setCedula("");
    setNombre("");
    setApellido("");
    setEmail("");
    setDireccion("");
    setCiudad("");
    setTelefono("");
    setCelular("");
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const clientesData = await clienteService.getAll();
      setClientes(clientesData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClienteChange = (event, newValue) => {
    datosFacturaChange("cliente", newValue?.nombre || "");
  };

  const handleCantidadChange = (event) => {
    const cantidad = parseInt(event.target.value) || 0;
    setProductoActual((prev) => ({
      ...prev,
      cantidad,
      total: cantidad * prev.precioUnitario,
    }));
  };

  const handlePrecioChange = (event) => {
    const precio = parseFloat(event.target.value) || 0;
    setProductoActual((prev) => ({
      ...prev,
      precioUnitario: precio,
      total: precio * prev.cantidad,
    }));
  };

  return (
    <>
      {/* MODAL DE AGREGAR CLIENTE */}
      {isModal && (
        <Modal modalNombre={"Cliente"} setIsModal={setIsModal}>
          {isError && (
            <div style={{ marginBottom: "1rem" }} className="alert">
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button
              color="success"
              variant="contained"
              onClick={validarInformacionCliente}
            >
              Agregar Cliente
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL PARA AGREGAR NUEVO PRODUCTO */}
      {isProductModalOpen && (
        <Modal modalNombre="Nuevo Producto" setIsModal={setIsProductModalOpen}>
          {productError && (
            <Alert color="danger" sx={{ mb: 2 }}>{productError}</Alert>
          )}

          <CamposProductos
            nombre={newProductName}
            setNombre={setNewProductName}
            costo={newProductCost}
            setCosto={setNewProductCost}
            costoEnDolares={newProductCostDollars}
            setCostoEnDolares={setNewProductCostDollars}
            tipoProducto={newProductType}
            setTipoProducto={setNewProductType}
            opcionesTipoProducto={productTypes}
            onEliminarTipoProducto={deleteProductType}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddNewProduct}
            >
              Agregar Producto
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL PARA EDITAR PRODUCTO */}
      <Dialog 
        open={isEditProductModalOpen} 
        onClose={() => setIsEditProductModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <FormControl fullWidth>
              <InputLabel>Producto</InputLabel>
              <Select
                value={editingProductData.producto || ""}
                onChange={(e) => handleEditProductChange("producto", e.target.value)}
                label="Producto"
              >
                <MenuItem value="">Seleccione un producto</MenuItem>
                {productos.map((p) => (
                  <MenuItem key={p.id} value={p.nombre}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Cantidad"
              type="number"
              value={editingProductData.cantidad}
              onChange={(e) => handleEditProductChange("cantidad", Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />

            <TextField
              label={`Costo en ${isDolar ? 'Dólares' : 'Pesos'}`}
              type="number"
              value={isDolar ? editingProductData.costoEnDolares : editingProductData.costo}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (isDolar) {
                  handleEditProductChange("costoEnDolares", value);
                } else {
                  handleEditProductChange("costo", value);
                }
              }}
              InputProps={{ inputProps: { min: 0, step: "0.01" } }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={editingProductData.aplicarImpuesto ?? true}
                  onChange={(e) => handleEditProductChange("aplicarImpuesto", e.target.checked)}
                  color="primary"
                />
              }
              label="Aplicar Impuesto 18%"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditProductModalOpen(false)}>Cancelar</Button>
          <Button 
            onClick={guardarEdicionProducto} 
            variant="contained" 
            color="primary"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Sección Cliente */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <FormControl style={{ flex: 1 }}>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option) => option.nombre}
              value={clientes.find((c) => c.nombre === datosFactura.cliente) || null}
              onChange={handleClienteChange}
              renderInput={(params) => (
                <TextField {...params} label="Clientes" required />
              )}
            />
          </FormControl>

          <Button
            onClick={() => setIsModal(true)}
            variant="contained"
            color="success"
            style={{ height: "56px" }}
          >
            Nuevo Cliente
          </Button>
        </div>

        <div style={{ display: "flex" }}>
          {/* Currency Toggle */}
          <FormControlLabel
            control={
              <Checkbox
                size="large"
                checked={isDolar}
                onChange={(e) => onMonedaChange(e.target.checked)}
              />
            }
            label="En Dólares"
          />

          {/* COT Toggle */}
          <FormControlLabel
            control={
              <Checkbox
                size="large"
                checked={datosFactura.isCot}
                onChange={(e) => handleChange("isCot", e.target.checked)}
              />
            }
            label="COT"
          />
        </div>

        {/* Product List */}
        {productosSeleccionados.map((producto, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <FormControl fullWidth>
              <InputLabel>Producto</InputLabel>
              <Select
                value={producto.producto || ""}
                onChange={(e) =>
                  handleProductoChange(index, "producto", e.target.value)
                }
                label="Producto"
              >
                <MenuItem value="">Seleccione un producto</MenuItem>
                {productos.map((p) => (
                  <MenuItem key={p.id} value={p.nombre}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Cantidad"
              type="number"
              value={producto.cantidad}
              onChange={(e) =>
                handleProductoChange(index, "cantidad", Number(e.target.value))
              }
              InputProps={{ inputProps: { min: 1 } }}
            />

            {/* Checkbox de impuesto por producto */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={producto.aplicarImpuesto ?? true}
                  onChange={() => toggleImpuestoProducto(index)}
                  color="primary"
                />
              }
              label="Impuesto 18%"
            />

            {/* Botón de editar */}
            <IconButton
              color="primary"
              onClick={() => iniciarEdicionProducto(index)}
            >
              <EditIcon />
            </IconButton>

            {/* Botón de eliminar */}
            <IconButton
              color="error"
              onClick={() => eliminarProducto(index)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>	
          <Button
            variant="contained"
            color="success"
            onClick={agregarProducto}
            style={{ alignSelf: "flex-start" }}
          >
            Agregar Producto
          </Button>

          <Button
            variant="contained"
            style={{backgroundColor: "yellowgreen"}}
            onClick={() => setIsProductModalOpen(true)}
          >
            Nuevo Producto
          </Button>
        </div>

        {/* NCF Fields */}
        {!datosFactura.isCot && (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel>Serie NCF</InputLabel>
              <Select
                value={serieNcf}
                onChange={(e) => setSerieNcf(e.target.value)}
                label="Serie NCF"
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="M">M</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tipo NCF</InputLabel>
              <Select
                value={tipoNcf}
                onChange={(e) => setTipoNcf(e.target.value)}
                label="Tipo NCF"
              >
                <MenuItem value="01">01</MenuItem>
                <MenuItem value="02">02</MenuItem>
                <MenuItem value="03">03</MenuItem>
                <MenuItem value="04">04</MenuItem>
                <MenuItem value="11">11</MenuItem>
                <MenuItem value="13">13</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        {/* SECUENCIAL / COT */}
        {!datosFactura.isCot ? (
          <TextField
            label="Secuencial"
            value={secuencialNcf}
            type="text"
            onChange={handleSecuencialChange}
            inputProps={{
              maxLength: 8,
              inputMode: "numeric",
            }}
          />
        ) : (
          <TextField
            label="COT"
            value={datosFactura.cot}
            type="text"
            onChange={(e) => handleChange("cot", e.target.value)}
            inputProps={{
              maxLength: 8,
              inputMode: "numeric",
            }}
          />
        )}

        {/* Due Date */}
        <FormControl fullWidth>
          <TextField
            label="Fecha Vencimiento"
            type="date"
            value={fechavencimiento || ""}
            onChange={(e) => handleChange("fechavencimiento", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>

        {/* Shipping Cost */}
        <TextField
          label="Gasto de Envío (opcional)"
          type="text"
          value={gastoEnvio}
          onChange={(e) => {
            if(isNaN(e.target.value)) return;
            handleChange("gastoEnvio", Number(e.target.value))  
          }}
        />

        {/* Payment Method */}
        <FormControl fullWidth>
          <InputLabel>Medio de pago</InputLabel>
          <Select
            value={medioPago || ""}
            onChange={(e) => handleChange("medioPago", e.target.value)}
            label="Medio de pago"
          >
            <MenuItem value="">Seleccione un método</MenuItem>
            <MenuItem value="Efectivo">Efectivo</MenuItem>
            <MenuItem value="Transferencia">Transferencia</MenuItem>
            <MenuItem value="Tarjeta">Tarjeta</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
          </Select>
        </FormControl>

        {/* Comments */}
        <FormControl fullWidth>
          <TextArea
            value={datosFactura.comentarios || ""}
            placeholder="Comentarios (opcional)"
            minRows={3}
            onChange={(e) => handleChange("comentarios", e.target.value)}
          />
        </FormControl>

        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={onGenerarPDF}
            color="success"
            variant="contained"
            fullWidth
            size="large"
          >
            Generar Factura
          </Button>
        </div>
      </div>
    </>
  );
}