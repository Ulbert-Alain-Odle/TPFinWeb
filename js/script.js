//verification de la fin du quiz et du début
let finQuiz = false;

let debutJeu = true;

//les sons du quiz
let sonErreur = new Audio("../son/erreur.mp3");
let sonReussite = new Audio("../son/reussite.mp3");
let sonBrassage = new Audio("../son/brassage.mp3");
let sonFin = new Audio("../son/sonIntro.mp3");
let sonPartie = new Audio("../son/sonParti.mp3");
let sonCarte = new Audio("../son/uneCarte.mp3");

sonErreur.currentTime = 0;
sonReussite.currentTime = 0;

sonPartie.loop = true;
sonFin.loop = true;

//aller chercher la carte de jeu
let carte = document.querySelector(".carte");

//aller chercher la section des choix de réponse
let sectionReponse = document.querySelector("#choixDisponible");

//ecouter les clique sur la carte
carte.addEventListener("click", retournerCarte);

//aller chercher les section
let laSection = document.querySelector("section.centre");

//titre
let titre = document.querySelector("h1");

//numéro de la question ou on est rendu
let noQuestion = 0;

//id pour l'animation du temps
let animTemps;
//score et meilleur score du joueur
let score = 0;
let meilleurScore;

//barre pour le temps
let barreTemps = document.querySelector(".temps");
let posBarre = -100;

//écouter la fin des animation
laSection.addEventListener("animationend", effacerInt);

//aller chercher et écouter les clique pour lancer le jeux
let btnJouer = document.querySelector("h2");
btnJouer.addEventListener("click", relancerQuiz);//relancer quiz permet de s'assurer que toute les valeur son à 0

//desactiver les élément non essentiel au lancement du jeu
carte.style.display = "none";
sectionReponse.style.display = "none";

function retournerCarte(event) {
    //console.log("clique ecouter");
    carte.style.animation = "tournerCarte 600ms ease backwards";
    sonCarte.play();
}

//fonction pour effacer la carte
function effacerInt(event) {
    //pour suprimer le ? de la carte
    if (event.animationName == "tournerCarte") {
        console.log("carte tourné");
        carte.innerHTML = "";
        //mettre l'image si le quiz n'est pas fini
        if (!finQuiz) {
            //activer le display de la barre de temps
            barreTemps.style.display = "block";
            //faire apparaitre l'image du jeux
            let imageCarte = document.createElement("div");
            imageCarte.classList.add("imageCarte");
            imageCarte.style.backgroundImage = tableau[noQuestion].image;
            carte.append(imageCarte);

            //lancer le chronometre
            animTemps = requestAnimationFrame(animerTemps);

            //faire apparaitre les choix de réponse
            for (let i = 0; i < tableau[noQuestion].choix.length; i++) {
                //creation d'un élément div
                let nouveauChoix = document.createElement("div");
                //mettre le nom du jeu a choisir
                nouveauChoix.innerText = tableau[noQuestion].choix[i];
                //ajouter l'index pour le retrouver lors du clique
                nouveauChoix.index = i;
                //ajouter le gestionaire de clique
                nouveauChoix.addEventListener("click", choisirReponse);
                nouveauChoix.addEventListener("animationend", translation);
                //intégrer la div à la section des réponse possible
                sectionReponse.append(nouveauChoix);
                //console.log(nouveauChoix);
            }
        } else {
            montrerScore();
        }
    }
    //vérifier si la derniere question est passé`et finir le quiz
    if (noQuestion >= 5) {
        finQuiz = true;
        sonPartie.pause();
        sonFin.play();
        titre.innerHTML = "Votre Score";
    }
    if ((event.animationName == "translationSortie" && noQuestion < 6)) {
        //vérifier si le quiz se lance pour la premiere fois
        if (finQuiz) {
            //remmetre le quiz à false
            finQuiz = false;
            //remmetre le bon texte de question
            titre.innerText = "De quelle jeux vidéo vient la capture d'écran suivante?"
        }

        if (debutJeu) {
            debutJeu = false;
            //désactiver l'écouteur du clique
            btnJouer.removeEventListener("click", translation);
            //activer le display des élément du jeu
            carte.style.display = "flex";
            sectionReponse.style.display = "flex";
            //desactiver le btn
            btnJouer.style.display = "none";
            //modifier le texte afficher en haut
            titre.innerText = "De quelle jeux vidéo vient la capture d'écran suivante?";
            titre.style.fontSize = "3vw";
        }

        //mettre les enfant initiaux dans les parrent
        if (finQuiz) {
            carte.innerHTML = "<p>Cliquer pour voir votre score</p>"
        } else {
            carte.innerText = "?";
        }
        sectionReponse.innerHTML = "";
        //ajouter la transition d'entrée
        laSection.style.animation = "translationEntre 1s forwards";

        //ecouter les clique sur la carte
        carte.addEventListener("click", retournerCarte);

        //retirer l'animation de la carte pour que l'animation sur le hover puisse jouer
        carte.style.removeProperty("animation");

        //faire disparaitre la barre de temps
        barreTemps.style.display = "none";
    }
}
//fonction pour afficher choisir la réponse
function choisirReponse(event) {
    //console.log(event.target.index);
    if (event.target.index == tableau[noQuestion].bonneReponse) {//si c'est la bonne réponse
        //on met l'animation de la bonne réponse
        event.target.style.animation = "bonneReponse 1s forwards";
        //on joue le son
        sonReussite.play();
        //on incrémente le score
        score++;
    } else {
        //on met l'animation d'erreur
        event.target.style.animation = "mauvaiseReponse 1.5s forwards";
        //on joue le son
        sonErreur.play();
    }
    //retirer les cliques sur les div de la section des choix de réponse pour éviter plusieur choix de réponses
    let lesDiv = document.querySelectorAll("#choixDisponible div");
    //console.log(lesDiv);
    for (let uneDiv of lesDiv) {
        uneDiv.removeEventListener("click", choisirReponse);

    }
    //incrémenter le numéro de la question???
    noQuestion++;
    //si la réponse à été cliquer, alors on remet le temps à zero
    posBarre = -100;
    cancelAnimationFrame(animTemps);

}
//déplacer le jeu à gauche puis le téléporter à droite pour le faire revenir au centre
function translation(event) {
    laSection.style.animation = "translationSortie 1s forwards";
}
//fonction pour montrer le score
function montrerScore() {
    //aller chercher et/ou inscrire le meilleur score
    if (!(localStorage.getItem("meilleurScore"))) {//si il n'y a pas encore de lacalStorage
        console.log("pas de meilleur score");
        localStorage.setItem("meilleurScore", score);
    } else if (localStorage.getItem("meilleurScore") < score) {//si le score actuel est plus grand que le meilleur score
        localStorage.setItem("meilleurScore", score);
    }
    //mettre tous dans la carte pour l'affichage du score
    carte.innerHTML =
        `<p>${score}/5</p>
            <p>votre meilleur score est:</p>
            <p>${localStorage.getItem("meilleurScore")}/5</p>
            <div class="rejouer"></div>`;
    //aller chercher et mettre un écouteur sur le bouton rejouer
    let btnRejouer = document.querySelector(".rejouer");
    btnRejouer.addEventListener("click", relancerQuiz);
}
function relancerQuiz() {
    noQuestion = 0;
    score = 0;
    sonBrassage.play();
    sonFin.pause();
    sonPartie.play();
    translation();
}
function animerTemps(temps) {
    barreTemps.style.translate = posBarre + "vw";
    posBarre += .2;
    console.log(barreTemps.style.translate);
    animTemps = requestAnimationFrame(animerTemps);
    if (posBarre > 0) {
        cancelAnimationFrame(animTemps);
        noQuestion++;
        translation();
        posBarre = -100;
    }
}
