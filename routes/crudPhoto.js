const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


// route creation Photo entre le code et la BDD
router.post("/createPhoto", async (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { nom, image } = req.body;
  
    const insertPhoto =
      "INSERT INTO Photo (nom, image) VALUES (?,?);";
    bdd.query(insertPhoto, [nom, image], (error) => {
      if (error) throw error;
      res.send("Nouvelle photo ajoutee");
    })};
  });

// route lecture des Photos
router.get("/readPhoto", (req, res) => {
    const readPhoto = "SELECT * FROM Photo;";
    bdd.query(readPhoto, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un Photo par son ID
router.get("/readPhotoById/:idPhoto", (req, res) => {
    const { idPhoto } = req.params;
    const readPhotoById = "SELECT * FROM Photo WHERE idPhoto = ?;";
    bdd.query(readPhotoById, [idPhoto], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

    // route mise à jour d'une photo par son ID
    router.post("/updatePhoto/:idPhoto", (req, res) => {
      if (req.role == false) {
        console.log("vous n'avez pas accès à cette fonctionnalité");
        res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
      } else {
      const { idPhoto } = req.params;
      const { nom, image } = req.body;
    
          const updatePhoto = "UPDATE photo SET nom = ?, image = ? WHERE idPhoto = ?;";
          bdd.query(updatePhoto, [nom, image, idPhoto], (error) => {
              if (error) throw error;
              res.send("Photo mise à jour");
          })};
      });


  // route suppression d'une photo
router.post("/deletePhoto/:idPhoto", (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    if (req.role !== "admin") {
      return res.status(401).send("Vous n'avez pas les droits pour supprimer un Photo");
    }
    const { idPhoto } = req.params;
  
    const deletePhoto = "DELETE FROM Photo WHERE idPhoto = ?;";
    bdd.query(deletePhoto, [idPhoto], (error, results) => {
      if (error) throw error;
      res.json(results);
    })};
  });

  module.exports = router;
