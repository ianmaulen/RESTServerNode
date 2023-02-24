const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, 'El estado es obligatorio']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: ' Usuario',
    required: [true, 'El usuario es obligatorio']
  }
});

CategoriaSchema.methods.toJSON = function() {
  const { __v, estado, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}


module.exports = model('Categoria', CategoriaSchema);