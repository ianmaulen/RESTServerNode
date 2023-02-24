const { Categoria, Role, Usuario, Producto } = require('../models');

const esRolValido =  async(rol = '') => {
  const existeRol = await Role.findOne( {rol} )
  if (!existeRol) {
    throw new Error(`el rol ${rol} no esta registrado en la DB`)
  }
}

const emailExiste = async(correo = '') => {
  const existeCorreo = await Usuario.findOne({ correo });
  if (existeCorreo) {
    throw new Error(`el correo ${correo} ya existe`)
  }
}

const usuarioExistePorId = async( id ) => {
  const existeId = await Usuario.findById(id);
  if (!existeId) {
    throw new Error(`el id ${id} no existe`)
  }
}

const existeCategoria = async(id) => {
  const existeCategoria = await Categoria.findById(id);
  if(!existeCategoria) {
    throw new Error(`la categoria no existe`)
  }
}

const existeProducto = async(id) => {
  const existeProducto = await Producto.findById(id);
  if(!existeProducto) {
    throw new Error(`El producto no existe`)
  }
}

module.exports = {
  esRolValido,
  emailExiste,
  usuarioExistePorId,
  existeCategoria,
  existeProducto
}