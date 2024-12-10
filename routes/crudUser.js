const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// route creation utilisateur entre le code et la BDD
router.post("/createUser", async (req, res) => {
  const { nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays } = req.body;

  const hashedPassword = await bcrypt.hash(password, 5);

  const insertUser =
    "INSERT INTO users (nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays) VALUES (?,?,?,?,?,?,?,?,?,?);";
  bdd.query(insertUser, [nom, prenom, dateNaissance, mail, hashedPassword, telephone, adresse, codePostal, ville, pays], (error) => {
    if (error) throw error;
    res.send("Utilisateur créé avec succès !");
    // res.redirect('http://localhost:5173/createUser');
  });
});

// route pour comparer le mot de passe entré par l'utilisateur avec celui enregistré dans la BDD
router.post("/loginUser", (req, res) => {
  const { mail, password } = req.body;

  // Vérification des données envoyées
  if (!mail || !password) {
    return res.json({ error: "Email et mot de passe sont requis." });
  }

  const checkUser =
    "SELECT idUser,mail, password FROM users WHERE mail = ?;";

  bdd.query(checkUser, [mail], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];
      console.log(user);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          const token = jwt.sign({ id: user.idUser, email: user.mail}, "secretkey", {
            expiresIn: "1h",
          });
          res.json({ token });
        } else {
          res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
      });
    } else {
      res.status(404).send("Utilisateur non trouvé");
    }
  });
});

// Comparer les mots de passe
//         if (passwordUser === user.passwordUser) {
//             return res.send("Connexion réussie"); // RETURN pour arrêter l'exécution
//         } else {
//             return res.send("Mot de passe incorrect"); // RETURN pour arrêter l'exécution
//         }
//     });
// });

// route lecture des utilisateurs
router.get("/readUser", (req, res) => {
  const readUser = "SELECT * FROM users;";
  bdd.query(readUser, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

//route lecteur d'un utilisateur par son ID
router.get("/readUserById/:idUser", (req, res) => {
  const { idUser } = req.params;
  const readUser = "SELECT * FROM users WHERE idUser = ?;";
  bdd.query(readUser, [idUser], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

  // route mise à jour d'un Tarif par son ID
  router.post("/updateUser/:idUser", async (req, res) => {
    const { idUser } = req.params;
    const { nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays } = req.body;
  
    const updateUser = "UPDATE users SET nom = ?, prenom = ?, dateNaissance= ?, mail = ?, password = ?, telephone = ?, adresse = ?, codePostal = ?, ville = ?, pays = ? WHERE idUser = ?,?,?,?,?,?,?,?,?,?;";
    bdd.query(updateUser, [nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays], (error) => {
      if (error) throw error;
      res.send("Données mises à jour");
    });
  });

// route suppression des utilisateurs
router.post("/deleteUser/:idUser", (req, res) => {
  // if (req.role !== "admin") {
  //   return res.status(401).send("Vous n'avez pas les droits pour supprimer un utilisateur");
  // }
  const { idUser } = req.params;

  const deleteUser = "DELETE FROM users WHERE idUser = ?;";
  bdd.query(deleteUser, [idUser], (error, results) => {
    if (error) throw error;
    res.json(results);
    // res.redirect('/read.html');
  });
});

module.exports = router;
