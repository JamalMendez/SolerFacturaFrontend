import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1";
const TIPO_PRODUCTO_ENDPOINT = `${API_BASE_URL}/tipo_producto`;

const transformTipoProducto = (data) => {
  if (!data) return null;
  return {
    id: data.ID || data.id,
    nombre: data.Descripcion || data.descripcion || data.nombre
  };
};

const tipoProductoService = {
  /**
   * Get all tipo_producto items
   * @returns {Promise<Array>} Array of tipo_producto items
   */
  getAll: async () => {
    try {
      const response = await axios.get(TIPO_PRODUCTO_ENDPOINT);
      return response.data.map(transformTipoProducto).filter(Boolean);
    } catch (error) {
      console.error('Error fetching tipo productos:', error);
      throw new Error('Error al cargar los tipos de producto');
    }
  },

  /**
   * Create a new tipo_producto
   * @param {string} descripcion - Description of the tipo_producto
   * @returns {Promise<Object>} Created tipo_producto
   */
  create: async (descripcion) => {
    try {
      const response = await axios.post(TIPO_PRODUCTO_ENDPOINT, {
        descripcion
      });
      return transformTipoProducto(response.data);
    } catch (error) {
      console.error('Error creating tipo producto:', error);
      throw new Error('Error al crear el tipo de producto');
    }
  },

  /**
   * Delete a tipo_producto by id
   * @param {number} id - ID of the tipo_producto to delete
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      await axios.delete(`${TIPO_PRODUCTO_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting tipo producto:', error);
      throw new Error('Error al eliminar el tipo de producto');
    }
  }
};

export default tipoProductoService; 