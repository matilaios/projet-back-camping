const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route lecture des hebergements
router.get("/readTypeHebergement", (req, res) => {
    // const readTypeHebergement = "SELECT TYPE_HEBERGEMENT.nom, TYPE_HEBERGEMENT.description, TYPE_HEBERGEMENT.capacite FROM TYPE_HEBERGEMENT;";
    const testHebergPhoto = "SELECT th.idTYPE, th.nom AS nom_hebergement, th.description AS description_hebergement, th.capacite AS capacite_hebergement, p.nom AS nom_photo, p.image FROM type_hebergement th LEFT JOIN photo p ON th.idTYPE = p.idTYPE;"
    bdd.query(testHebergPhoto, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  //route lecture d'un hebergement par son ID
  router.get("/readTypeHebergementById/:idTYPE", (req, res) => {
    const { idTYPE } = req.params;
    const readHebergementById = "SELECT  th.idTYPE,  th.nom AS nom_hebergement, th.description AS description_hebergement, th.capacite AS capacite_hebergement, p.nom AS nom_photo, p.image, e.nom AS nom_equipement, e.description AS description_equipement, e.consommable, e.quantite FROM type_hebergement th LEFT JOIN photo p ON th.idTYPE = p.idTYPE LEFT JOIN equipement_type_hebergement eth ON th.idTYPE = eth.idTYPE LEFT JOIN equipement e ON eth.idEquipement = e.idEquipement WHERE th.idTYPE = ?;";
    bdd.query(readHebergementById, [idTYPE], (error, results) => {
        if (error) {
            console.error("Erreur lors de la requête SQL:", error);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun type d'hébergement trouvé pour cet ID." });
        }
        res.json(results[0]); // On retourne un seul objet
    });
});
  
    module.exports = router;