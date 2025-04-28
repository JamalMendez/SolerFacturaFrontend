export function obtenerUltimoCOT() {
    const ultimoCOT = localStorage.getItem('ultimoCOT');
    return ultimoCOT ? ultimoCOT : "0";
  }
  
  export function generarSecuencialCOT() {
    const ultimoNumero = parseInt(obtenerUltimoCOT()) || 0;
    const siguienteNumero = ultimoNumero + 1;
    const siguienteCOT = siguienteNumero.toString();
    
    localStorage.setItem('ultimoCOT', siguienteCOT);
    return siguienteCOT;
  }
  
  export function inicializarCOT() {
    if (!localStorage.getItem('ultimoCOT')) {
      localStorage.setItem('ultimoCOT', "0");
    }
  }
  
  export function establecerUltimoCOT(valor) {
    if (/^\d+$/.test(valor)) {
      localStorage.setItem('ultimoCOT', valor);
      return true;
    }
    return false;
  }