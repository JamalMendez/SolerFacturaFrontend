import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function CamposProductos({
  nombre,
  setNombre,
  costo,
  costoEnDolares,
  setCostoEnDolares,
  setCosto,
  tipoProducto,
  setTipoProducto,
  opcionesTipoProducto,
  onEliminarTipoProducto
}) {
  return (
    <div className="textfields-container">
      <TextField
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
      />

      <TextField
        label="Costo"
        type="number"
        value={costo}
        onChange={(e) => setCosto(e.target.value)}
        fullWidth
      />

      <TextField
        label="Costo en dolares (opcional)"
        type="number"
        value={costoEnDolares}
        onChange={(e) => setCostoEnDolares(e.target.value)}
        fullWidth
      />

      <Autocomplete
        options={opcionesTipoProducto}
        getOptionLabel={(option) => option?.nombre || ""}
        value={opcionesTipoProducto.find(opt => opt.nombre === tipoProducto) || null}
        onChange={(_, newValue) => {
          setTipoProducto(newValue?.nombre || "");
        }}
        onInputChange={(_, newInputValue) => {
          setTipoProducto(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de producto" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <div
              className="option-type-product"
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <p>{option.nombre}</p>
              <p onClick={() => {
                onEliminarTipoProducto(opcionesTipoProducto.findIndex(opt => opt.id === option.id));
              }}>❌</p>
            </div>
          </li>
        )}
        freeSolo
        fullWidth
      />
    </div>
  );
}