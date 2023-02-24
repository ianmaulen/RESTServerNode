const { response, request } = require("express");
const { Producto, Categoria } = require('../models')

// crearProducto
const crearProducto = async(req, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();
    const { precio, descripcion, categoria } = req.body;

    const productoDB = await Producto.findOne({nombre})
 
    if( productoDB ) {
      return res.status(400).json({
        msg: `El producto ${nombre} ya existe`
      });
    };
    
    const data = {
      nombre,
      precio,
      descripcion,
      usuario: req.usuario._id,
      categoria
    }
    
    const producto = new Producto( data );
    await producto.save();

    res.status(201).json({
      msg: 'producto creado satisfactoriamente',
      producto
    })

  } catch (err) {
    res.json({msg: 'error'})
  }
}

// obtenerProducto - paginado - total - populate (mongoose)
const obtenerProducto = async(req = request, res = response) => {
  
  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
  ]);

  res.json({
    total,
    productos
  })
}

// obtenerProductoPorID - populate (mongoose)
const obtenerProductoPorID = async(req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

  res.json({
    producto
  })
}

// actualizarProducto
const actualizarProducto = async(req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if(data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json(producto);

}

// borrarProducto - estado: false
const borrarProducto = async(req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

  res.json(producto);
}


module.exports = {
  crearProducto, 
  obtenerProducto,
  obtenerProductoPorID,
  actualizarProducto,
  borrarProducto
}