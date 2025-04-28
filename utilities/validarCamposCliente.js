// Variable compartida para el error
export let errorValidacion = {
    mensaje: "",
    hayError: false
  };
  
  // Función para limpiar el error
  export function limpiarError() {
    errorValidacion.mensaje = "";
    errorValidacion.hayError = false;
  }
  
  export function camposVacios(cedula, nombre, apellido, direccion, ciudad) {
    if ([cedula, nombre, apellido, direccion, ciudad].includes("")) {
      errorValidacion.mensaje = "Campos no pueden ir vacíos";
      errorValidacion.hayError = true;
      return true;
    }
    return false;
  }
  
  export function validarFormatoEmail(email, regex) {
    if (email.length != 0 && !regex.test(email)) {
      errorValidacion.mensaje = "Email inválido";
      errorValidacion.hayError = true;
      return false;
    }
    return true;
  }
  
  export function validarCedula(cedula) {

    if (cedula.length > 11 ||
        cedula.length < 9 ||
       cedula.split('').some(num => num === ' ') ||
       cedula.split('').some(num => isNaN(num))
       ) {
      errorValidacion.mensaje = "Cédula inválida";
      errorValidacion.hayError = true;
      return false;
    }

    return true;
  }
  
  export function validarTelefonos(telefono, celular) {
    if (telefono.length != 0 && telefono.length !== 10) {
      errorValidacion.mensaje = "Teléfono inválido";
      errorValidacion.hayError = true;
      return false;
    }

    if (celular.length != 0 && celular.length !== 10) {
      errorValidacion.mensaje = "Celular inválido";
      errorValidacion.hayError = true;
      return false;
    }
    return true;
  }

  export function validarTelefonosExistentes(rows, telefono, celular, idSeleccionado) {
    if (telefono.length != 0) {
      if(rows.filter(row => row.id !== idSeleccionado).some(row => row.telefono.trim() === telefono.trim())){
        errorValidacion.mensaje = "Telefono de cliente ya existe"
        errorValidacion.hayError = true;
        return false;
      }
    }

    if (celular.length != 0) {
      if(rows.filter(row => row.id !== idSeleccionado).some(row => row.celular.trim() === celular.trim())){
        errorValidacion.mensaje = "Celular de cliente ya existe"
        errorValidacion.hayError = true;
        return false;
      }
    }
    return true;
  }

  export function validarCamposLargos(nombre, apellido, direccion, ciudad, email){
    if(nombre.length > 55 || apellido.length > 55){
      errorValidacion.mensaje = "Nombre de cliente muy largo"
      errorValidacion.hayError = true;
      return false;
    }

    if(direccion.length > 55){
      errorValidacion.mensaje = "Direccion de cliente muy larga"
      errorValidacion.hayError = true;
      return false;
    }

    if(ciudad.length > 55){
      errorValidacion.mensaje = "Ciudad de cliente es muy largo"
      errorValidacion.hayError = true;
      return false;
    }

    if(email.length > 55){
      errorValidacion.mensaje = "Email de cliente es muy largo"
      errorValidacion.hayError = true;
      return false;
    }

    return true;
  }

  export function validarClienteExistente(rows, nombre, idSeleccionado){
    console.log(rows)
      console.log('cliente con id: ' + idSeleccionado);
      console.log(rows.filter(row => row.id !== idSeleccionado))
      if(rows.filter(row => row.id !== idSeleccionado).some(row => row.nombre.trim() === nombre.trim())){
        errorValidacion.mensaje = "Nombre de cliente ya existe"
        errorValidacion.hayError = true;
        return false;
      }
    return true;
  }


  export function validarCedulaExistente(rows, cedula, idSeleccionado){
    if(rows.filter(row => row.id !== idSeleccionado).some(row => row.cedula.trim() === cedula.trim())){
      errorValidacion.mensaje = "Cedula de cliente ya existe"
      errorValidacion.hayError = true;
      return false;
    }
  return true;
}