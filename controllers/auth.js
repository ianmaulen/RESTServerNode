const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");
const generarJWT = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async( req, res = response ) => {
  const { id_token } = req.body;

  try {
    const {correo, img, nombre} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({correo});

    if (!usuario) {
      const rol = 'USER_ROLE'
      usuario = new Usuario({
        nombre, 
        correo, 
        password: ':P', 
        rol,
        img,
        google: true
      });
      await usuario.save();
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

    const token = await generarJWT( usuario.id );


    res.json({
      msg: 'Todo OK',
      correo, 
      img,
      nombre,
      usuario,
      token
    })
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })
  }
}

module.exports = {
  login,
  googleSignIn
}