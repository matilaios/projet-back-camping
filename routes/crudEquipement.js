const express = require("express");
const bdd = require("../bdd");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

// route creation equipement
router.post("/creationEquipement", (req, res) => {
  const { nom, description, consommable, quantite } = req.body;
  const insertStuff =
    "INSERT INTO equipement (nom, description,consommable, quantite) VALUES (?,?,?,?);";
  bdd.query(
    insertStuff,
    [nom, description, consommable, quantite],
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
});

// route lecture des equipements
router.get("/lectureEquipement", (req, res) => {
  const readEquipements = "SELECT * FROM equipement";
  bdd.query(readEquipements, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

  // route mise à jour d'un equipement par son ID
  router.post("/updateEquip/:idEquipement", (req, res) => {
    const { idEquipement } = req.params;
    const { nom, description, consommable, quantite } = req.body;
  
    // Récupérer les valeurs actuelles de la promo
    const getEquip = "SELECT * FROM equipement WHERE idEquipement = ?;";
    bdd.query(getEquip, [idEquipement], (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).send("Equipement non trouvé");
        }
  
        const currentEquip = results[0];
        const updatedNom = nom || currentEquip.nom;
        const updatedDescription = description || currentEquip.description;
        const updatedConsommable = consommable || currentEquip.consommable;
        const updatedQuantite = quantite || currentEquip.quantite;
  
        const updateEquipement = "UPDATE equipement SET nom = ?, description = ?, consommable = ?, quantite = ? WHERE idEquipement = ?;";
        bdd.query(updateEquipement, [updatedNom, updatedDescription, updatedConsommable, updatedQuantite, idEquipement], (error) => {
            if (error) throw error;
            res.send("Equipement mis à jour");
        });
    });
  });


// route suppression des equipements
router.delete("/supprEquipement/:idEquipement", (req, res) => {
    const { idEquipement } = req.params;
  
    const deleteEquipement = "DELETE FROM equipement WHERE idEquipement = ?;";
    bdd.query(deleteEquipement, [idEquipement], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });





module.exports = router;
