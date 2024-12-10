const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation option entre le code et la BDD
router.post("/createOption", async (req, res) => {
    const { nom, description } = req.body;
  
    const insertOption =
      "INSERT INTO option (nom, description) VALUES (?,?);";
    bdd.query(insertOption, [nom, description], (error) => {
      if (error) throw error;
      res.send("Nouvelle option ajoute");
    });
  });

// route lecture des Options
router.get("/readOption", (req, res) => {
    const readOption = "SELECT * FROM Option;";
    bdd.query(readOption, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un Option par son ID
router.get("/readOptionById/:idOption", (req, res) => {
    const { idOption } = req.params;
    const readOptionById = "SELECT * FROM option WHERE idOption = ?;";
    bdd.query(readOptionById, [idOption], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  // route mise à jour d'un equipement par son ID
  router.post("/updateOption/:idOption", (req, res) => {
    const { idOption } = req.params;
    const { nom, description } = req.body;
  
    // Récupérer les valeurs actuelles de la promo
    const getOption = "SELECT * FROM option WHERE idOption = ?;";
    bdd.query(getOption, [idOption], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send("Option non trouvé");
        }
  
        const currentOption = results[0];
        const updatedNom = nom || currentOption.nom;
        const updatedDescription = description || currentOption.description;
  
        const updateOption = "UPDATE option SET nom = ?, description = ? WHERE idOption = ?;";
        bdd.query(updateOption, [updatedNom, updatedDescription], (error) => {
            if (error) throw error;
            res.send("Option mis à jour");
        });
    });
  });

  // route suppression d'une option
router.post("/deleteOption/:idOption", (req, res) => {
    if (req.role !== "admin") {
      return res.status(401).send("Vous n'avez pas les droits pour supprimer un Option");
    }
    const { idOption } = req.params;
  
    const deleteOption = "DELETE FROM Option WHERE idOption = ?;";
    bdd.query(deleteOption, [idOption], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  module.exports = router;
