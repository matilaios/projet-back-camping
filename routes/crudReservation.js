const express = require("express");
const bdd = require("../bdd");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");



// route pour création d'une réservation
//  a completer avec les infos que l'on veut rentrer
router.post("/createReservation", auth.authentification, (req,res)=>{

    const {dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule} = req.body;
    const insertResa = "INSERT INTO reservation (dateDebut, dateFin, prixTotal, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule, idUser) VALUES (?,?,?,?,?,?,?,?);";
    bdd.query(insertResa, [dateDebut, dateFin, prixTotal, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule, [req.userId]], (error)=>{
      if (error) throw error;
        res.send("nouvelle reservation créée");
});
});


// route pour afficher toutes les réservations ou les reservation de l'utilisateur connecté
router.get("/readResa", auth.authentification, (req,res)=>{
    console.log("votre role est : "+req.role);
    console.log("id user est : " +req.userId);
    console.log("votre email : "+req.userMail);
    let queryParams=[];
    if (req.role==true){
        console.log('affichage de toutes les reservations');
        readResa="SELECT users.idUser, users.nom, users.prenom, reservation.idReservation, reservation.dateDebut, reservation.dateFin, reservation.nombreAdulte, reservation.nombreEnfant, reservation.nombreBebe, reservation.nombreVehicule, reservation.prixTotal, hebergement_resa.idHebergement, hebergement.numero FROM reservation INNER JOIN users ON users.idUser=reservation.idUser LEFT JOIN hebergement_resa ON reservation.idReservation=hebergement_resa.idReservation INNER JOIN hebergement ON hebergement.idhebergement=hebergement_resa.idhebergement order by reservation.idReservation desc;";
        queryParams = [];
    }else{
        console.log('affichage de vos reservations');
        readResa="SELECT users.idUser, users.nom, users.prenom, reservation.idReservation, reservation.dateDebut, reservation.dateFin, reservation.nombreAdulte, reservation.nombreEnfant, reservation.nombreBebe, reservation.nombreVehicule, reservation.prixTotal, hebergement_resa.idHebergement, hebergement.numero FROM reservation INNER JOIN users ON users.idUser=reservation.idUser LEFT JOIN hebergement_resa ON reservation.idReservation=hebergement_resa.idReservation INNER JOIN hebergement ON hebergement.idhebergement=hebergement_resa.idhebergement WHERE users.idUser=? order by reservation.idReservation desc;";
        queryParams=[req.userId];
    }
    bdd.query(readResa, queryParams, (error, result)=>{
        if (error){
            console.log("Erreur lors de l'affichage de vos réservations");
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
        }
        res.send(result);
    })
    


    
    
})






// route pour modification de réservation
router.post("/updateReservation/:idReservation", auth.authentification, (req,res)=>{
    console.log("idUser : "+req.userId);
    const {idReservation}= req.params;
    console.log("idreservation : "+idReservation);
    const {dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule} = req.body;
    // const updateResa = "UPDATE reservation SET dateDebut=?,prixTotal=?, dateFin=?, nombreAdulte=?, nombreEnfant=?,nombreBebe=?, nombreVehicule=? WHERE idReservation=? and idUser=?;";
    let queryParams=[]     
    if (req.role === false && req.userId) {
        console.log("vous accédez à la modification de votre réservation ");
        updateResa = "UPDATE reservation SET dateDebut=?,prixTotal=?, dateFin=?, nombreAdulte=?, nombreEnfant=?,nombreBebe=?, nombreVehicule=? WHERE idReservation=? and idUser=?;";
       queryParams = [dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule, [idReservation, req.userId] ];
      }else{
        console.log("vous pouvez modifier tous les champs de la réservation");
        updateResa = "UPDATE reservation SET dateDebut=?,prixTotal=?, dateFin=?, nombreAdulte=?, nombreEnfant=?,nombreBebe=?, nombreVehicule=? WHERE idReservation=?;";
        queryParams = [dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule,[idReservation] ];
      }
    bdd.query(updateResa, queryParams, (error, result)=>{
        console.log(dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule, idReservation, req.userId);
        if (error){
            console.error("Erreur lors de la mise à jour :", error);
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de la réservation.");
        }
        console.log("reservation mise a jour avec succès");
        console.log(result);
        res.send("reservation mise à jour avec succès");
    });
    
});



module.exports = router;