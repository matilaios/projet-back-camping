const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


// route creation hebergement entre le code et la BDD
router.post("/createHebergement", async (req, res) => {
    const { numero, nom, description, type, capacite } = req.body;
  
    const insertHebergement =
      "INSERT INTO hebergement (numero, nom, description, type, capacite) VALUES (?,?,?,?,?);";
    bdd.query(insertHebergement, [numero, nom, description, type, capacite], (error) => {
      if (error) throw error;
      res.send("Nouveau type d'hebergement ajoute");
    });
  });

// route lecture des hebergements
router.get("/readHebergement", (req, res) => {
    const readHebergement = "SELECT * FROM hebergement;";
    bdd.query(readHebergement, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un hebergement par son ID
router.get("/readHebergementById/:idHebergement", (req, res) => {
    const { idHebergement } = req.params;
    const readHebergementById = "SELECT * FROM hebergement WHERE idHebergement = ?;";
    bdd.query(readHebergementById, [idHebergement], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  // route mise à jour d'un equipement par son ID
  router.post("/updateHebergement/:idHebergement", (req, res) => {
    const { idHebergement } = req.params;
    const { numero, nom, description, type, capacite } = req.body;
  
    // Récupérer les valeurs actuelles de la promo
    const getHebergement = "SELECT * FROM hebergement WHERE idHebergement = ?;";
    bdd.query(getHebergement, [idHebergement], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send("Hebergement non trouvé");
        }
  
        const currentHebergement = results[0];
        const updatedNumero = numero || currentHebergement.numero;
        const updatedNom = nom || currentHebergement.nom;
        const updatedDescription = description || currentHebergement.description;
        const updatedType = type || currentHebergement.type;
        const updatedCapacite = capacite || currentHebergement.capacite;
  
        const updateEquipement = "UPDATE hebergement SET numero = ?, nom = ?, description = ?, type = ?, capacite = ? WHERE idHebergement = ?;";
        bdd.query(updateEquipement, [updatedNumero, updatedNom, updatedDescription, updatedType, updatedCapacite, idHebergement], (error) => {
            if (error) throw error;
            res.send("Hebergement mis à jour");
        });
    });
  });

  // route suppression d'un hebergement
router.delete("/deleteHebergement/:idHebergement", (req, res) => {
    // if (req.role !== "admin") {
    //   return res.status(401).send("Vous n'avez pas les droits pour supprimer un hebergement");
    // }
    const { idHebergement } = req.params;
  
    const deleteHebergement = "DELETE FROM hebergement WHERE idHebergement = ?;";
    bdd.query(deleteHebergement, [idHebergement], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  
  module.exports = router;
