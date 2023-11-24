const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const usuarioSchema = new Schema({
telefono: {type: String},
name: {type: String},
password: {type: String},
calle: {type: String},
numeroExt:{type: String},
numeroInt:{type: String},
date:{type:Date, default:Date.now},
role: {type: String}
});

usuarioSchema.methods.encriptarPassword =(password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
usuarioSchema.methods.compararPassword =function (password) {
   return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('usuario', usuarioSchema)