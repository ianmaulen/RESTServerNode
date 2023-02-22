const { request, response } = require("express");

const validarAdminRol = ( req = request, res = response, next ) => {
  
  if( !req.usuario ) {
    return res.status(500).json({
      msg: 'Se quiere verificar el rol sin validar token primero'
    })
  }
  
  const { rol, nombre } = req.usuario;

  if( rol !== 'ADMIN_ROLE' ) {
    return res.status(401).json({
      msg: `El token de ${nombre} no corresponde a un administrador`
    })
  }

  next();
}

const validarRoles = (...roles) => {

  return ((req, res, next) => {
    if( !req.usuario ) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar token primero'
      })
    }

    const { rol, nombre } = req.usuario;

    if( !roles.includes(rol) ) {
      return res.status(401).json({
        msg: `El token de ${nombre} no tiene un rol valido`
      })
    }

    next();

  })
}

module.exports = { validarAdminRol, validarRoles }