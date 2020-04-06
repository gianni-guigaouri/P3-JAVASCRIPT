
const VeloMap = {

  /* Création d'une méthode qui initialise les autres méthodes */

	  initVeloMap: function () {
		  this.initMap()
		  this.loadApi()
    this.initStorage()
    this.showName()
	  },

  showName: function () {
    if (localStorage != null) {
      $(document).ready(function () {
        $('input[id=firstName]').val(localStorage.firstName)
        $('input[id=lastName]').val(localStorage.lastName)
      })
    };
  },

  /* si le storage n'est pas null information du storage dans les détails du footer */

  initStorage: function () {
    if (sessionStorage.station != null) {
      $('#bookingButton').css('display', 'none')
      $(document).ready(function () {
        $('.footer-text').text(localStorage.firstName + ' votre vélo à la station ' + sessionStorage.station + ' est réservé pour :')
        $('#footer *:not(.timer)').fadeIn('Slow')
        var timeInterval = setInterval(VeloMap.compteur, 1000)
        // EVENT: Annuler la réservation
        $('.annuler').on('click', function () {
          VeloMap.annulerReservation()
        })
      })
    }
  },

  /* affichage de la map Leaflet */
  	initMap: function () {
    	this.map = L.map('map', {
      	center: [49.440459, 1.0939658],
      	zoom: 14
    	})
    	this.layer = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
      	maxZoom: 45
    	}).addTo(this.map)
  	},

  /* récupération des données via l'api jcDecaux via la la méthode GET */

  	loadApi: function () {
    $.getJSON('https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=d49e8e530f37f24548fcc5554dbd0464145dbb47')
      .then((api) => {
        this.api = api
        this.initMarkers() // initialisation des marqueurs pour affichage sur la map
      })
  	},

  /* initialisation des markeurs pour affichage sur la map en fonction
  des stations récupérées via l'api avec une loop avec itération */

  initMarkers () {
    	this.markerCluster = L.markerClusterGroup()
      	for (let i = 0; i < this.api.length; i++) {
        	const station = this.api[i]
        	let imageLink = './images/velo-marker-1.png'
        	if (station.available_bikes === 0) {
          	imageLink = './images/velo-marker-2.png'
        	} else if (station.status === 'CLOSE') {
          	imageLink = './images/velo-marker-2.png'
          	}

      const logoMarker = L.icon({
          	iconUrl: imageLink,
          	iconSize: [40, 47]
        	})

        	this.marker = L.marker(station.position, { icon: logoMarker }) // ajout d'un markeur via sa position et le logo defini
        	this.markerCluster.addLayer(this.marker)

      /* ajout de la fonction click pour afficher les infos de station dans les différentes div */

        	this.marker.addEventListener('click', () => {
          	$('.reservation').fadeOut('slow')
           	$('.reservation hr').fadeOut('slow')
          	const stationNameField = document.getElementById('stationName')
          	const adresseField = document.getElementById('adress')
          	const nbrePlacesField = document.getElementById('slotNumber')
          	const nbreVelosField = document.getElementById('bikeCounter')
          	const close = document.getElementById('bookingButton')
        stationNameField.textContent = station.name
        adresseField.textContent = station.address
        nbrePlacesField.textContent = station.available_bike_stands
        nbreVelosField.textContent = station.available_bikes

        // si velo dispo alors le bouton de resa est visible
        if (station.available_bikes > 0) {
        			close.style.display = 'block'
        			close.addEventListener('click', function () { // si il est visible alors au clic celui si affiche l'élement de signature
      		    	$('.reservation').fadeIn('slow')
      		    	$('.reservation hr').fadeIn('slow')
       				})
      			} else {
            		close.style.display = 'none' 
}

        /* si une rservation est en cours et que l'on clic sur un markeur on verifie
            si la sation correspond a celle en storage, et si c'est le cas la reservation n'est possible */

        if (sessionStorage.station == station.name) {
          close.style.display = 'none'
          /* methode majInfos placé ici afin que le nombre de velo dispo et place, puisse afficher le nombre affecté
              par la reservation en cours si il y a eu changement de markeur entre temps */
          VeloMap.majInfos(station.name, station.available_bikes, station.available_bike_stands)
          $('#bikeCounter').text(VeloMap.veloDispo)
          $('#slotNumber').text(VeloMap.placeDispo)
        }

        /* au clic permet d'effacer la signature du canvas */
        $('.effacer').on('click', function () {
          VeloMap.suppSign()
        })

        /*validation de la reservation */
        		$('.valider').on('click', function () {
            	VeloMap.validerReservation(station.name)
          		VeloMap.majInfos(station.name, station.available_bikes, station.available_bike_stands) // suite au clic mise a jour du nombre de velo et place dispo
          		$('#bikeCounter').text(VeloMap.veloDispo)
          		$('#slotNumber').text(VeloMap.placeDispo)
          close.style.display = 'none' // display du bonton reservation au moment de la reservation, car resa impossible deux fois au meme endroit
          		VeloMap.suppSign()
        		})

        /* Annulation de la reservation au clic */
        		$('.annuler').on('click', function () {
          		VeloMap.annulerReservation()
          		VeloMap.majInfos(station.name, station.available_bikes, station.available_bike_stands)
          		$('#bikeCounter').text(VeloMap.veloDispo)
          		$('#slotNumber').text(VeloMap.placeDispo)
          $('.reservation').fadeOut('slow')
          $('.reservation hr').fadeOut('slow')
          close.style.display = 'block'
        		})
      })
    }

    	this.map.addLayer(this.markerCluster)
	  },

  /* methode pour la suppression de la signature */
	  suppSign: function () {
  		SignIn.ctx.clearRect(0, 0, 250, 125) // definition de la zone a effacer
  		$('.valider').prop('disabled', true) // permet de désactiver le boutton de validation si la signature est effacée
  		$('.valider').css('background-color', 'grey')
	  },

  /* methode pour valider la reservation et initialisé le localstorage */
  	validerReservation: function (station) {
    	sessionStorage.clear()
    	sessionStorage.setItem('station', station)
    localStorage.setItem('firstName', firstName.value)
    localStorage.setItem('lastName', lastName.value)
   		 // Initialise la date de fin de réservation
    	var dateReservation = Date.parse(new Date())
    	var deadline = new Date(dateReservation + 20 * 60 * 1000)
    	// Enregistre date de fin de la réservation
    	sessionStorage.setItem('date', deadline)
    	$('.reserver').fadeOut('slow')
    	$('.reservation').fadeOut('slow')
    // Affiche la réservation et le timer
    	$('#footer *:not(h3, .annuler, .timer)').fadeOut('slow', function () {
    		$('.footer-text').text(localStorage.firstName + ' votre vélo à la station ' + sessionStorage.station + ' est réservé pour :')
    		$('#footer *').fadeIn('slow')
    	})

    	// Lance le compte à rebours de la réservation
    	var timeInterval = setInterval(VeloMap.compteur, 1000)
  	},

 	  annulerReservation: function () {
    	clearInterval(VeloMap.timeInterval)
    	sessionStorage.clear()

    // Affiche un message "Aucune réservation"
    	$('#footer *:not(h3)').fadeOut('slow', function () {
      $('.footer-text').text('Aucune réservation en cours')
    		$('.minutes').text('')
    		$('.secondes').text('')
    		$('#footer *:not(.annuler, .timer)').fadeIn('slow')
    	})
 	  },

  /* methode de mise a jour des informations concernant les velos et places disponibles */
  majInfos: function (station, velo, place) {
    	if (station == sessionStorage.station) { // si la station est la station enregistrée en local
      VeloMap.veloDispo = (velo - 1)
    		VeloMap.placeDispo = (place + 1)
    } else {
    		VeloMap.veloDispo = velo
      		VeloMap.placeDispo = place
    	}
 	  },

  compteur: function () {
    	// t = temps restant jusqu'à la deadline en ms
    	var temps = Date.parse(sessionStorage.date) - Date.parse(new Date())
    	// Conversion de t en secondes et minutes
    	var secondes = Math.floor((temps / 1000) % 60)
    	var minutes = Math.floor((temps / 1000 / 60) % 60)
    	// Affichage du compteur
    	$('.minutes').text(minutes + ' min')
    	$('.secondes').text(('0' + secondes + ' s').slice(-4))
    	// ANNULE LA RESERVATION A LA FIN DU COMPTE A REBOURS
    	if (temps <= 0) {
      VeloMap.annulerReservation()
      	// Affiche un message "Réservation terminée"
      	$('.infos-station *:visible:not(h2)').fadeOut('slow', function () {
      		$('.nom-station').text('Réservation terminée').fadeIn('slow')
      	})
    	}
  	}
}

VeloMap.initVeloMap()
