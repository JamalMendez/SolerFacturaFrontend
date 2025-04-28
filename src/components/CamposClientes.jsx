import { TextField } from "@mui/material";

export default function CamposClientes({
  cedula,
  setCedula,
  nombre,
  setNombre,
  apellido,
  setApellido,
  email,
  setEmail,
  direccion,
  setDireccion,
  telefono,
  setTelefono,
  celular,
  setCelular,
  ciudad,
  setCiudad,
}) {
  return (
    <div className="textfields-container">
      <TextField
        label="Cédula/RNC"
        type="text"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
        fullWidth
      />

      <TextField
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        fullWidth
      />

      <TextField
        label="Apellido"
        type="text"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      <TextField
        label="Dirección"
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        fullWidth
      />

      <TextField
        label="Ciudad"
        type="text"
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        fullWidth
      />

      <TextField
        label="Teléfono"
        type="number"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        fullWidth
      />

      <TextField
        label="Celular"
        type="number"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        fullWidth
      />
    </div>
  );
}
