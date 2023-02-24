const { response, request } = require("express");
const { Categoria } = require('../models')

// crear Categoria
const crearCategoria = async(req, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    
    const categoriaDB = await Categoria.findOne({nombre})
    
    if( categoriaDB ) {
      return res.status(400).json({
        msg: `La categoria ${nombre} ya existe`
      })
    }
    
    const data = {
      nombre,
      usuario: req.usuario._id
    }
    
    const categoria = new Categoria( data );
    await categoria.save();

    res.status(201).json({
      categoria
    })
    
  } catch (error) {
    res.json({msg: error})
  }
}

// obtenerCategorias - paginado - total - populate (mongoose)
const obtenerCategoria = async(req = request, res = response) => {
  
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .populate('usuario', 'nombre')
  ]);

  res.json({
    total,
    categorias
  })
}

// obtenerCategoria - populate (mongoose)
const obtenerCategoriaPorID = async(req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id)
    .populate('usuario', 'nombre');

  res.json({
    categoria
  })
}

// actualizarCategoria 
const actualizarCategoria = async(req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
  res.json(categoria);

}

// borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

  res.json(categoria);
}


module.exports = {
  crearCategoria, 
  obtenerCategoria,
  obtenerCategoriaPorID,
  actualizarCategoria,
  borrarCategoria
}