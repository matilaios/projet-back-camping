const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation Promotion entre le code et la BDD
router.post("/createPromotion", async (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { code, nom, montant } = req.body;
  
    const insertPromotion =
      "INSERT INTO Promotion (code, nom, montant) VALUES (?,?,?);";
    bdd.query(insertPromotion, [code, nom, montant], (error) => {
      if (error) throw error;
      res.send("Nouvelle Promotion ajoute");
    })};
  });

// route lecture des Promotions
router.get("/readPromo", (req, res) => {
    const readPromotion = "SELECT * FROM Promotion;";
    bdd.query(readPromotion, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

//route lecture d'un Promotion par son ID
router.get("/readPromotionById/:idPromo", (req, res) => {
    const { idPromo } = req.params;
    const readPromotionById = "SELECT * FROM Promotion WHERE idPromo = ?;";
    bdd.query(readPromotionById, [idPromo], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  // route mise à jour d'une promo par son ID
router.post("/updatePromo/:idPromo", async (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
  const { idTarif } = req.params;
  const { code, nom, montant } = req.body;

  // Récupérer les valeurs actuelles de la promo
  const getPromo = "SELECT * FROM Tarif WHERE idPromo = ?;";
  bdd.query(getPromo, [idPromo], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
          return res.status(404).send("Tarif non trouvé");
      }

      const currentPromo = results[0];
      const updatedCode = code || currentPromo.code;
      const updatedNom = nom || currentPromo.nom;
      const updatedMontant = montant || currentPromo.montant;

      const updatePromo = "UPDATE promotion SET code = ?, nom = ?, montant = ? WHERE idPromo = ?;";
      bdd.query(updatePromo, [updatedCode, updatedNom, updatedMontant], (error) => {
          if (error) throw error;
          res.send("Promo mis à jour");
      });
  })};
});

  // route suppression des promos
router.post("/deletePromotion/:idPromo", (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    if (req.role !== "admin") {
      return res.status(401).send("Vous n'avez pas les droits pour supprimer un Promotion");
    }
    const { idPromo } = req.params;
  
    const deletePromotion = "DELETE FROM Promotion WHERE idPromo = ?;";
    bdd.query(deletePromotion, [idPromo], (error, results) => {
      if (error) throw error;
      res.json(results);
    })};
  });

  module.exports = router;



