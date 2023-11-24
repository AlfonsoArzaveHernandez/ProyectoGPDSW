const express=require('express');
const res = require('express/lib/response');
const router= express.Router();
const passport = require('passport');
const usuarioController = require('../controllers/usuarioController'); 
const descargaExcelController = require('../controllers/descargaExcelController'); 
const Usuario = require('../models/usuario');
const visitaController = require('../controllers/visitaController'); 
const Visita = require('../models/visita')
const XLSX = require('xlsx');




//ruta para desplegar la pagina INICIAL
router.get('/',(req,res,next)=>{
res.render('iniciarSesion_usuario');
});

///ADMINISTRADOR///
//ruta para desplegar la pagina de iniciar sesion administrador   
router.get('/iniciarSesion_admin', (req,res,next)=>{
    res.render('iniciarSesion_admin')
});

//Ruta para recibir y procesar los datos ingresados en la pagina iniciar sesion administrador
router.post('/iniciarSesion_admin', passport.authenticate('local_inicioSesion_usuario',{
    successRedirect: '/mostrar_usuarios',
    failureRedirect:'iniciarSesion_admin',
    passReqToCallback: true
}));

//Ruta para desplegar la pagina donde se ve los usuarios de los residentes registrados
router.get('/mostrar_usuarios',autorizar_admin,usuarioController.mostrarResidentes,(req,res,next)=>{
    res.render('mostrar_usuarios')
});

//ruta para desplegar la pagina de crear usuario de administrador
router.get('/registro_admin',(req,res,next)=>{
    res.render('registro_admin');
});


 //ruta para recibir y procesar los datos ingresados en la pagina de crear usuario administrador
 router.post('/registro_admin',passport.authenticate('local_registro_usuario', {
    successRedirect: '/mostrar_usuarios',
    failureRedirect: '/registro_admin',
    passReqToCallback: true
}));


//Ruta para desplegar la pagina de registrar nuevo usuario residentes
router.get('/registro_usuario',autorizar_admin,(req,res,next)=>{
    res.render('registro_usuario')
});

//ruta para recibir y procesar los datos ingresados en la pagina de crear usuario residentes
router.post('/registro_usuario',passport.authenticate('local_registro_usuario', {
    successRedirect: '/mostrar_usuarios',
    failureRedirect: '/registro_usuario',
    passReqToCallback: true
    
}));

//Ruta para desplegar la pagina de mostrar el usuario de residente  a modificar
router.get('/editar_usuario/:id',autorizar_admin,usuarioController.desplegarDatosResidente,(req,res,next)=>{
});

//Ruta para seleccionar y mostrar los datos del residente a modificar 
router.post('/editar_usuario',usuarioController.actualizarDatosResidente,(req,res,next)=>{
});

//Ruta para hacer el borrado de un usuario residente 
router.get('/borrar_residente/:id',usuarioController.borrarResidente,(req,res,next)=>{
});

//Ruta para desplegar la pagina de mostrar adminisdores
router.get('/mostrar_admins',autorizar_admin,usuarioController.mostrarAdministradores,(req,res,next)=>{
    res.render('mostrar_admins')
});

//Ruta para hacer el borrado de un usuario administrador 
router.get('/borrar_administrador/:id',usuarioController.borrarAdmin,(req,res,next)=>{
 
});



//Ruta para desplegar el historial de visitas de los residentes siendo admin
router.get('/historialVisitas_residente/:id', (req,res,next)=>{
    //Mostrar historial de visitas del usuario residente que sea seleccionado desde la pantalla pricipal de admins
    var id = req.params.id;
    Usuario.findById(id);
    console.log('ESTE EL EL ID: ' +id);
    Visita.find ({$and:[{'user':id},{favorito:{$ne:'favorito'}}]},(error, visita) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LAS VISITAS'
            })
        }
        return res.render('historialVisitas_residente', {visita:visita} )
    })   
});

//Ruta para desplegar el historial de visitas favoritas de los residentes siendo admin
router.get('/VisitasFavoritas_residente/:id', (req,res,next)=>{
    //Mostrar historial de visitas del usuario residente que sea seleccionado desde la pantalla pricipal de admins
    var id = req.params.id;
    console.log('ESTE EL EL ID: ' +id)
    Visita.find ({$and:[{'user':id},{favorito:'favorito'}]},(error, visita) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LAS VISITAS'
            })
        }
        return res.render('VisitasFavoritas_residente', {visita:visita})
    })   

});
 
/// DESCARGAS EN EXCEL ///

router.post('/descargarResidentes',descargaExcelController.descargarTabResidentes,(req,res,next)=>{
    
});

router.post('/descargarVisiFav',descargaExcelController.descargarTabVisiFav,(req,res,next)=>{
    
});

router.post('/descargarHistVis/',descargaExcelController.descargarHistVis,(req,res,next)=>{
    
});

router.post('/descargarHistVisFav/',descargaExcelController.descargarHistVisfav,(req,res,next)=>{
    
});




//ruta para salir de la sesion administrador
router.get('/salirSesion_admin', (req,res,next)=>{
    req.logout();
    res.render('iniciarSesion_admin')
});

//Funcion autorizar pantallas despues de inicias sesion
function autorizar_admin(req,res,next){
    if(req.user.role === 'Administrador'){
        next()
    }
     else{
        res.redirect("/iniciarSesion_admin");
    }
}


module.exports=router