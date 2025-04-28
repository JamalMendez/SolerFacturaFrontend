import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import SolerImagen from "./Firma Roderick.png";
import SolerSello from "./image.png";
import SolerLogo from './R.electro solar logo vertical.png';

const styles = StyleSheet.create({
  container: {
    margin: "20px auto 0 30px",
    padding: "0px 0px 170px 0px",
    fontSize: "12px",
  },
  encabezado: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    margin: "0px 50px 0px 0px",
  },
  facturaTitle: {
    fontSize: "45px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10px",
    marginRight: "60px",
  },
  columnasHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90vw",
    fontSize: "12px",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  table: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    width: "90vw",
    borderTop: "2px solid black",
    borderRight: "2px solid black",
    borderLeft: "2px solid black",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
    padding: "8px 0",
  },
  cell: {
    width: "20%",
    textAlign: "center",
    fontSize: "12px",
  },
  rectangleComentario: {
    width: "90vw",
    minHeight: "30px",
    maxHeight: "200px",
    marginTop: "0px",
    display: "flex",
  },
  rectangle: {
    width: "90vw",
    minHeight: "50px",
    maxHeight: "50px",
    border: "2px solid black",
    marginTop: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 60px"
  },
  containerRectangle: {
    position: "absolute",
    bottom: "90px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  footerText: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
});

// Función para obtener la fecha actual en formato dd-mm-yyyy
const obtenerFechaActual = () => {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses comienzan en 0
  const año = fecha.getFullYear();
  return `${dia}-${mes}-${año}`;
};

const MyDocument = ({
  datosFactura,
  clienteSeleccionado,
  subtotal,
  total,
  fechavencimiento,
  isCot,
}) => {
  const fechaActual = obtenerFechaActual(); // Obtener la fecha actual

  return (
    <Document>
      <Page size="letter" orientation="portrait" style={styles.container}>
        {/* ENCABEZADO */}
        <View style={styles.encabezado} fixed>
          <Image style={{width: "150px", height: "50px"}} src={SolerLogo}/>
          <View style={{ lineHeight: "1.4", width: "200px", textAlign: "right", fontSize: "6px" }}>
            <Text stroke="4">Roderick Electro Solar R.S.L.</Text>
            <Text stroke="2">Julio Verne No. 25 Gazcue.</Text>
            <Text stroke="2">Santo Domingo, R.D.</Text>
            <Text stroke="2">Telefono: 809-763-0249</Text>
            <Text stroke="2">RNC: 1-32-64245-7</Text>
          </View>
        </View>

        <View fixed><Text style={{width: "93%", height: "1px", backgroundColor: "green", marginTop: "20px", marginBottom: "20px"}}></Text></View>

        <View style={styles.facturaTitle}>
          <Text style={{color: "green", fontSize: "25px"}}>Cliente</Text>
          <Text>{datosFactura.isCot ? "COT" : "Factura"}</Text>
        </View>

        {/* Contenedor Flex */}
        <View style={styles.columnasHeader}>
          {/* COLUMNA IZQUIERDA */}
          <View style={[styles.flex]}>
            <View style={{ gap: "10px", marginRight: "20px" }}>
              <Text>Nombre</Text>
              <Text>Cédula/RNC</Text>
              <Text>Dirección</Text>
              <Text>Ciudad</Text>
              <Text>Teléfono</Text>
            </View>

            <View style={{ gap: "10px", marginRight: "20px" }}>
              <Text style={{ textDecoration: "underline" }}>
                {clienteSeleccionado?.nombre || "_______________"}
              </Text>
              <Text style={{ textDecoration: "underline" }}>
                {clienteSeleccionado?.cedula || "_______________"}
              </Text>
              <Text style={{ textDecoration: "underline" }}>
                {clienteSeleccionado?.direccion || "_______________"}
              </Text>
              <Text style={{ textDecoration: "underline" }}>
                {clienteSeleccionado?.ciudad || "_______________"}
              </Text>
              <Text style={{ textDecoration: "underline" }}>
                {clienteSeleccionado?.telefono || "_______________"}
              </Text>
            </View>
          </View>

          {/* COLUMNA DERECHA */}
          <View style={[styles.flex, { rowGap: "30px", marginTop: "20px" }]}>

            <Text style={{position: "absolute", top: "-20px", fontSize: "20px", left: "10px"}}>{fechaActual}</Text>

            <View style={{marginTop: "20px"}}>

              <Text style={{position: "relative", top: "-5px"}}>{datosFactura.isCot ? "COT:" : "NCF:"}</Text>
              <Text style={{marginRight: "5px", marginTop: "5px"}}>Valida:</Text>
              
            </View>

            <View style={{marginTop: "15px"}}>
              <Text style={{ textDecoration: "underline", height: "20px" }}>
                {datosFactura.isCot ? "COT-" + datosFactura.cot : datosFactura.ncf}
              </Text>
              <Text style={{ textDecoration: "underline", marginTop: "2px" }}>
                {fechavencimiento ? fechavencimiento : "____________"}
              </Text>
            </View>
          </View>
        </View>

        {/* TABLA */}
        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={styles.row}>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>Cantidad</Text>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>
              Descripción
            </Text>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>
              Precio Unitario
            </Text>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>
              ITBIS
            </Text>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>Total</Text>
          </View>

          {/* Filas de la tabla */}
          {datosFactura.productos.map((producto, index) => (
            <View key={index} style={styles.row} wrap={false}>
              <Text style={styles.cell}>{producto.cantidad}</Text>
              <Text style={styles.cell}>{producto.producto}</Text>
              <Text style={styles.cell}>
                {producto.tipoDeMoneda}$
                {Number(producto.precioUnitario || 0).toFixed(2)}
              </Text>
              <Text style={styles.cell}>{producto.aplicarImpuesto ? "Si" : "No"}</Text>
              <Text style={styles.cell}>
                {producto.tipoDeMoneda}${Number(producto.total || 0).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTALES */}
        <View style={[styles.row, { marginTop: "20px", width: "90vw" }]}>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>
            Medio de pago
          </Text>
          <Text style={styles.cell}>
            {datosFactura.medioPago || "_____________"}
          </Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Subtotal</Text>
          <Text style={styles.cell}>
            {datosFactura.productos[0].tipoDeMoneda}$
            {Number(subtotal || 0).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.row, { width: "90vw" }]}>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>Envío</Text>
          <Text style={styles.cell}>
            {datosFactura.productos[0].tipoDeMoneda}$
            {Number(datosFactura.gastoEnvio || 0).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.row, { width: "90vw" }]}>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={[styles.cell, { fontWeight: "bold" }]}>TOTAL</Text>
          <Text style={styles.cell}>
            {datosFactura.productos[0].tipoDeMoneda}$
            {Number(total || 0).toFixed(2)}
          </Text>
        </View>

        {/* COMENTARIOS */}
        <View
          style={{
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            marginTop: "10px",
          }}
          wrap={false}
        >
          <View style={{ gap: "10px", marginRight: "20px", marginTop: "35px" }}>
            <Text>Comentarios:</Text>

            <View style={styles.rectangleComentario}>
              <Text style={{ marginTop: "10px"}}>
                {datosFactura.comentarios}
              </Text>
            </View>
          </View>
        </View>

        {/* Rectángulo con imagen */}
        <View fixed style={{position: "absolute", bottom: "50px", right: "50px", textAlign: "right", width: "300px"}}>
          <View style={{display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", position: "relative", right: "-20px", bottom: "-20px"}}>
            <Image src={SolerSello} style={{width: "100px"}}/>
            <Image src={SolerImagen} style={{width: "170px", height: "35px", position: "relative", bottom: "-5px"}}/>
          </View>
          <Text style={{marginRight: "10px"}}>Roderick Feliz</Text>
        </View>
      </Page>
    </Document>
  );
};
export default MyDocument;
