const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation Tarif entre le code et la BDD
router.post("/createTarif", async (req, res) => {
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { nom, prix } = req.body;
  
    const insertTarif =
      "INSERT INTO Tarif (nom, prix) VALUES (?,?);";
    bdd.query(insertTarif, [nom, prix], (error) => {
      if (error) throw error;
      res.send("Nouveau tarif ajoute");
    })};
  });

// route LECTURE  des Tarifs - FONCTIONNE
router.get("/readTarif", (req, res) => {
    const readTarif = "SELECT * FROM Tarif;";
    bdd.query(readTarif, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });


//route lecture d'un Tarif par son ID - FONCTIONNE
router.get("/readTarifById/:idTarif", (req, res) => {
    const { idTarif } = req.params;
    const readTarifById = "select tarif.idTarif, tarif.nom, tarif.prix, GROUP_CONCAT(type_hebergement.nom) as HEBERGEMENTS FROM tarif LEFT JOIN type_hebergement ON type_hebergement.idTarif=tarif.idTarif WHERE tarif.idTarif=? GROUP BY tarif.idTarif, tarif.nom, tarif.prix;";
    bdd.query(readTarifById, [idTarif], (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

// route MISE A JOURf par son ID POUR LES ADMIN - FONCTIONNE
router.post("/updateTarifByID/:idTarif",auth.authentification , (req, res) => {
  const { idTarif } = req.params;
  const { nom, prix } = req.body;
  console.log(idTarif);
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    console.log("j'ai les droits");
    const updateTarifById = "UPDATE tarif SET nom=?,prix=? WHERE idTarif=?;"
    console.log("j'ai passé la const update");
    bdd.query(updateTarifById, [nom, prix, idTarif], (error, results) => {
          if (error) throw error;
          res.send("Tarif mis à jour");
      });
  };
});





  // route SUPPRESSION d'un tarif POUR LES ADMIN - FONCITONNE
router.delete("/deleteTarifById/:idTarif", auth.authentification, (req, res) => {
  const { idTarif } = req.params;
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    return res.status(401).send("Vous n'avez pas les droits pour supprimer un Tarif");
  } else {
    const deleteTarifById = "DELETE FROM Tarif WHERE idTarif=?;";
    bdd.query(deleteTarifById, [idTarif], (error, results) => {
      if (error) throw error;
      res.json(results);
    })};

    });
  
  // ROUTE POURLIRE LES TARIFS DES HEBERGEMENTS TYPES POUR LA PAGE TARIF
  router.get('/readAllTarifAllHebergement/', (req,res) => {
  const readAllTarifAllHebergement="SELECT Type_hebergement.idTarif, Type_hebergement.nom AS nomType, type_hebergement.capacite, tarif.nom, tarif.prix FROM type_hebergement INNER JOIN TARIF on type_hebergement.idTarif=tarif.idTarif;";
  bdd.query(readAllTarifAllHebergement, (error,result)=>{
    if (error) throw error;
    res.json(result);
  })
})


  module.exports = router;



