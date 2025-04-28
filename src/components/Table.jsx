import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ActionButtons from "./ActionButtons";

// NORMALIZAR EL NOMBRE DE LAS COLUMNAS
const normalizeKey = (str) =>
  str.toLowerCase().replace(/\s+/g, "").replace(/[^\w]/g, "");

export default function ColumnGroupingTable({
  columnas,
  data,
  setIsModalConfirmacion,
  onShowModal,
  pagina,
}) {
  const columns = [
    ...columnas.map((col, i) => ({
      id: normalizeKey(col),
      label: col,
      minWidth: i === 0 ? 40 : 100,
      align: "left",
    })),
    columnas.some((e) => e === "Secuencia")
      ? ""
      : { id: "acciones", label: "Acciones", minWidth: 70, align: "center" },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "95%" }}>
      <TableContainer sx={{ maxHeight: 420 }}>
        <Table stickyHeader aria-label="sticky table">
          <thead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 57,
                    minWidth: column.minWidth,
                    color: "green",
                    fontWeight: 700,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </thead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    if (column.id === "acciones") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {/* EDITAR Y ELIMINAR BUTTONS */}
                          <ActionButtons
                            index={index}
                            row={row}
                            onShowModal={() => onShowModal(row.id)}
                            setIsModalConfirmacion={setIsModalConfirmacion}
                            pagina={pagina}
                          />
                        </TableCell>
                      );
                    }
                    let value =
                      row[column.id] !== undefined ? row[column.id] : "";
                    value = column.id === "pesord" ? row["costo"] : value;
                    value =
                      column.id === "dolaresus" ? row["costoEnDolares"] : value;
                    return (
                      <TableCell
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "45px",
                        }}
                        key={column.id}
                        align={column.align}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
