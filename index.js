const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crudUser = require('./routes/crudUser');
const crudStock = require('./routes/crudStock');
const chemin= require('path');
const cors = require('cors');



app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(cors());



app.use(express.static(chemin.join(__dirname, 'front')));

app.use('/', crudUser, crudStock);




app.listen( 3000 , () => {
    console.log('Serveur lancé sur le port 3000');
});