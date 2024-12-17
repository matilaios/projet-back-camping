const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route lecture des hebergements
router.get("/readTypeHebergement", (req, res) => {
    const readTypeHebergement = "SELECT TYPE_HEBERGEMENT.nom, TYPE_HEBERGEMENT.description, TYPE_HEBERGEMENT.capacite FROM TYPE_HEBERGEMENT;";
    bdd.query(readTypeHebergement, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  module.exports = router;