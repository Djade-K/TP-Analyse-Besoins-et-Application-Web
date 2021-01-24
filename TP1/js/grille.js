/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookies;cookiesCliques = [];

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies(6);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonnes);
      let colonne = index % this.nbColonnes;
      //console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);
      let img = this.tabCookies[ligne][colonne].htmlImage;
      img.onclick = (evt) => {
        let imageCliquee = evt.target; // toujours vrai.
        const l = imageCliquee.dataset.ligne;
        const c = imageCliquee.dataset.colonne;
        let cookie = this.tabCookies[l][c];
        if(this.cookiesCliques.length === 0){
          //On vient de cliquer sur le cookie de départ
          this.cookiesCliques.push(cookie);
          cookie.selectionnee();
        }
        else if (this.cookiesCliques.length === 1){
          this.cookiesCliques.push(cookie);
          if(this.swapPossible()){
            this.swapCookies();
          }
          else{
            console.log("Swap pas possible");
          }
        
          this.cookiesCliques[0].deselectionnee();
          this.cookiesCliques[1].deselectionnee();
          this.cookiesCliques = [];
        }
        //console.log("image cliquée");
      }

      // Drag n drop
      img.ondragstart = (evt) => {
        console.log("dragstart");
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieDragges = this.tabCookies[l][c];
        this.cookiesCliques = [];
        this.cookiesCliques.push(cookieDragges);
        cookieDragges.selectionnee();
      }
      
      img.ondragover = (evt) => {
        return false;
      };
      
      // mettre en sur-brillance le fond des cases où on passe le cookie
      img.ondragenter = (evt) => {
        console.log("ondragenter");
        let img = evt.target;
        img.classList.add("grilleDragOver");
      }
      // enlever la sur-brillance
      img.ondragleave = (evt) => {
        console.log("ondragleave");
        let img = evt.target;
        img.classList.remove("grilleDragOver");
      }

      img.ondrop = (evt) => {
        console.log("ondrop");
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieZoneDrop = this.tabCookies[l][c];
        this.cookiesCliques.push(cookieZoneDrop);

        if(this.swapPossible()){
          this.swapCookies();
        }
        else {
          console.log("swap impossible");
        }
        this.cookiesCliques[0].deselectionnee();
        this.cookiesCliques[1].deselectionnee();
        imgDrop.classList.remove("grilleDragOver");
        this.cookiesCliques = [];
      }
     

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  

  swapCookies(){
    let cookie1 = this.cookiesCliques[0];
    let cookie2 = this.cookiesCliques[1];
    let tmpType = cookie1.type;
    let tmpSrc = cookie1.htmlImage.src;

    cookie1.type = cookie2.type;
    cookie1.htmlImage.src = cookie2.htmlImage.src;
    
    cookie2.type = tmpType;
    cookie2.htmlImage.src = tmpSrc;
  };

  swapPossible(){
    let cookie1 = this.cookiesCliques[0];
    let cookie2 = this.cookiesCliques[1];

    const distance = Math.sqrt((cookie2.colonne - cookie1.colonne) * (cookie2.colonne - cookie1.colonne) + (cookie2.ligne - cookie1.ligne) * (cookie2.ligne - cookie1.ligne));
    console.log("Distance = " + distance);
    return (distance == 1);

  };

  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(this.nbLignes);
    for(let i=0; i < this.nbLignes; i++){
      for(let j=0; j< this.nbColonnes;j++){
        const type = Math.floor(Math.random()*nbDeCookiesDifferents);
        this.tabCookies[i][j] = new Cookie(type,i,j);
      }
    }
    // A FAIRE
    // déclarer le tableau et le remplir ligne par ligne et colonne par colonne
    // avec une instance de cookie dont le type est tiré au hasard parmi les nbDeCoookiesDifferents
  }

  detecteTousLesAlignements(){
    this.nbAlignements = 0;

    for(let l = 0; l < this.nbLignes; l++){
      this.detecteAlignementLigne(l);
    }
    for(let c = 0; c < this.nbColonnes; c++){
      this.detecteAlignementColonne(c);
    }

    return this.nbAlignements !== 0;
  }

  enleveSurbrillance(){
    this.nbAlignements = 0;

    for(let l = 0; l < this.nbLignes; l++){
      this.enleveSurbrillanceLigne(l);
    }
    for(let c = 0; c < this.nbColonnes; c++){
      this.enleveSurbrillanceColonne(c);
    }

    return this.nbAlignements !== 0;
  }

  detecteToutesLesSuppressions(){
    this.nbSuppressions = 0;

    for(let l = 0; l < this.nbLignes; l++){
      this.detecteSuppressionLigne(l);
    }
    for(let c = 0; c < this.nbColonnes; c++){
      this.detecteSuppressionColonne(c);
    }
    return this.nbSuppressions !== 0;
  }

  detecteAlignementLigne(ligne){
    for(let colonne = 0; colonne <= this.nbColonnes - 3; colonne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne][colonne + 1];
      let cookie3= this.tabCookies[ligne][colonne + 2];

      if(cookie1.type == cookie2.type  && cookie2.type == cookie3.type){
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();
        this.nbAlignements++;
      } 
    }
  }

  detecteAlignementColonne(colonne){
    for(let ligne = 0; ligne <= this.nbLignes - 3; ligne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 2][colonne];

      if(cookie1.type == cookie2.type && cookie2.type == cookie3.type){
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();
        this.nbAlignements++;
      }
    }
  }

  detecteSuppressionLigne(ligne){
    for(let colonne = 0; colonne <= this.nbColonnes - 3; colonne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne][colonne + 1];
      let cookie3= this.tabCookies[ligne][colonne + 2];

      if(cookie1.type == cookie2.type  && cookie2.type == cookie3.type){
        cookie1.supprimer();
        cookie1.marque = true;
        cookie2.supprimer();
        cookie2.marque = true; // on ne se sert pas de la marque pour supprimer les cookies mais pour la chute
        cookie3.supprimer();
        cookie3.marque = true;
        this.nbSuppressions++;
      } 
    }
  }

  detecteSuppressionColonne(colonne){
    for(let ligne = 0; ligne <= this.nbLignes - 3; ligne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 2][colonne];

      if(cookie1.type == cookie2.type && cookie2.type == cookie3.type){
        cookie1.supprimer();
        cookie1.marque = true;
        cookie2.supprimer();
        cookie2.marque = true;
        cookie3.supprimer();
        cookie3.marque = true;
        this.nbSuppressions++;
      }
    }
  }
  // On fait pareil que pour detecteAlignementLigne mais on déselectionne
  enleveSurbrillanceLigne(ligne){
    for(let colonne = 0; colonne <= this.nbColonnes - 3; colonne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne][colonne + 1];
      let cookie3= this.tabCookies[ligne][colonne + 2];

      if(cookie1.type == cookie2.type  && cookie2.type == cookie3.type){
        cookie1.deselectionnee();
        cookie2.deselectionnee();
        cookie3.deselectionnee();
        this.nbAlignements++;
      } 
    }
  }

  // on fait pareil que pour detecteAlignementColonne mais on déselectionne
  enleveSurbrillanceColonne(colonne){
    for(let ligne = 0; ligne <= this.nbLignes - 3; ligne++){
      let cookie1= this.tabCookies[ligne][colonne];
      let cookie2= this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 2][colonne];

      if(cookie1.type == cookie2.type && cookie2.type == cookie3.type){
        cookie1.deselectionnee();
        cookie2.deselectionnee();
        cookie3.deselectionnee();
        this.nbAlignements++;
      }
    }
  }
  // J'ai tenté de faire les chutes cela marche bien pour les lignes 1 et 2 mais je n'arrive pas trop à comprendre pourquoi cela ne marche pas au delà
  chuteDesCookies(){
    for(let ligne = 0; ligne <= this.nbLignes -1; ligne++){
      for(let colonne = 0; colonne <= this.nbColonnes; colonne++){
        let CookieActuel = this.tabCookies[ligne][colonne];
        let CookieDuDessous = this.tabCookies[ligne+1][colonne];

        // on remplit la première ligne avec des nouveaux cookies car on ne peut pas swapper avec ceux du dessus
        if(ligne ===0 && CookieActuel.marque == true ){
          const type = Math.floor(Math.random()*6);
          this.tabCookies[ligne][colonne].type = type;
          CookieActuel.htmlImage.src = Cookie.urlsImagesNormales[type];
          CookieActuel.htmlImage.classList.remove("cookie-cachee");
          CookieActuel.marque = false;
        }
        else if(CookieActuel.marque == false && CookieDuDessous.marque == true){
          let tmpType = CookieActuel.type;
          let tmpSrc = CookieActuel.htmlImage.src;
          CookieActuel.type = CookieDuDessous.type;
          CookieActuel.htmlImage.src = CookieDuDessous.htmlImage.src;
          CookieDuDessous.type = tmpType;
          CookieDuDessous.htmlImage.src = tmpSrc;
          CookieActuel.htmlImage.classList.add("cookie-cachee");
          CookieDuDessous.htmlImage.classList.remove("cookie-cachee");
          CookieDuDessous.marque = false;
        }
        else{

        }
      }

    }
  }
}
