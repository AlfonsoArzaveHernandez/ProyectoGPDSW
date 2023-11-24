const mongoose = require('mongoose');
const {Schema} = mongoose;


const historialSchema = new Schema({
    name: {type: String,},
    date_visit: {type: String},
    date_entrada: {type: String},
    date_salida: {type: String},
    type_visit: {type: String},
    code_serv: {type: String},
    comentario: {type: String},
    comentario_salida: {type: String},
    favorito: {type: String},
    direccion_residente: {type: String},
    id_user: {type: String},
    status: {type: Boolean}

    });


    module.exports = mongoose.model('historial', historialSchema)