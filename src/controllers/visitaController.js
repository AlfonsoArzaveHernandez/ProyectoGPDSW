const Usuario = require('../models/usuario');
const Visita = require('../models/visita');
const qrcode = require('qrcode');
const Historial = require('../models/historial')

//Mostrar historial de visitas sin los favoritos
module.exports.mostrarVisitas = (req, res) => {
    Visita.find ({$and:[{'user':req.user.id},{favorito:{$ne:'favorito'}},{'status':true}]},(error, visita) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LAS VISITAS'
            })
        }
        return res.render('inicio', {visita:visita});
    })   
 }

 //Mostrar visitas favoritas 
 module.exports.mostrarVisitasFavoritas = (req, res) => {
    Visita.find ({$and:[{'user':req.user.id},{favorito:'favorito'}]},(error, visita) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LAS VISITAS'
            })
        }
        return res.render('mostrar_favoritos', {visita:visita});
    })   
 }
 
   

//Recibir y procesar los datos ingresados en la pagina registrar visita y crear Qr
module.exports.recibirDatosVisitas = (req,res)=>{
    const {name,date_visit,type_visit,code_serv,favorito,id}=req.body;
    const newVisit= new Visita ({name,date_visit,type_visit,code_serv,favorito,id});
    newVisit.user = req.user.id;
    newVisit.status = true;
    newVisit.tel_residente= req.user.telefono;
    newVisit.direccion_residente = req.user.calle+' '+req.user.numeroExt+' '+req.user.numeroInt;
    newVisit.save();
    qrcode.toDataURL(newVisit.id,(err,src)=>{
        if (err) console.log(err);
        
        res.render('mostrarQr_visita',{qr_code:src,});
    })
}

//Ver el qr de la visita despues de haber registrado la visita
module.exports.verQrDespues = (req, res)=>{
    var id=req.params.id
    Visita.findById(id)
    .then((vis)=>{

    console.log(vis.name);
    qrcode.toDataURL(vis.id,(err,src)=>{
        if (err) console.log(err);
        res.render('mostrarQr_visita2',{qr_code:src,});
    })
    })

    .catch((fail)=>{
        res.status(400).send("Error al recuperar informacion"+fail)
    });
}
 

 //Desplegar el campo para agendar la fecha nueva para visita favorita
module.exports.desplegarFecha = (req, res)=>{
    Visita.findById(req.params.id)
     .then((vis)=>{
        res.render('agendarFechaFav',{visita:vis});
    })

    .catch((fail)=>{
        res.status(400).send("Error al recuperar informacion"+fail)
    });

}

//Actualizar la fecha desplegada de la visita favorita
module.exports.actualizarFecha = (req, res)=> {
    //Mandar los datos a la coleccion de historial
    const {name,date_visit,type_visit,code_serv}=req.body;
    const newHistorial= new Historial ({name,date_visit,type_visit,code_serv});
    newHistorial.id_user = req.body.id;
    newHistorial.status = true;
    newHistorial.save();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           
    //actualizar la fecha de la visita 
    var id=req.body.id;
    Visita.findByIdAndUpdate(id,{
        $set:{
            name:req.body.name,
            date_visit:req.body.date_visit
        }
        
    },{new:true})
.then(()=>{
    res.redirect('/mostrar_favoritos');
})
.catch((fail)=>{
    
    res.status(400).send("Error al guardar "+fail);
});
 }


 //Mostrar QR visita favorita despues de haberla registrado
 module.exports.verQrFavDespues = (req, res)=>{
    var id=req.params.id
    Visita.findById(id)
    .then((vis)=>{
    console.log(vis.name);
    qrcode.toDataURL(vis.id,(err,src)=>{
        if (err) console.log(err);
        res.render('mostrarQr_visitaFav',{qr_code:src,});
    })
    })

    .catch((fail)=>{
        res.status(400).send("Error al recuperar informacion"+fail)
    });
}