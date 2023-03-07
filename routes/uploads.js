const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, updateCollectionImg, mostrarImg, updateCollectionImgCloudinary } = require('../controllers/uploads');
const { esColeccionValida } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', validarArchivoSubir ,cargarArchivo)

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'El id debe ser un id mongo valido').isMongoId(),
  check('coleccion').custom( c => esColeccionValida(c, ['usuarios', 'productos'])),
  validarCampos
], updateCollectionImgCloudinary)
// ], updateCollectionImg)

router.get('/:coleccion/:id', [], mostrarImg)

module.exports = router