const express = require("express");
const bdd = require("../bdd");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");

// route creation equipement
router.post("/creationEquipement", auth.authentification, (req, res) => {
  console.log(req.userMail, req.userId);
  const { nom, description } = req.body;
  const insertStuff =
    "INSERT INTO equipement (nom, description) VALUES (?,?);";
  bdd.query(
    insertStuff,
    [nom, description, req.userId],
    (error, results) => {
      if (error) throw error;
      res.json(results);
      // res.redirect('http://localhost:5173/createUser');
    }
  );
});

// route lecture des equipements
router.get("/lectureEquipement", auth.authentification, (req, res) => {
  const readStuffs = "SELECT * FROM equipement";
  bdd.query(readTasks, [req.userId], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Route pour récupérer les tâches d'un utilisateur connecté
router.get("/equipement", (req, res) => {
  const sql = "SELECT * FROM tasks";
  bdd.query(sql, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// route suppression des utilisateurs
router.delete("/supprEquipement/:idEquipement", (req, res) => {
    const { idEquipement } = req.params;
  
    const deleteEquipement = "DELETE FROM tasks WHERE idEquipement = ?;";
    bdd.query(deleteEquipement, [idEquipement], (error, results) => {
      if (error) throw error;
      res.json(results);
      // res.redirect('/read.html');
    });
  });

// route pour accorder un role a un user 
router.put("/donnerDroit/:idUser", (req, res) => {
    const { idUser } = req.params;
    const { droit } = req.body;

    const updateDroit = "UPDATE users SET droit = ? WHERE idUser = ?;";
    bdd.query(updateDroit, [droit, idUser], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});




// // Route pour mettre à jour l'état d'une tâche
// router.get("/tasks", auth.authentification, (req, res) => {
//   const sql = "";
//   if (req.role === "admin") {
//     sql = "SELECT * FROM tasks";
//   } else {
//     sql = "SELECT * FROM tasks WHERE userTask = ?";
//   }

//   bdd.query(sql, [req.userId], (error, results) => {
//     if (error) throw error;
//     res.json(results);
//   });
// });

// // route validation d'une tâche
// router.post("/validateTask/:idTask", (req, res) => {
//   const { idTask } = req.params;
//   const newState = 2;

//   const updateState = "UPDATE tasks SET idState = ? WHERE idTask = ?";
//   bdd.query(updateState, [newState, idTask], (error, results) => {
//     if (error) throw error;
//     res.json({ message: "Task updated successfully", results });
//   });
// });



module.exports = router;
