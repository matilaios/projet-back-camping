const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


// route CREER un type d'hebergement entre le code et la BDD - UNIQUEMENT POUR LES ADMIN
router.post("/createTypeHebergement", auth.authentification, (req, res) => {
    // console.log("votre role est : " + req.role);
    // console.log("id user est : " + req.idUser);
    // console.log("votre email : " + req.mail);
    if (req.role == false) {
      console.log("vous n'avez pas accès à cette fonctionnalité");
      return res
        .status(403)
        .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
    } else {
      const { nom, description, capacite, idTarif } = req.body;
      const insertTypeHebergement = "INSERT INTO type_hebergement (nom, description, capacite, idTarif ) VALUE (?,?,?,?);";
      bdd.query(insertTypeHebergement,[nom, description, capacite, idTarif],(error, result) => {
          if (error) {
            return res.status(500).send("Une erreur s'est produite.");
          }
          console.log(result);
          return res.send("Nouveau type d'hebergement ajouté");
        }
      );
    }
  });

  // route pour METTRE A JOUR UN type d'hebergement - UNIQUEMENT POUR LES ADMIN
router.post("/updateTypeHebergementById/:idType", auth.authentification, (req,res)=>{
    console.log("votre role est : " + req.role);
    console.log("id user est : " + req.idUser);
    console.log("votre email : " + req.mail);
    const {idType}=req.params;
    console.log("la tache à modifier est : " + idType);
    
    const {nom, description, capacite, idTarif} = req.body;
    if (req.role == false) {
      console.log("vous n'avez pas accès à cette fonctionnalité");
      return res
        .status(403)
        .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
    } else {
    const updateTypeHebergementById = "UPDATE type_hebergement SET nom=?, description=?,capacite=?, idTarif=? WHERE idType=?;";
      bdd.query(updateTypeHebergementById, [nom, description, capacite, idTarif, idType], (error, result)=>{
        if (error) throw error;
        res.send("Données mises à jour");
      });
  };
  });
  






// route lecture des type d' hebergements
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
    const readHebergementById = "SELECT th.idTYPE, th.nom AS nom_hebergement, th.description AS description_hebergement, th.capacite AS capacite_hebergement, p.nom AS nom_photo, p.image FROM type_hebergement th LEFT JOIN photo p ON th.idTYPE = p.idTYPE;";
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