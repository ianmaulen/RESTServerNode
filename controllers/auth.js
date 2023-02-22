const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");
const generarJWT = require("../helpers/generarJWT");

const login = async(req, res = response) => {

  const { correo, password } = req.body;

  try {

    // verificar si email existe
    const usuario = await Usuario.findOne({correo});
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario o Password incorrect - correo'
      })
    }

    // verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario o Password incorrect - estado: false'
      })
    }

    // verificar contraseña
    const validPassword = bcryptjs.compareSync( password, usuario.password );
    if(!validPassword) {
      return res.status(400).json({
        msg: 'Usuario o Password incorrect - password incorrect'
      })
    }

    // generar JWT
    const token = await generarJWT( usuario.id );

    res.json({
      msg: 'login OK',
      usuario,
      token
    })

  } catch (err) {
    
    console.log(err);
    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  
  }

}

module.exports = {
  login
}