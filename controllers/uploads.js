const { response, request } = require("express");
const fs = require("fs");
const path = require("path");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req = request, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, 'icons')
    res.json({msg: `the file was uploaded with the name: ${nombre}`})    
  } catch (error) {
    res.status(400).json({error})
  }
}

const updateCollectionImg = async(req, res = response) => {
  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un usuario con el id ${id}`})
      }

    break;
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un producto con el id ${id}`})
      }
    break;
  
    default:
      return res.status(500).json({msg: 'No he validado esto'})
  }

  // Limpiar imagenes previas al actualizar 
  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img)
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre;
  await modelo.save();

  res.json({
    modelo
  })
}

const updateCollectionImgCloudinary = async(req, res = response) => {
  const {id, coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un usuario con el id ${id}`})
      }

    break;
    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un producto con el id ${id}`})
      }
    break;
  
    default:
      return res.status(500).json({msg: 'No he validado esto'})
  }

  // Limpiar imagenes previas al actualizar 
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.')
    await cloudinary.uploader.destroy( public_id );
  }

  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload( tempFilePath )
  modelo.img = secure_url;
  await modelo.save();

  res.json(secure_url)

  // res.json({
  //   modelo
  // })
}

const mostrarImg = async(req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un usuario con el id ${id}`})
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo) {
        return res.status(404).json({msg: `No existe un producto con el id ${id}`})
      }
    break;
  
    default:
      return res.status(500).json({msg: 'No he validado esto'})
  }

  if (modelo.img) {
      return res.json(modelo.img);
  }

  res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
}

module.exports = {
  cargarArchivo, 
  updateCollectionImg,
  mostrarImg,
  updateCollectionImgCloudinary
}