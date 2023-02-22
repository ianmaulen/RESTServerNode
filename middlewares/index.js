const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validar-campos');
const validarRoles = require('../middlewares/validar-roles');

module.exports = {
  ...validarCampos,
  ...validarRoles,
  ...validarJWT
}