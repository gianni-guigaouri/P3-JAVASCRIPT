/* Creation de l'objet Slider avec les différentes methodes */

const Slider = {
	element: $(".etape"),
  slideIndex: 1,
	sliderAuto : null,

  	bouton : {
	    gauche : $("#prev"),
	    droite: $("#next"),
	    play: $("#playhidden"),
	    pause: $("#pausehidden"),
  	},


// creation d'une methode qui initialise les autres methode
	init: function(){
    	this.afficherSlider();
	    this.playAuto();
	    this.clickBouton();
	    this.eventClavier();
	},


  	playAuto: function(){
    	this.sliderAuto = setInterval(function () {
          Slider.slideIndex ++;
          // Parametrage automatique avec 5s
          Slider.afficherSlider(Slider.slideIndex);
        }, 5000);
  	},  


// methode qui va permettre d'afficher qu'une seule étape à la fois

	afficherSlider: function  (n) {
    	// Index = 1 s'il dépasse le nombre d'éléments du slider
    	if (n > this.element.length) {
      	this.slideIndex = 1;
    	}
    	// index = dernier élément du slider si il dépasse le premier élément
    	if (n < 1) {
      	this.slideIndex = this.element.length;
    	}
    	// N'affiche aucun élément du slider
    	this.element.hide();
    	// Affiche l'élément du slider voulu
    	this.element.eq(this.slideIndex - 1).fadeIn("slow");
  	},


  	changeSlide: function  (d) {
    // Arrête le slider auto
    	clearInterval(this.sliderAuto);
    	this.bouton.pause.css("visibility", "hidden"); // à l'arret du playAuto, le bouton pause prend la valeur hidden 
    	this.bouton.play.css("visibility", "visible"); // le bouton play en visible afin de reprendre la lecture auto si besoin

    	// Affiche le slide suivant
    	if (d === 39) {
      	this.afficherSlider(this.slideIndex += 1);
    	}
    	// Affiche le slide précédent
    	if (d === 37) {
      	this.afficherSlider(this.slideIndex -= 1);
    	}
  	},

  
  	clickBouton: function () {
    // Event du clic sur le bouton droit
    	this.bouton.droite.on("click", function () {
  			sens = 39; 
      	Slider.changeSlide(sens); // "sens" ayant pris la valeur 39, la methode changeSlide reagit avec this.slideIndex += 1 
    	});
    // Event du clic sur le bouton gauche
    	this.bouton.gauche.on("click", function () {
      	sens = 37;
      	Slider.changeSlide(sens);
    	});
    // Event du clic sur play et propriété css visibility 	
    	this.bouton.play.on("click", function () {
      	Slider.playAuto();  
    		Slider.bouton.pause.css("visibility", "visible");
    		Slider.bouton.play.css("visibility", "hidden");
    	});
    // Event du clic sur pause et propriété css visibility	
    	this.bouton.pause.on("click", function(){
      	clearInterval(Slider.sliderAuto);
      	Slider.bouton.pause.css("visibility", "hidden");
      	Slider.bouton.play.css("visibility", "visible");
    	})
  	},

  	// méthode pour le changement de slide avec les touches du clavier
  	eventClavier: function () {
    	$("body").on("keyup", function (e) {
      	sens = e.keyCode; // e.keycode renvoit au valeur des touches du clavier. 
      	Slider.changeSlide(sens);
    	});
  	},


};

Slider.init();


