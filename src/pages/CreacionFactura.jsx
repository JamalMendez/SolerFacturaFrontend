import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import "../styles/CreacionFactura.css";
import { pdf } from "@react-pdf/renderer";
import MyDocument from "../PDF/SolerPdf";
import UseStorage from "../hooks/UseStorage";
import CamposFactura from "../components/CamposFactura";

export default function CreacionFactura() {
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const [
    insertarLocalStorage,
    retornarLocalStorage,
    insertarUltimoId,
    retornarUltimoId,
    guardarUltimoSecuencialNCF,
  ] = UseStorage();
  const [error, setError] = useState("");

  const [filaEditar] = useState(retornarLocalStorage("fila-editar"));
  const [editandoFila] = useState(retornarLocalStorage("editando-fila"));
  const tituloDeFactura = editandoFila
    ? "Editando Factura"
    : "Campos de la factura";

  const valorProductosSeleccionados = editandoFila
    ? filaEditar.productos
    : [{ producto: "", cantidad: 1, precioUnitario: 0, tipoDeMoneda: "RD" }];
  const valorDolar = editandoFila ? filaEditar.isDolar : false;
  const valorIsCot = editandoFila ? filaEditar.isCot : false;
  const valorClientes = retornarLocalStorage("tablaClientes") || [];
  const valorProductos = retornarLocalStorage("tablaProductos") || [];
  const valorId = useState(retornarUltimoId("tablaFacturas") || 1);
  const ultimoCot = retornarLocalStorage("ultimoCot") || "1";

  const datosIniciales = {
    descripcion: "",
    precioUnitario: 0,
    total: 0,
    cliente: "",
    productos: [],
    ncf: "",
    cot: ultimoCot,
    secuencial: "",
    gastoEnvio: "",
    medioPago: "",
    fechavencimiento: "",
    isCot: false,
  };

  const [datosFactura, setDatosFactura] = useState(
    editandoFila ? { ...datosIniciales, ...filaEditar } : datosIniciales
  );
  const [productosSeleccionados, setProductosSeleccionados] = useState(
    valorProductosSeleccionados
  );
  const [isDolar, setIsDolar] = useState(valorDolar);
  const [isCot, setIsCot] = useState(valorIsCot);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clientes, setClientes] = useState(valorClientes);
  const productos = valorProductos;
  const [id, setId] = valorId;

  const salirPagina = () => {
    navigate("/");
    insertarLocalStorage("editando-fila", false);
  };

  const datosFacturaChange = useCallback(
    (name, value) => {
      if (name === "cliente") {
        const cliente = clientes.find((c) => c.nombre === value);
        setClienteSeleccionado(cliente || null);
      }
      setDatosFactura((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [clientes]
  );

  const datosProductosChange = useCallback((nuevosProductos) => {
    setProductosSeleccionados(nuevosProductos);
    setDatosFactura((prev) => ({
      ...prev,
      productos: nuevosProductos,
    }));
  }, []);

  const calcularSubtotal = useCallback(() => {
    return datosFactura.productos.reduce(
      (acc, producto) => acc + (producto.total || 0),
      0
    );
  }, [datosFactura.productos]);

  const calcularTotal = useCallback(() => {
    return calcularSubtotal() + Number(datosFactura.gastoEnvio || 0);
  }, [calcularSubtotal, datosFactura.gastoEnvio]);

  const iniciarPDF = useCallback(async () => {
    const blob = await pdf(
      <MyDocument
        datosFactura={datosFactura}
        clienteSeleccionado={clienteSeleccionado}
        subtotal={calcularSubtotal()}
        total={calcularTotal()}
        fechavencimiento={datosFactura.fechavencimiento}
        isCot={isCot}
      />
    ).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    iframeRef.current.src = pdfUrl;
  }, [datosFactura, clienteSeleccionado, calcularSubtotal, calcularTotal]);

  useEffect(() => {
    if (datosFactura.productos.length > 0) {
      iniciarPDF();
    }
  }, [iniciarPDF, datosFactura]);

  const validarDatosPDF = useCallback(() => {

    const { cliente, productos, ncf, cot, fechavencimiento } = datosFactura;

    if(ncf.slice(3) === "00000000"){
      return "Secuencial Invalido"
    }

    if(cot <= 0 || isNaN(cot)){
      return "COT invalido"
    }

    if (ncf.length !== 11) {
      return "NCF No valido";
    }

    if ([cliente, ncf, fechavencimiento].some((field) => !field)) {
      return "Los campos no pueden ir vacíos";
    }

    if (productos.length === 0 || productos.some((p) => !p.producto)) {
      return "Debe agregar al menos un producto válido";
    }

    if (calcularTotal() <= 0) {
      return "El total no puede ser negativo o igual a 0";
    }

    return null;
  }, [datosFactura, calcularTotal]);

  const incrementarSecuencial = useCallback(
    (currentNcf) => {
      console.log(currentNcf)
      const serie = currentNcf.substring(0, 1);
      const tipo = currentNcf.substring(1, 3);
      const currentSecuencial = currentNcf.substring(3);

      const numero = parseInt(currentSecuencial);
      const nuevoNumero = numero + 1;
      const nuevoSecuencial = nuevoNumero.toString().padStart(8, "0");

      const nuevoNcf = `${serie}${tipo}${nuevoSecuencial}`;
      guardarUltimoSecuencialNCF(nuevoSecuencial);
      setDatosFactura((prev) => ({
        ...prev,
        ncf: nuevoNcf,
      }));

      return nuevoNcf;
    },
    [guardarUltimoSecuencialNCF]
  );

  const generarPDF = useCallback(() => {
    const errorValidacion = validarDatosPDF();

    if (errorValidacion) {
      setError(errorValidacion);
      setTimeout(() => setError(""), 2000);
      return;
    }

    const opciones = { year: "numeric", month: "2-digit", day: "2-digit" };

    const facturaActualizada = {
      id: editandoFila ? filaEditar.id : id,
      cliente: datosFactura.cliente,
      productos: datosFactura.productos,
      subtotal: calcularSubtotal(),
      total: calcularTotal(),
      ncf: datosFactura.ncf,
      cot: datosFactura.cot,
      medioPago: datosFactura.medioPago,
      descripcion: datosFactura.comentarios,
      fechacreacion: editandoFila
        ? filaEditar.fechacreacion
        : new Date().toLocaleDateString("sv-SE", opciones),
      fechavencimiento: datosFactura.fechavencimiento,
      gastoEnvio: datosFactura.gastoEnvio,
      isDolar,
      isCot: datosFactura.isCot,
    };

    const facturasExistentes = retornarLocalStorage("tablaFacturas") || [];



    const rowTablaNcf = retornarLocalStorage("tablaNcf") || [];

      rowTablaNcf.unshift({
          tipo: facturaActualizada.ncf.slice(1, 3),
          secuencia: facturaActualizada.ncf.slice(3),
          serie: facturaActualizada.ncf.slice(0, 1), 
          fechadecreacion: new Date().toLocaleDateString("sv-SE", opciones)
        })

      insertarLocalStorage("tablaNcf", rowTablaNcf);

    let nuevasFacturas;

    if (editandoFila) {

      nuevasFacturas = facturasExistentes.map((factura) =>
        factura.id === facturaActualizada.id ? facturaActualizada : factura
      );
    } else {
      nuevasFacturas = [facturaActualizada, ...facturasExistentes];
    }

    insertarLocalStorage("editando-fila", false);

    if (datosFactura.isCot) {
      insertarLocalStorage(
        "ultimoCot",
        (Number(datosFactura.cot) + 1)
      );
    }

    insertarLocalStorage("tablaFacturas", nuevasFacturas);

    let nuevoNcf;
    if (datosFactura.isCot) {
      nuevoNcf = datosFactura.ncf;
    } else {
      nuevoNcf = incrementarSecuencial(datosFactura.ncf);
    }

    if (!editandoFila) {
      const nuevoId = id + 1;
      insertarUltimoId("tablaFacturas", nuevoId);
      setDatosFactura((prev) => ({
        ...prev,
        ncf: nuevoNcf,
      }));
    }

    if (!editandoFila) {
      setDatosFactura({
        descripcion: "",
        precioUnitario: 0,
        total: 0,
        cliente: "",
        productos: [],
        ncf: nuevoNcf,
        gastoEnvio: "",
        medioPago: "",
        fechavencimiento: "",
        comentarios: "",
      });
    }

    navigate("/");
  }, [
    validarDatosPDF,
    id,
    datosFactura,
    calcularSubtotal,
    calcularTotal,
    insertarUltimoId,
    retornarLocalStorage,
    insertarLocalStorage,
    navigate,
    editandoFila,
    filaEditar,
    incrementarSecuencial,
    isDolar,
  ]);

  return (
    <div className="creacion-factura-contenedor">
      <div onClick={salirPagina} className="btn-home">
        <Button color="success" variant="contained">
          Salir
        </Button>
      </div>

      <main className="inputs-factura">
        {error && (
          <Alert className="alert" severity="warning">
            {error}
          </Alert>
        )}

        <h1 style={{ color: "green", marginBottom: "20px" }}>
          {tituloDeFactura}
        </h1>

        <CamposFactura
          datosFactura={datosFactura}
          onGenerarPDF={generarPDF}
          datosFacturaChange={datosFacturaChange}
          clientes={clientes}
          setClientes={setClientes}
          productos={productos}
          productosSeleccionados={productosSeleccionados}
          datosProductosChange={datosProductosChange}
          isDolar={isDolar}
          isCot={isCot}
          onMonedaChange={setIsDolar}
          onCotChange={setIsCot}
          iniciarPDF={iniciarPDF}
          editandoFila={editandoFila}
          filaEditar={filaEditar}
        />
      </main>

      {/* IFRAME DE LA FACTURA */}
      <aside className="visualizacion-factura">
        <iframe
          ref={iframeRef}
          title="Visualización de Factura"
          width="100%"
          height="500px"
          frameBorder="0"
        ></iframe>
      </aside>
    </div>
  );
}
