const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

//USUARIO////////////////////////////////

// ABRIR Y CERRAR SESIONES DE USUARIO RESIDENTE
passport.serializeUser((usuario, done)=>{
    done(null, usuario.id);
});

passport.deserializeUser(async(id, done)=>{
  const usuario = await Usuario.findById(id);
  done(null, usuario);
});

//AUTENTICAR PARA EL REGISTRO DE USUARIOS RESIDENTE
passport.use('local_registro_usuario', new LocalStrategy({
    usernameField:'telefono',
    passwordField:'password',
    passReqToCallback: true
},async(req,telefono,password,done)=>{
    const usuario = await Usuario.findOne({'telefono':telefono});
    console.log(usuario)

    if(usuario){
        return done(null,false, req.flash('registroMensaje','El usuario que intenta registrar ya existe'));
    }else{
        const nuevoUsuario = new Usuario();
        nuevoUsuario.telefono = telefono;
        nuevoUsuario.calle = req.body.calle;
        nuevoUsuario.numeroInt = req.body.numeroInt;
        nuevoUsuario.numeroExt= req.body.numeroExt;
        nuevoUsuario.name = req.body.name;
        nuevoUsuario.role = req.body.role;
        nuevoUsuario.password = nuevoUsuario.encriptarPassword(password);
        await nuevoUsuario.save();
        done(null,nuevoUsuario);

    }
}));

//AUTENTICAR PARA EL INICIO SE SESION DE RESIDENTE
passport.use('local_inicioSesion_usuario',new LocalStrategy({
    usernameField:'telefono',
    passwordField:'password',
    passReqToCallback: true
}, async(req,telefono,password,done)=>{
    const usuario = await Usuario.findOne({telefono:telefono});
    if (!usuario) {
        return done(null,false,req.flash('inicioSesionMensaje','El usuario al que intentas entrar no existe'));
    }
    if (!usuario.compararPassword(password)) {
        return done(null,false,req.flash('inicioSesionMensaje','La contraseña es incorrecta'));
    }
    return done(null,usuario);
}));

