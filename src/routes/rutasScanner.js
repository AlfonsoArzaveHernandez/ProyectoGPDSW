const express=require('express');
const res = require('express/lib/response');
const router= express.Router();
const Visita = require('../models/visita');
const Historial = require('../models/historial');
const { findById } = require('../models/visita');


//ruta para desplegar la pagina de iniciar sesion usuario residentes   
router.get('/scanner',(req,res,next)=>{
   
    res.render('scanner')
});

router.post('/buscar',(req,res,next)=>{
    var dato = req.body.contenido;
    date=new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            hora= date.getHours();
            min = date.getMinutes();
            if(month.length=1){
                month = '0'+month;
            }
            if(day.length>=1){
                day = '0'+day;
            }
            sec = date.getSeconds();
            fechaActual= year + "-" + month + "-" + day;
    console.log(fechaActual);
    console.log(dato);

    Visita.findById(dato)
    .then((vis)=>{
        console.log(vis.date_visit);
        if(vis.favorito==='favorito' ){
            Historial.find({id_user:dato})
            .then((hist) =>{
                console.log('estas en las condiciones del historial ');
                if(hist[0].date_visit!==fechaActual ){
                    res.render('errorFecha');
                }else if(hist[0].date_entrada && hist[0].date_salida){
                    res.render('usado');
                }else if(!hist[0].date_entrada){
               res.render('comentarioEntroFav',{visita:vis});
                }else{res.render('salidaFav',{visita:vis});}
            })
            .catch((fail)=>{
                res.status(400).send("Error al recuperar informacion"+fail)
            });
        }else if(vis.date_visit!==fechaActual ){
            res.render('errorFecha');
        }else if(vis.date_entrada && vis.date_salida){
            res.render('usado');
        }else if(!vis.date_entrada){
            res.render('comentarioEntro',{visita:vis});
             }else{res.render('salida',{visita:vis});}
   })
   .catch((fail)=>{
    res.status(400).send("Error al recuperar informacion"+fail)
});
});


//ruta para deplegar la pantalla donde se ven los datos del usuario y para agregar comentario de salida
router.get('/comentarioEntro',(req,res,next)=>{
    res.render('comentarioEntro')
});


//ruta para insetar en la base de datos el comentario y adjunatrle la fecha de entrada
router.post('/comentarioEntro',(req,res,next)=>{
    var id=req.body.id;
    var numero_residente=req.body.tel_residente
    Visita.findByIdAndUpdate(id,{
                $set:{
                    comentario:req.body.comentario,
                    date_entrada:req.body.date_entrada
                }
                
            },{new:true})
            .then(()=>{
                res.redirect("whatsapp://send?text=🔔TU VISITA ENTRO🏡&phone=+52"+numero_residente)

                
            })
            .catch((fail)=>{
            
            res.status(400).send("Error al guardar "+fail);
            });
        })

        
    
//ruta para desplegar la pantalla de autorizar salida de la visita
router.get('/salida',(req,res,next)=>{
    res.render('salida')
});

//ruta para agregar a la abase de datos el comentario de salida y para agregar la fecha de salida
router.post('/salida',(req,res,next)=>{
    var id=req.body.id;
   var numero_residente=req.body.tel_residente
        //si la visita no es favorita ejecuta la funcion para guardar en visitas
            Visita.findByIdAndUpdate(id,{
                $set:{
                    comentario_salida:req.body.comentario_salida,
                    date_salida:req.body.date_salida
                }
                
            },{new:true})
            .then(()=>{
            
                res.redirect("whatsapp://send?text=🔔TU VISITA SALIO🏡&phone=+52"+numero_residente)
            })
            .catch((fail)=>{
            
            res.status(400).send("Error al guardar "+fail);
            });
        })
   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///desplegarla pantalla para comentario entrada de favorito
router.get('/comentarioEntroFav',(req,res,next)=>{
    res.render('comentarioEntroFav')
});

//recibir los datos de comentario entrada de favorito
router.post('/comentarioEntroFav',(req,res,next)=>{
    var id=req.body.id;
    var numero_residente=req.body.tel_residente
    Historial.updateOne({ id_user:id }, {
        $set: {
            comentario:req.body.comentario,
            date_entrada:req.body.date_entrada
        }
    },
    function(error, info) {
        if (error) {
            res.json({
                resultado: false,
                msg: 'No se pudo modificar el historial de favorito',
                err
            });
        } else {
            
            res.redirect("whatsapp://send?text=🔔TU VISITA ENTRO🏡&phone=+52"+numero_residente)
        }
    })
});

///desplegarla pantalla para comentario salida de favorito
router.get('/salidaFav',(req,res,next)=>{
    res.render('salidaFav')
});

//recibir los datos de comentario entrada de favorito
router.post('/salidaFav',(req,res,next)=>{
    var id=req.body.id;
    var numero_residente=req.body.tel_residente
    Historial.updateOne({ id_user:id }, {
        $set: {
            comentario_salida:req.body.comentario_salida,
            date_salida:req.body.date_salida
        }
    },
    function(error, info) {
        if (error) {
            res.json({
                resultado: false,
                msg: 'No se pudo modificar el historial del favorito',
                err
            });
        } else {
            
            res.redirect("whatsapp://send?text=🔔TU VISITA SALIO🏡&phone=+52"+numero_residente)
        }
    })
});



//ruta para deplegar la ventana de error por que ya esta usado el codigo 
router.get('/usado',(req,res,next)=>{
    res.render('usado')
});


//ruta para deplegar la ventana de error por fecha 
router.get('/errorFecha',(req,res,next)=>{
    res.render('errorFecha')
});




module.exports=router
