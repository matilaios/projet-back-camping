const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route CREER une activite entre le code et la BDD - UNIQUEMENT POUR LES ADMIN
router.post("/createActivite", auth.authentification, (req, res) => {
  // console.log("votre role est : " + req.role);
  // console.log("id user est : " + req.idUser);
  // console.log("votre email : " + req.mail);
  if (req.role == false) {
    console.log("vous n'avez pas accès à cette fonctionnalité");
    return res
      .status(403)
      .json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
  } else {
    const { nom, description, prix, typePrix, idType } = req.body;
    const insertActivite =
      "INSERT INTO activite (nom, description, prix, typePrix, idType) VALUES (?,?,?,?,?);";
    bdd.query(
      insertActivite,
      [nom, description, prix, typePrix, idType],
      (error, result) => {
        if (error) {
          return res.status(500).send("Une erreur s'est produite.");
        }
        console.log(result);
        return res.send("Nouvelle activité ajoutée");
      }
    );
  }
});


// route pour AFFICHER les activités - INUTILE - ON NE S4EN SERT PAS
router.get("/readActivites", (req, res) => {
  // console.log("votre role est : " + req.role);
  // console.log("id user est : " + req.idUser);
  // console.log("votre email : " + req.mail);
  const readActivites =
    "SELECT type_activite.idType, type_activite.nom as nomType , activite.idActivite, activite.nom FROM activite INNER JOIN type_activite ON type_activite.idType=activite.idType;";
  bdd.query(readActivites, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});



// route pour AFFICHER UNE activité par son ID 
router.get("/readActiviteById/:idActivite", (req,res)=>{
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

// route pour AFIICHER LES ACTIVITES PAR TYPE
router.get("/readActiviteByIdType/:idType", (req,res)=>{
  console.log("je suis au début d ema fonction");
  
    console.log("votre role est : " + req.role);
    console.log("id user est : " + req.idUser);
    console.log("votre email : " + req.mail);
    const {idType} = req.params;
    console.log(idType);
    const readActiviteByIdType ="SELECT type_activite.idType, type_activite.nom as nomType , activite.idActivite, activite.nom AS nomActivite,activite.description, activite.prix, activite.typePrix  FROM activite INNER JOIN type_activite ON type_activite.idType=activite.idType WHERE type_activite.idType=? ORDER BY activite.nom ASC;";
    bdd.query(readActiviteByIdType, [idType], (error, result)=>{
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