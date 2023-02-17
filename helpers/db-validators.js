const Role = require('../models/role');
const Usuario = require('../models/user');

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

module.exports = {
  esRolValido,
  emailExiste,
}