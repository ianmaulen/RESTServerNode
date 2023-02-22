const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, validarRoles } = require('../middlewares');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { validarRoles } = require('../middlewares/validar-roles');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(usuarioExistePorId),
  validarCampos
], usuariosPut );

router.post('/', [
  check('nombre', 'El nombre es obligatorio').notEmpty(),
  check('password', 'El password es obligatorio').notEmpty(),
  check('password', 'El password debe tener mas de 6 caracteres').isLength(6),
  check('correo', 'El correo no es valido').isEmail(),
  // check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom(esRolValido),
  check('correo').custom(emailExiste),
  validarCampos
] ,usuariosPost );

router.delete('/:id', [
  validarJWT,
  // validarAdminRol,
  validarRoles('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id').custom(usuarioExistePorId),
  check('id', 'No es un ID valido').isMongoId()

],usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;