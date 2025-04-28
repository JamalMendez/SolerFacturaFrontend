import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  zIndex: 2000,
};

export default function ModalConfirmacion({
  setIsModalConfirmacion,
  onEliminarElemento,
  id,
}) {
  return (
    <Modal
      open
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, position: "relative" }}>
        <Typography
          style={{ textAlign: "center" }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          ¿Deseas Eliminar?
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            size="large"
            variant="contained"
            color="error"
            style={{ marginRight: "30px" }}
            onClick={() => {
              setIsModalConfirmacion({ active: false, id: null });
              onEliminarElemento(id);
            }}
          >
            Si
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={() => setIsModalConfirmacion({ active: false, id: null })}
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
