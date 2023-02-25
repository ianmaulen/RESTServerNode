const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
  'usuarios',
  'categorias',
  'productos',
  'roles'
];

const buscarUsuarios = async( termino = '', res = response) => {
  
  const esMongoID = ObjectId.isValid(termino);
  if(esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: (usuario)? [usuario] : []
    });
  }

  const regex = new RegExp( termino, 'i');
  const usuarios = await Usuario.find({ 
    $or: [{nombre: regex}, {correo: regex} ],
    $and: [{estado: true}] 
  });
  const registros = await Usuario.countDocuments({ 
    $or: [{nombre: regex}, {correo: regex} ],
    $and: [{estado: true}] 
  });

  res.json({ 
    count: registros,
    results: usuarios 
  });
}

const buscarCategorias = async(termino = '', res) => {
  const esMongoID = ObjectId.isValid(termino);
  if(esMongoID) {
    const categoria = await Categoria.findById(termino)
      .populate('usuario', 'nombre');
    return res.json({
      results: (categoria)? [categoria] : []
    });
  }

  const regex = new RegExp( termino, 'i');
  const categoria = await Categoria.find({ 
    $and: [{nombre: regex}, {estado: true}] 
  }).populate('usuario', 'nombre');
  const registros = await Categoria.countDocuments({ 
    $and: [{nombre: regex}, {estado: true}] 
  });

  res.json({ 
    count: registros,
    results: categoria
  });
}

const buscarProductos = async(termino = '', res) => {
  const esMongoID = ObjectId.isValid(termino);
  if(esMongoID) {
    const producto = await Producto.findById(termino)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
    return res.json({
      results: (producto)? [producto] : []
    });
  }

  const regex = new RegExp( termino, 'i');
  const productos = await Producto.find({ 
    $and: [{nombre: regex}, {estado: true}] 
  }).populate('usuario', 'nombre')
    .populate('categoria', 'nombre');
  const registros = await Producto.countDocuments({ 
    $and: [{nombre: regex}, {estado: true}] 
  });

  res.json({ 
    count: registros,
    results: productos
  });
}

const buscar = (req, res = response) => {

  const { coleccion, termino } = req.params;

  if(!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
    break;

    case 'categorias':
      buscarCategorias(termino, res);
    break;

    case 'productos':
      buscarProductos(termino, res);  
    break;
  
    default:
      res.status(500).json({
        msg: 'Se me le olvido hacer la busqueda'
      })
      break;
  }
}

module.exports = {
  buscar
}