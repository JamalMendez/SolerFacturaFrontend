import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1";
const PRODUCTO_ENDPOINT = `${API_BASE_URL}/producto`;

const transformProducto = (data) => {
  if (!data) return null;
  return {
    id: data.ID || data.id,
    nombre: data.Descripcion || data.descripcion || data.nombre,
    costo: data.Costo || data.costo,
    costoEnDolares: data.CostoEnDolares || data.costoEnDolares || data.costoendolares,
    tipodeproducto: data.TipoProducto || data.tipoproducto || data.tipodeproducto,
    tipoproducto_id: data.TipoProductoID || data.tipoproducto_id || data.tipoproductoId
  };
};

const productoService = {
  /**
   * Get all productos
   * @returns {Promise<Array>} Array of productos
   */
  getAll: async () => {
    try {
      const response = await axios.get(PRODUCTO_ENDPOINT);
      return response.data.map(transformProducto).filter(Boolean);
    } catch (error) {
      console.error('Error fetching productos:', error);
      throw new Error('Error al cargar los productos');
    }
  },

  /**
   * Create a new producto
   * @param {Object} producto - Producto data
   * @returns {Promise<Object>} Created producto
   */
  create: async (producto) => {
    try {
      const response = await axios.post(PRODUCTO_ENDPOINT, JSON.stringify({
        descripcion: producto.nombre,
        costo: Number(producto.costo),
        costoendolares: Number(producto.costoEnDolares),
        tipoproducto: producto.tipoproducto_id
      }));
      return transformProducto(response.data);
    } catch (error) {
      console.error('Error creating producto:', error);
      throw new Error('Error al crear el producto');
    }
  },

  /**
   * Update a producto
   * @param {number} id - ID of the producto to update
   * @param {Object} producto - Updated producto data
   * @returns {Promise<Object>} Updated producto
   */
  update: async (id, producto) => {
    try {
      const response = await axios.put(`${PRODUCTO_ENDPOINT}/${id}`, {
        descripcion: producto.nombre,
        costo: Number(producto.costo),
        costoendolares: Number(producto.costoEnDolares),
        tipoproducto: producto.tipoproducto_id
      });
      return transformProducto(response.data);
    } catch (error) {
      console.error('Error updating producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  },

  /**
   * Delete a producto by id
   * @param {number} id - ID of the producto to delete
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      await axios.delete(`${PRODUCTO_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }
};

export default productoService; 