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
const chemin= require('path');
const cors = require('cors');



app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(cors());



// app.use(express.static(chemin.join(__dirname, 'front')));

app.use('/campingpong', crudUser, crudEquipement, crudHebergement, crudOption, crudPhoto, crudPromo, crudSaison, crudTarif);
app.use('/crudUser', crudUser);
app.use('/', crudStock);




app.listen( 3000 , () => {
    console.log('Serveur lancé sur le port 3000');
});