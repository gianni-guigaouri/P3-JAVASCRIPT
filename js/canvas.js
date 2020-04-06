var SignIn = {
  dessin: false,
  ctx : canvas.getContext("2d"),
  canvas : document.getElementById("canvas"),

  initCanvas: function () {
    // Taille et couleur du trait de la signature
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;

    SignIn.moveMouse();
    SignIn.tactileMove();
    SignIn.dessiner();
  },



  // METHODE: EVENEMENT SOURIS
  // -------------------------
  moveMouse: function () {

    // EVENT: Bouton de la souris enfoncé
    this.canvas.addEventListener("mousedown", function (e) {
      SignIn.dessin = true;
      SignIn.ctx.beginPath();
      SignIn.ctx.moveTo(e.offsetX, e.offsetY);

    });

    // EVENT: Déplacement de la souris
    this.canvas.addEventListener("mousemove", function (e) {
      // Si le bouton est enfoncé, dessine
      if (SignIn.dessin === true) {
        SignIn.dessiner(e.offsetX, e.offsetY);
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);
        $(".valider").css("background-color", "#5cadd3");
      }
    });

    // EVENT: Bouton de la souris relâché
    this.canvas.addEventListener("mouseup", function (e) {
      SignIn.dessin = false;
    });
  },



 // METHODE: GERE LES EVENEMENTS TACTILE SUR MOBILE
  // -----------------------------------------------
  tactileMove: function () {
    // EVENT: touché
    this.canvas.addEventListener("touchstart", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;

      SignIn.dessin = true;
      this.ctx.beginPath();
      this.ctx.moveTo(touchX, touchY);
      // Empêche le scrolling de l'écran
      e.preventDefault();
    });

    // EVENT: Déplacement du touché
    this.canvas.addEventListener("touchmove", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;

      if (SignIn.dessin === true) {
        SignIn.dessiner(touchX, touchY);
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);
        $(".valider").css("background-color", "#5cadd3");
      }
      // Empêche le scrolling de l'écran
      e.preventDefault();
    });

    // EVENT: fin du touché
    this.canvas.addEventListener("touchend", function (e) {
      SignIn.dessin = false;
    });
  },




  // METHODE: DESSINER
  // -----------------
  dessiner: function (x,y) {
    this.ctx.lineTo(x,y);
    this.ctx.stroke();
  }
};

SignIn.initCanvas();
