import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import UseStorage from "../hooks/UseStorage";

export default function ActionButtons({
  index,
  row,
  onShowModal,
  setIsModalConfirmacion,
  pagina,
}) {
  const navigate = useNavigate();

  const [insertarLocalStorage, retornarLocalStorage] = UseStorage();
  return (
    <div>
      <Button
        variant="contained"
        color="warning"
        size="small"
        onClick={() => {
          if (pagina) {
            insertarLocalStorage("fila-editar", row);
            insertarLocalStorage("editando-fila", true);
            navigate("/creacion-factura");
            return;
          }

          onShowModal(index);
        }}
        startIcon={<EditIcon />}
        style={{ marginRight: "5px", paddingRight: 0 }}
      />
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() =>
          setIsModalConfirmacion({
            active: true,
            id: row.id,
          })
        }
        startIcon={<DeleteIcon />}
        style={{ paddingRight: 0 }}
      />
    </div>
  );
}
