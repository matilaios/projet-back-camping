const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation Saison entre le code et la BDD
router.post("/createSaison", async (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { nom, dateDebut, dateFin } = req.body;
  
    const insertSaison =
      "INSERT INTO Saison (nom, dateDebut, dateFin) VALUES (?,?,?);";
    bdd.query(insertSaison, [nom, dateDebut, dateFin], (error) => {
      if (error) throw error;
      res.send("Nouvelle Saison ajoutee");
    })};
  });

// route lecture des Saisons
router.get("/readSaison", (req, res) => {
    const readSaison = "SELECT * FROM Saison;";
    bdd.query(readSaison, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un Saison par son ID
router.get("/readSaisonById/:idSaison", (req, res) => {
    const { idSaison } = req.params;
    const readSaisonById = "SELECT * FROM Saison WHERE idSaison = ?;";
    bdd.query(readSaisonById, [idSaison], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  // route suppression des utilisateurs
router.post("/deleteSaison/:idSaison", (req, res) => {
    if (req.role !== "admin") {
      return res.status(401).send("Vous n'avez pas les droits pour supprimer un Saison");
    }
    const { idSaison } = req.params;
  
    const deleteSaison = "DELETE FROM Saison WHERE idSaison = ?;";
    bdd.query(deleteSaison, [idSaison], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  module.exports = router;



