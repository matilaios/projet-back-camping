const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configuration de Multer pour stocker les fichiers localement
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Dossier où stocker les fichiers
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

  // Route pour uploader un fichier avec un champ nommé 'file'
app.post('/upload', upload.single('file'), (req, res) => {
    // `req.file` contient les informations du fichier uploadé
    console.log(req.file);
  
    if (!req.file) {
      return res.status(400).send('Aucun fichier n\'a été uploadé.');
    }
  
    res.send(`Fichier ${req.file.filename} uploadé avec succès !`);
  });

  app.get('/test', (req, res) => {
    res.send('La route fonctionne !');
  });

  module.exports = router;