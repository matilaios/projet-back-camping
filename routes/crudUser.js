const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");


// route creation utilisateur entre le code et la BDD - FONCTIONNE
router.post("/createUser", async (req, res) => {
  const { nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); 

  const insertUser =
    "INSERT INTO users (nom, prenom, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays) VALUES (?,?,?,?,?,?,?,?,?,?);";
  bdd.query(insertUser, [nom, prenom, dateNaissance, mail, hashedPassword, telephone, adresse, codePostal, ville, pays], (error) => {
    if (error) throw error;
    res.send("Utilisateur créé avec succès !");
    // res.redirect('http://localhost:5173/createUser');
  });
});

// route pour comparer le mot de passe entré par l'utilisateur avec celui enregistré dans la BDD - FONCTIONNE
router.post("/loginUser", (req, res) => {
  const { mail, password } = req.body;

  // Vérification des données envoyées
  if (!mail || !password) {
    return res.json({ error: "Email et mot de passe sont requis." });
  }

  const checkUser =
    "SELECT * FROM users WHERE mail = ?;";

  bdd.query(checkUser, [mail], (err, results) => {
    if (err) throw err;
    console.log("Password envoyé : ", password);
    
    if (results.length > 0) {
      
      const user = results[0];
      console.log("Password hashé : ", user.password);

      console.log(user);
      bcrypt.compare(password, user.password, (error, result) => {
        console.log(result);
        
        if (error) throw error;
        if (result) {
          
          const token = jwt.sign({ id: user.idUser, email: user.mail, role: user.role}, "secretkey", {
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

// route lecture des utilisateurs - FONCTIONNE
router.get("/readUser", auth.authentification, (req, res) => {
if (req.role && req.role === false) {
  console.log("vous n'avez pas accès à cette foncitonnalité");
  res.status(403).json({ message: "Vous n'avez pas accès à cette foncitonnalité." });
} else {
  const readUser = "SELECT * FROM users;";
  bdd.query(readUser, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};



});

//route lecteur d'un utilisateur par son ID - FONCTIONNE
router.get("/readUserById/:idUser", auth.authentification, (req, res) => {
  const { idUser } = req.params;
  console.log(idUser);
  console.log(req.role);
  console.log(req.userId);

  
  if ((req.role === 0 && req.userId == idUser) || req.role === 1) {
    const readUser = "SELECT * FROM users WHERE idUser = ?;";
    bdd.query(readUser, [idUser], (error, results) => {
        if (error) {
            console.error("Erreur lors de la requête SQL :", error);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json(results);
    });
} else {
    console.log("Vous n'avez pas accès à cet utilisateur.");
    res.status(403).json({ message: "Vous n'avez pas accès à cet utilisateur." });
}
});

// route mise à jour d'un Tarif par son ID - FONCTIONNE
  // router.post("/updateUser/:idUser", async (req, res) => {
  //   const { idUser } = req.params;
  //   const { nom, prenom, dateNaissance, role, mail, password, telephone, adresse, codePostal, ville, pays } = req.body;
  //   const updateUser = "UPDATE users SET nom = ?, prenom = ?, role=?, dateNaissance= ?, mail = ?, password = ?, telephone = ?, adresse = ?, codePostal = ?, ville = ?, pays = ? WHERE idUser = ?;";
  //   bdd.query(updateUser, [nom, prenom, role, dateNaissance, mail, password, telephone, adresse, codePostal, ville, pays, idUser], (error) => {
  //     if (error) throw error;
  //     res.send("Données mises à jour");
  //   });
  // });




// route suppression des utilisateurs - FONCTIONNE AUSSI AVEC ROLE ACTIF
router.post("/deleteUser/:idUser", auth.authentification, (req, res) => {
  if (req.role = false) {
    return res.status(401).send("Vous n'avez pas les droits pour supprimer un utilisateur");
  }
  const { idUser } = req.params;
  const deleteUser = "DELETE FROM users WHERE idUser = ?;";
  bdd.query(deleteUser, [idUser], (error, results) => {
    if (error) throw error;
    res.json(results);
    // res.redirect('/read.html');
  });
});


// essai route by id avec autorisation seuelemnt si role admin ou si bon id

router.get("/readUserByIdbis/:idUser", (req, res) => {
  const { idUser } = req.params;
  const readUser = "SELECT * FROM users WHERE idUser = ?;";
  bdd.query(readUser, [idUser], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});






router.post("/updateUser/:idUser",  auth.authentification, (req, res) => {
const { idUser } = req.params;
const { nom, prenom, role, dateNaissance, mail, telephone, adresse, codePostal, ville, pays } = req.body;
console.log(req.idUser);
console.log(req.role);
console.log(req.body);
 let queryParams= [];
  // let bdd.query(updateUser, [nom, prenom, role, dateNaissance, mail, telephone, adresse, codePostal, ville, pays, idUser], (error) => {
  if (req.role === false) {
    console.log("vous n aurez pas accès aux modifications du rôle");
    updateUser = "UPDATE users SET nom = ?, prenom = ?, dateNaissance= ?, mail = ?, telephone = ?, adresse = ?, codePostal = ?, ville = ?, pays = ? WHERE idUser = ?;";
   queryParams = [nom, prenom, dateNaissance, mail, telephone, adresse, codePostal, ville, pays, idUser ]
  }else{
    console.log("vous pouvez modifier meme le role");
    updateUser = "UPDATE users SET nom = ?, prenom = ?, role=?, dateNaissance= ?, mail = ?, telephone = ?, adresse = ?, codePostal = ?, ville = ?, pays = ? WHERE idUser = ?;";
    queryParams = [nom, prenom, role, dateNaissance, mail, telephone, adresse, codePostal, ville, pays, idUser ]
  }
  bdd.query(updateUser, queryParams, (error, results) => {
    if (error){
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      return res.status(500).send("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
    }
    res.send("Données mises à jour");
  });
});









module.exports = router;
