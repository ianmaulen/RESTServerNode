const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, 
  obtenerProducto, 
  obtenerProductoPorID, 
  actualizarProducto,
  borrarProducto, 
  } = require('../controllers/productos');
const { existeProducto } = require('../helpers/db-validators');

// const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, validarRoles } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// crear producto - privado - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('precio', 'Indique el precio del producto').notEmpty(),
  check('categoria', 'La categoria no tiene un id mongo valido').isMongoId(),
  check('categoria', 'La categoria es obligatoria').notEmpty(),
  validarCampos
], crearProducto);

// obtener producto - publico
router.get('/', obtenerProducto);

// obtener producto por id - Publico
router.get('/:id', [
  check('id', `no es un Id valido`).isMongoId(),
  check('id').custom(existeProducto),
  validarCampos
], obtenerProductoPorID);

// actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  check('id', `no es un Id valido`).isMongoId(),
  check('id').custom(existeProducto),
  validarCampos
], actualizarProducto);

// borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  validarRoles('ADMIN_ROLE'),
  check('id', `no es un Id valido`).isMongoId(),
  check('id').custom(existeProducto),
  validarCampos
], borrarProducto);



module.exports = router