const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');

const validarJWT = async(req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try {

    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const usuario = await Usuario.findById(uid);

    if(!usuario) {
      return res.status(401).json({
        msg: 'Usuario no existe en DB'
      })
    }

    //verificar que uid tiene estado true
    if(!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no valido - usuario con estado false'
      })
    }

    req.usuario = usuario;
    req.uid = uid;

    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: 'Token no valido'
    })
  }

}

module.exports = { validarJWT }