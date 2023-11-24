const mongoose = require('mongoose');
const {mongodb}=require('./llavesbd')


mongoose.connect(mongodb.URI,{})
.then(db => console.log('base de datos conectada'))
.catch(err => console.error(err));
