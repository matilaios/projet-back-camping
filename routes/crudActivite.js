const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");



// route creation activite entre le code et la BDD
router.post("/createActivite", auth.authentification,  (req, res) => {
    console.log("votre role est : "+req.role);
    console.log("id user est : " +req.idUser);
    console.log("votre email : "+req.mail);
    if (req.role == false) {
      console.log("vous n'avez pas accès à cette fonctionnalité");
      return  res.status(403).json({ message: "Vous n'avez pas accès à cette fonctionnalité." });
    } else {
      const { nom, description, prix, typePrix, idType } = req.body;
      const insertActivite ="INSERT INTO activite (nom, description, prix, typePrix, idType) VALUES (?,?,?,?,?);";
      bdd.query(insertActivite, [nom, description, prix, typePrix, idType], (error, result) => {
        if (error) {
          return  res.status(500).send("Une erreur s'est produite.");
        }
        console.log(result);
        return res.send("Nouvelle activité ajoutée");
      })};
    });

    module.exports = router;