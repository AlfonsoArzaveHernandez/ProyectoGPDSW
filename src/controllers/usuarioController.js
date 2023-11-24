const Usuario = require('../models/usuario')

//Mostrar residentes registrados
module.exports.mostrarResidentes = (req, res) => {
   Usuario.find ({role:"Residente"},(error, usuario) =>{
       if (error){
           return res.status(500).json({
               message:'ERROR AL MOSTRAR LOS USUARIOS'
           })
       }
       return res.render('mostrar_usuarios', {usuario:usuario});
   })   
}

//mostrar administradores registrados
module.exports.mostrarAdministradores = (req, res) => {
    Usuario.find ({role:"Administrador"},(error, usuario) =>{
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LOS USUARIOS'
            })
        }
        return res.render('mostrar_admins', {usuario:usuario});
    })   
 }

 //desplegar datos de usuario residente para editar
 module.exports.desplegarDatosResidente = (req, res) => {
     Usuario.findById(req.params.id)
     .then((usu)=>{
        res.render('editar_usuario',{usuario:usu});
    })

    .catch((fail)=>{
        res.status(400).send("Error al recuperar informacion"+fail)
    });

 }

 //Actualizar los datos desplegados del usuario residente
 module.exports.actualizarDatosResidente = (req, res)=> {
    var id=req.body.id;
    Usuario.findByIdAndUpdate(id,{
        $set:{
            telefono:req.body.telefono,
            name:req.body.name,
            name:req.body.name,
            calle:req.body.calle,
            numeroExt:req.body.numeroExt,
            numeroInt:req.body.numeroInt
        }
    },{new:true})

.then(()=>{
    res.redirect('/mostrar_usuarios');
})
.catch((fail)=>{
    res.status(400).send("Error al guardar "+fail);
});
 }

 //Borrar residente registrados
 module.exports.borrarResidente = (req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/mostrar_usuarios');
    })
    .catch((fail)=>{
        res.status(400).send("Error al eliminar "+fail);
    })
 }

 //Borrar usuarios admins registrados
 module.exports.borrarAdmin = (req, res)=>{
    var id = req.params.id;
    Usuario.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/mostrar_admins');
    })
    .catch((fail)=>{
        res.status(400).send("Error al eliminar "+fail);
    })
 }

 






