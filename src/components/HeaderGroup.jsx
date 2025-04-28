import { Button, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderGroup({
  onFiltrarTabla,
  nombreBtn,
  onShowModal,
  onOpcionFiltrada
}) {
  const navigate = useNavigate();
  const [facturaFiltrada, setFacturaFiltrada] = useState("");

  return (
    <div className="header-group">

      {nombreBtn === "Factura" && (
         <FormControl style={{ width: "200px", marginRight: "15px" }} size="small">
         <InputLabel>Filtrar</InputLabel>
         <Select
           value={facturaFiltrada}
           onChange={(e) => {
            onOpcionFiltrada(e.target.value);
            setFacturaFiltrada(e.target.value);
          }}
           label="Filtrar"
         >
           <MenuItem value="">Ninguno</MenuItem>
           <MenuItem value="COT">COT</MenuItem>
           <MenuItem value="NCF">NCF</MenuItem>
         </Select>
       </FormControl>
      )}

      <TextField
        placeholder="Buscar"
        rows={1}
        size="small"
        style={{ marginRight: "15px" }}
        onChange={(e) => onFiltrarTabla(e.target.value)}
      />

      {nombreBtn ? (
        <Button
          size="medium"
          color="success"
          variant="contained"
          onClick={() =>
            nombreBtn === "Factura"
              ? navigate("/creacion-factura")
              : onShowModal()
          }
        >
          Agregar {nombreBtn}
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
