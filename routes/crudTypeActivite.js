const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route CREER un type d'activité entre le code et la BDD - UNIQUEMENT POUR LES ADMIN
router.post("/createTypeActivite", auth.authentification, (req, res) => {
  // console.log("votre role est : " + req.role);
  // console.log("id user est : " + req.idUser);
  // console.log("votre email : " + req.mail);
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    return res
      .status(403)
      .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { nom } = req.body;
    const insertTypeActivite = "INSERT INTO type_activite (nom) VALUE (?);";
    bdd.query(insertTypeActivite,[nom],(error, result) => {
        if (error) {
          return res.status(500).send("Une erreur s'est produite.");
        }
        console.log(result);
        return res.send("Nouveau type d'activité ajouté");
      }
    );
  }
});


// route pour AFFICHER les activités
router.get("/readTypeActivites", (req, res) => {
  console.log("votre role est : " + req.role);
  console.log("id user est : " + req.idUser);
  console.log("votre email : " + req.mail);
  const readTypeActivites =
    "SELECT type_activite.idType, type_activite.nom as nomType from type_activite ORDER BY type_activite.idType ASC;";
  bdd.query(readTypeActivites, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});



// route pour AFFICHER UNE activité par son ID 
router.get("/readActiviteById/:idActivite", auth.authentification, (req,res)=>{
    // console.log("votre role est : " + req.role);
    // console.log("id user est : " + req.idUser);
    // console.log("votre email : " + req.mail);
    const {idActivite} = req.params;
    // console.log(idActivite);
    const readActiviteById = "SELECT type_activite.idType, type_activite.nom as nomType, activite.nom, activite.description, activite.prix, activite.typePrix FROM activite INNER JOIN type_activite ON type_activite.idType=activite.idType WHERE activite.idActivite=?;";
    bdd.query(readActiviteById, [idActivite], (error, result)=>{
      if (error) throw error;
      res.json(result);
    });
});



// route pour METTRE A JOUR UNE activité - UNIQUEMENT POUR LES ADMIN
router.post("/updateActiviteById/:idActivite", auth.authentification, (req,res)=>{
  console.log("votre role est : " + req.role);
  console.log("id user est : " + req.idUser);
  console.log("votre email : " + req.mail);
  const {idActivite}=req.params;
  console.log("la tache à modifier est : " + idActivite);
  
  const {nom, description, prix, typePrix, idType} = req.body;
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    return res
      .status(403)
      .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
  const updateActiviteById = "UPDATE activite SET nom=?, description=?,prix=?, typePrix=?, idType=? WHERE idActivite=?;";
    bdd.query(updateActiviteById, [nom, description, prix, typePrix, idType, idActivite], (error, result)=>{
      if (error) throw error;
      res.send("Données mises à jour");
    });
};
});


// route pour SUPPRIMER une activité - UNIQUEMENT POUR LES ADMIN
router.post("/deleteActiviteById/:idActivite", auth.authentification, (req,res)=>{
  console.log("votre role est : " + req.role);
  console.log("id user est : " + req.idUser);
  console.log("votre email : " + req.mail);
  const {idActivite}=req.params;
  console.log("la tache à modifier est : " + idActivite);
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    return res
      .status(403)
      .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
  const deleteActiviteById = "UPDATE activite SET nom=?, description=?,prix=?, typePrix=?, idType=? WHERE idActivite=?;";
    bdd.query(deleteActiviteById, [nom, description, prix, typePrix, idType, idActivite], (error, result)=>{
      if (error) throw error;
      res.send("Données supprimées");
    });
};





});


module.exports = router;