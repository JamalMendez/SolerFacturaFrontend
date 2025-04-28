import { useEffect, useState } from "react";

export default function useModal(){
    const [isError, setIsError] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState("");
    const [isModalConfirmacion, setIsModalConfirmacion] = useState({
        active: false,
        id: null,
      });

    useEffect(() => {
        //MENSAJE ERROR
        if (isError) {
          const timer = setTimeout(() => {
            setMensajeAlerta("");
            setIsError(false);
          }, 2000);
          return () => clearTimeout(timer);
        }
      }, [isError]);

      //CANCELAR ELIMINACION
      function cancelarEliminacion() {
        setIsModalConfirmacion({ active: false, id: null });
      }

    return [isError, setIsError, mensajeAlerta, setMensajeAlerta, isModalConfirmacion, setIsModalConfirmacion, cancelarEliminacion]
}