const express=require('express');
const res = require('express/lib/response');
const router= express.Router();
const passport = require('passport');
const Visita = require('../models/visita');
const Usuario = require('../models/usuario');
const qrcode = require('qrcode');
const { is } = require('express/lib/request');
const visitaController = require('../controllers/visitaController'); 
const historialController = require('../controllers/historialController');
const Historial = require('../models/historial')




///USUARIO RESIDENTE///

//ruta para desplegar la pagina de iniciar sesion usuario residentes   
router.get('/iniciarSesion_usuario',(req,res,next)=>{
    res.render('iniciarSesion_usuario')
});

//ruta para recibir y procesar los datos ingresados en la pagina iniciar sesion residentes
router.post('/iniciarSesion_usuario', passport.authenticate('local_inicioSesion_usuario',{
    successRedirect: '/inicio',
    failureRedirect:'iniciarSesion_usuario',
    passReqToCallback: true
}));

//ruta para desplegar la pagina de inicio qr residentes   
router.get('/inicio',autorizar_residente,visitaController.mostrarVisitas,(req,res,next)=>{
        res.render('inicio');   
});

//ruta para buscar cuantos visitas con favoritos existen
router.get('/buscarTotal_favoritos'),(req,res,next)=>{
    
}

//ruta para desplegar la pagina de registrar nueva visita
router.get('/registrar_visita',autorizar_residente,(req,res,next)=>{
    Visita.find ({$and:[{'user':req.user.id},{favorito:'favorito'}]},(error, visita) => {
        if (error){
            return res.status(500).json({
                message:'ERROR AL MOSTRAR LAS VISITAS'
            })
        }
        return res.render('registrar_visita', {visita:visita});
    })   
})

//ruta para recibir y procesar los datos ingresados en la pagina registrar visita y crear Qr
router.post('/registrar_visita',visitaController.recibirDatosVisitas,(req,res,next)=>{
});

//ruta para desplegar la pagina de mostrar QR DE NUESTRA VISITA
router.get('/mostrarQr_visita',autorizar_residente,(req,res,next)=>{
    res.render('mostrarQr_visita')
});

//ruta para desplegar la pagina para visualizar mis visitas favoritas
router.get('/mostrar_favoritos',autorizar_residente,visitaController.mostrarVisitasFavoritas,(req,res,next)=>{
    
    res.render('mostrar_favoritos')
});




//ruta para ver el qr de la visita despues de haber registrado la visita
router.get('/mostrarQr_visita2/:id',autorizar_residente,visitaController.verQrDespues,(req,res,next)=>{  
});

//Ruta para desplegar la pantalla donde se desplegar el campo para agendar fecha en favorito
router.get('/agendarFechaFav/:id',autorizar_residente,visitaController.desplegarFecha,(req,res,next)=>{
});

//ruta para recibir los datos del cambio de fecha para la visita favorita
router.post('/agendarFechaFav',visitaController.actualizarFecha,(req,res,next)=>{
    
});


//ruta para ver el qr de la visita favorita despues de haber registrado la visita
router.get('/mostrarQr_visitaFav/:id',autorizar_residente,visitaController.verQrFavDespues,(req,res,next)=>{  
});

//Ruta para mostrar el historial de los favoritos 
router.get('/historialFavoritos',autorizar_residente,historialController.mostrarHistorialFavoritos,(req,res,next)=>{  
});

//ruta para eliminar de manera logica las visitas

router.get('/eliminarLogico/:id',(req,res)=>{
    var id = req.params.id;
    Visita.findByIdAndUpdate(id,{status:false})
    .then(()=>{
        res.redirect('/inicio');
    })
    .catch((fail)=>{
        res.status(400).send("Error al eliminar "+fail);
    })
})

//ruta para eliminar historial favoritos de manera logica
router.get('/eliminarLogicoHistFav/:id',(req,res)=>{
    var id = req.params.id;
    Historial.findByIdAndUpdate(id,{status:false})
    .then(()=>{
        res.redirect('/historialFavoritos');
    })
    .catch((fail)=>{
        res.status(400).send("Error al eliminar "+fail);
    })
})


//ruta para salir de la sesion usuario
router.get('/salirSesion_usuario', (req,res,next)=>{
    req.logout();
    res.render('iniciarSesion_usuario')

});




//Funcion autorizar pantallas despues de iniciar sesion
function autorizar_residente(req,res,next){
    if(req.user.role === 'Residente'){
        next()
    }
     else{res.redirect("/iniciarSesion_usuario");
    }
}

 



module.exports=router