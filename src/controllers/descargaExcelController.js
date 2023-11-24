const Usuario = require('../models/usuario');
const Visita = require('../models/visita');
const Historial = require('../models/historial')
const XLSX = require('xlsx');


//descargar la tabla de los residentes registrados a excel
module.exports.descargarTabResidentes = (req, res) => {
    var wb = XLSX.utils.book_new(); //new workbook
    Usuario.find ({role:"Residente"},(err, usuario)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(usuario);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/TablaResidentes.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
 }

 //descargar la tabla de las visitas favoritas registradas
module.exports.descargarTabVisiFav = (req, res) => {
    var wb = XLSX.utils.book_new(); //new workbook

    Visita.find ({favorito:'favorito'},(err, visita)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(visita);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/TablaVisiFav.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
 }

 //descargar tabla del historial de las visitas de los residentes 
 module.exports.descargarHistVis = (req, res) => {
    var wb = XLSX.utils.book_new(); //new workbook

    Visita.find ({favorito:{$ne:'favorito'}},(err, visita)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(visita);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/historialVisitas.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
 }

 
 //descargar tabla del historial de las visitas favoritas de los residentes 
 module.exports.descargarHistVisfav = (req, res) => {
    var wb = XLSX.utils.book_new(); //new workbook

    Historial.find ((err, historial)=>{
        if(err){
            console.log(err)
        }else{
            var temp = JSON.stringify(historial);
            temp = JSON.parse(temp);
            var ws = XLSX.utils.json_to_sheet(temp);
            var down = __dirname+'/historialVisitasFav.xlsx'
           XLSX.utils.book_append_sheet(wb,ws,"sheet1");
           XLSX.writeFile(wb,down);
           res.download(down);
        }
    });
 }

