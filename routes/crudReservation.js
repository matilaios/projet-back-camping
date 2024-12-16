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

router.get("/readResaById/:idReservation", auth.authentification, (req,res)=>{
    console.log("votre role est : "+req.role);
    console.log("id user est : " +req.userId);
    console.log("votre email : "+req.userMail);
    const {idReservation}= req.params;
    console.log("numero de la reservation : "+idReservation);
    let queryParams=[];
    // methode pour récupérer l'iduser qui est associé à la réservation
    const readResaById="SELECT users.idUser, users.nom, users.prenom, reservation.idReservation, reservation.dateDebut, reservation.dateFin, reservation.nombreAdulte, reservation.nombreEnfant, reservation.nombreBebe, reservation.nombreVehicule, reservation.prixTotal, hebergement_resa.idHebergement, hebergement.numero FROM reservation INNER JOIN users ON users.idUser=reservation.idUser LEFT JOIN hebergement_resa ON reservation.idReservation=hebergement_resa.idReservation INNER JOIN hebergement ON hebergement.idhebergement=hebergement_resa.idhebergement WHERE reservation.idReservation=?;";
    bdd.query(readResaById, [idReservation], (error, result)=>{
        if (error) throw error;
        // console.log(result[0].idUser);
        const resaUserId =result[0].idUser;
        console.log(resaUserId);
    // affichage du détail de la réservaiton selon les roles
    if (req.role===1){
        // console.log('affichage de la reservation de '+idUser);
        readResaById="SELECT users.idUser, users.nom, users.prenom, reservation.idReservation, reservation.dateDebut, reservation.dateFin, reservation.nombreAdulte, reservation.nombreEnfant, reservation.nombreBebe, reservation.nombreVehicule, reservation.prixTotal, hebergement_resa.idHebergement, hebergement.numero FROM reservation INNER JOIN users ON users.idUser=reservation.idUser LEFT JOIN hebergement_resa ON reservation.idReservation=hebergement_resa.idReservation INNER JOIN hebergement ON hebergement.idhebergement=hebergement_resa.idhebergement WHERE reservation.idReservation=?;";
        queryParams = [idReservation];
     }else if (req.userId===resaUserId){
        console.log('affichage de votre reservation n°'+idReservation);
        readResaById="SELECT users.idUser, users.nom, users.prenom, reservation.idReservation, reservation.dateDebut, reservation.dateFin, reservation.nombreAdulte, reservation.nombreEnfant, reservation.nombreBebe, reservation.nombreVehicule, reservation.prixTotal, hebergement_resa.idHebergement, hebergement.numero FROM reservation INNER JOIN users ON users.idUser=reservation.idUser LEFT JOIN hebergement_resa ON reservation.idReservation=hebergement_resa.idReservation INNER JOIN hebergement ON hebergement.idhebergement=hebergement_resa.idhebergement WHERE reservation.idReservation=? AND users.idUser=?;";
        queryParams=[idReservation,req.userId];
     } else{
        console.log("vous n'avez pas les droits pour cette reservation");
       
        // res.status(400).send ('vous n\'avez pas les droits pour cette reservation');
        // res.redirect('/readResa');
     };
    bdd.query(readResaById, queryParams, (error, result)=>{
        if (error)
        {
            console.log("Erreur lors de l'affichage de la réservation");
            return res.status(500).send("Une erreur est survenue lors de la mise à jour de l'utilisateur.");
        }
        res.send(result);
    })
});
})




// route pour modification de réservation - FONCTIONNE MAIS NE RENVOIE PAS LE BON MESSAGE !!!
router.post("/updateReservation/:idReservation", auth.authentification, (req,res)=>{
    // console.log("idUser : "+req.userId);
    const {idReservation}= req.params;
    // console.log("idreservation : "+idReservation);
    // console.log("votre role est admin si 1 - uutilisateur normal 0 : "+req.role);
    const {dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule} = req.body;
    let updateResa="";
    let queryParams=[]     
    if (req.role === 0 && req.userId) {
        console.log("utilisateur lamba et affichage de sa propre reservation");
        updateResa = "UPDATE reservation SET dateDebut=?,prixTotal=?, dateFin=?, nombreAdulte=?, nombreEnfant=?,nombreBebe=?, nombreVehicule=? WHERE idReservation=? and idUser=?;";
       queryParams = [dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule, idReservation, req.userId ];
      }else if (req.role===1){
        console.log("utilisateur ADMIN - vous pouvez modifier tous les champs de la réservation");
        updateResa = "UPDATE reservation SET dateDebut=?,prixTotal=?, dateFin=?, nombreAdulte=?, nombreEnfant=?,nombreBebe=?, nombreVehicule=? WHERE idReservation=?;";
        queryParams = [dateDebut,prixTotal, dateFin, nombreAdulte, nombreEnfant, nombreBebe, nombreVehicule,idReservation ];
      }
    bdd.query(updateResa, queryParams, (error, result)=>{
        if (error){
            console.error("Erreur lors de la mise à jour :", error);
            // res.status(500).send("Une erreur est survenue lors de la mise à jour de la réservation.");
        }
        console.log(result);
        res.send("reservation mise à jour avec succès");
    });
});

// route delete - FONCTIONNE OK 12/12/24
router.delete("/deleteReservation/:idReservation", auth.authentification, (req,res)=>{
        const {idReservation}= req.params;
    // pour lire iduser de la reservation
    const readResaById="SELECT * from RESERVATION WHERE reservation.idReservation=?;";
    bdd.query(readResaById, [idReservation], (error, result)=>{
        if (error) {
            console.error("Erreur lors de la lecture de la réservation :", error);
            return res.status(500).send("Une erreur est survenue.");
        }
        if (result.length === 0) {
            console.log("Aucune réservation trouvée avec cet ID.");
            return res.status(404).send("Réservation introuvable.");
        }

        console.log(result[0].idUser);
        const resaUserId =result[0].idUser;
        console.log(resaUserId);
    // fin de lecture de iduser de la reservation
    console.log("votre role est : "+req.role);
    console.log("id user est : " +req.userId);
    console.log("votre email : "+req.userMail);
    console.log("numero de la reservation : "+idReservation);
    console.log("votre role est admin si 1 - utilisateur normal 0 : "+req.role);
    let deleteResa="";
    let queryParams=[]     
    // verification des droits
    if (req.role === 0 && req.userId===resaUserId) {
        console.log("utilisateur standard et suppression de sa propre reservation");
        deleteResa = "DELETE FROM reservation WHERE idReservation=? and idUser=?;";
       queryParams = [idReservation, req.userId ];
      }else if (req.role===1){
        console.log("utilisateur ADMIN - vous pouvez surppimer la réservation");
        deleteResa = "DELETE FROM reservation WHERE idReservation=?;";
        queryParams = [idReservation ];
      }else{
        console.log("vous n'avez pas les droits pour supprimer cette reservation");
        return res.status(403).send("Action non autorisée.");
      }
    //   execution de la requete de suppression
    bdd.query(deleteResa, queryParams, (error, result)=>{

        if (error){
            console.error("Erreur lors de la suppression:", error);
            res.status(500).send("Une erreur est survenue lors de la suppression de la réservation.");
        }
        console.log("resultat de la supression : ",error);
        res.send("suppression avec succès");
    });
});
});


module.exports = router;