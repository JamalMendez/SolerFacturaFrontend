import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1";
const CLIENTE_ENDPOINT = `${API_BASE_URL}/cliente`;

const transformCliente = (data) => {
  if (!data) return null;
  return {
    id: data.ID || data.id,
    rnc_cedula: data.RNC_Cedula || data.rnc_cedula,
    nombre: data.Nombre || data.nombre,
    apellido: data.Apellido || data.apellido,
    email: data.Email || data.email,
    direccion: data.Direccion || data.direccion,
    ciudad: data.Ciudad || data.ciudad,
    telefono: data.Telefono || data.telefono,
    celular: data.Celular || data.celular
  };
};

const clienteService = {
  /**
   * Get all clientes
   * @returns {Promise<Array>} Array of clientes
   */
  getAll: async () => {
    try {
      const response = await axios.get(CLIENTE_ENDPOINT);
      return response.data.map(transformCliente).filter(Boolean);
    } catch (error) {
      console.error('Error fetching clientes:', error);
      throw new Error('Error al cargar los clientes');
    }
  },

  /**
   * Create a new cliente
   * @param {Object} cliente - Cliente data
   * @returns {Promise<Object>} Created cliente
   */
  create: async (cliente) => {
    try {
      const response = await axios.post(CLIENTE_ENDPOINT, {
        rnc_cedula: cliente.cedula,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        telefono: cliente.telefono,
        celular: cliente.celular
      });
      return transformCliente(response.data);
    } catch (error) {
      console.error('Error creating cliente:', error);
      throw new Error('Error al crear el cliente');
    }
  },

  /**
   * Update a cliente
   * @param {number} id - ID of the cliente to update
   * @param {Object} cliente - Updated cliente data
   * @returns {Promise<Object>} Updated cliente
   */
  update: async (id, cliente) => {
    try {
      const response = await axios.put(`${CLIENTE_ENDPOINT}/${id}`, {
        rnc_cedula: cliente.cedula,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        telefono: cliente.telefono,
        celular: cliente.celular
      });
      return transformCliente(response.data);
    } catch (error) {
      console.error('Error updating cliente:', error);
      throw new Error('Error al actualizar el cliente');
    }
  },

  /**
   * Delete a cliente by id
   * @param {number} id - ID of the cliente to delete
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      await axios.delete(`${CLIENTE_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting cliente:', error);
      throw new Error('Error al eliminar el cliente');
    }
  }
};

export default clienteService; 