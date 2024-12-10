const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation Tarif entre le code et la BDD
router.post("/createTarif", async (req, res) => {
    const { nom, prix } = req.body;
  
    const insertTarif =
      "INSERT INTO Tarif (nom, prix) VALUES (?,?);";
    bdd.query(insertTarif, [nom, prix], (error) => {
      if (error) throw error;
      res.send("Nouveau tarif ajoute");
    });
  });

// route lecture des Tarifs
router.get("/readTarif", (req, res) => {
    const readTarif = "SELECT * FROM Tarif;";
    bdd.query(readTarif, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un Tarif par son ID
router.get("/readTarifById/:idTarif", (req, res) => {
    const { idTarif } = req.params;
    const readTarifById = "SELECT * FROM Tarif WHERE idTarif = ?;";
    bdd.query(readTarifById, [idTarif], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

// route mise à jour d'un Tarif par son ID
router.post("/updateTarif/:idTarif", async (req, res) => {
  const { idTarif } = req.params;
  const { nom, prix } = req.body;

  // Récupérer les valeurs actuelles du tarif
  const getTarif = "SELECT * FROM Tarif WHERE idTarif = ?;";
  bdd.query(getTarif, [idTarif], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
          return res.status(404).send("Tarif non trouvé");
      }

      const currentTarif = results[0];
      const updatedNom = nom || currentTarif.nom;
      const updatedPrix = prix || currentTarif.prix;

      // Mettre à jour le tarif avec les nouvelles valeurs ou les anciennes si non fournies
      const updateTarif = "UPDATE Tarif SET nom = ?, prix = ? WHERE idTarif = ?;";
      bdd.query(updateTarif, [updatedNom, updatedPrix, idTarif], (error) => {
          if (error) throw error;
          res.send("Tarif mis à jour");
      });
  });
});

  // route suppression d'un tarif
router.post("/deleteTarif/:idTarif", (req, res) => {
    if (req.role !== "admin") {
      return res.status(401).send("Vous n'avez pas les droits pour supprimer un Tarif");
    }
    const { idTarif } = req.params;

  
    const deleteTarif = "DELETE FROM Tarif WHERE idTarif = ?;";
    bdd.query(deleteTarif, [idTarif], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  module.exports = router;



