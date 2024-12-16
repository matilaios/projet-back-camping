const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crudUser = require('./routes/crudUser');
const crudEquipement = require('./routes/crudEquipement');
const crudHebergement = require('./routes/crudHebergement');
const crudOption = require('./routes/crudOption');
const crudPhoto = require('./routes/crudPhoto');
const crudPromo = require('./routes/crudPromo');
const crudSaison = require('./routes/crudSaison');
const crudTarif = require('./routes/crudTarif');
const crudReservation = require('./routes/crudReservation');
const crudActivite = require('./routes/crudActivite');

const chemin= require('path');
const cors = require('cors');



app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(cors({
    origin: 'http://localhost:5173', // URL de votre front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}));



// app.use(express.static(chemin.join(__dirname, 'front')));


app.use('/campingpong', crudUser, crudEquipement, crudHebergement, crudOption, crudPhoto, crudPromo, crudSaison, crudTarif, crudReservation, crudActivite );





app.listen( 3000 , () => {
    console.log('Serveur lancé sur le port 3000');
});