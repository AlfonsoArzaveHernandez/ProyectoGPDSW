const Historial = require('../models/historial')


//mostrar historial de las visitas favoritas
module.exports.mostrarHistorialFavoritos = (req, res) => {
    Historial.find ({$and:[{'user':req.user.id},{status:'true'}]},(error, historial) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR EL HISTORIAL VISITAS FAVORITAS'
            })
        }
        return res.render('historialFavoritos', {historial:historial});
    })   
 }