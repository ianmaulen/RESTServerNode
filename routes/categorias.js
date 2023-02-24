const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
  obtenerCategoria, 
  obtenerCategoriaPorID, 
  actualizarCategoria, 
  borrarCategoria} = require('../controllers/categorias');
const { existeCategoria, esRolValido } = require('../helpers/db-validators');
const { validarJWT, validarRoles } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// obtener categorias - publico
router.get('/', obtenerCategoria);

// obtener categoria por id - Publico
router.get('/:id', [
  check('id', `no es un Id valido`).isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos
], obtenerCategoriaPorID);

// crear categoria - privado - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria);

// actualizar - privado - cualquier persona con token valido
router.put('/:id', [
  validarJWT,
  check('id', `no es un Id valido`).isMongoId(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id').custom(existeCategoria),
  validarCampos
], actualizarCategoria);

// borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  validarRoles('ADMIN_ROLE'),
  check('id', `no es un Id valido`).isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos
], borrarCategoria);



module.exports = router