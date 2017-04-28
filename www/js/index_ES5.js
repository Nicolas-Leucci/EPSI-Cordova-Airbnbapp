// Variables
var todayTimestamp = new Date().getTime();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    // Attendre pour le chargement des scripts
    // Pour un rendu optimal de MaterializeCSS avec Jquery
    setTimeout(function() {
        $('#preloader').hide(20);
        $('#main-container').show(500);
    }, 500);

    // Add default date
    $('#date-checkin').val(getCurrentDate(1));
    $('#date-checkout').val(getCurrentDate(2));

    // Materialize loaders
    $('select').material_select();

};

// Recherche avec les valeurs du formulaire
function search() {

    var searchValue = {};
    searchValue.location    = $('#location').val() || "";
    searchValue.guests   	= $('#guests').val() || 1;
    searchValue.checkin    	= $('#date-checkin').val();
    searchValue.checkout    = $('#date-checkout').val();

    // Timestamp de chaque date
	var checkinTimestamp 	= new Date(searchValue.checkin).getTime();
	var checkoutTimestamp 	= new Date(searchValue.checkout).getTime();
	
	// Si la date de début est supérieure à la date de fin OU
	// Si la date de début est égale à la date de fin OU
	// Si la date de début est supérieur à la date d'aujourd'hui
	// ===> Erreur
	if((checkinTimestamp > checkoutTimestamp) || (checkinTimestamp == checkoutTimestamp) || (checkinTimestamp < todayTimestamp)){
		alert("Les dates ne semblent pas être valides, veuillez vérifier et réessayer.");
	}
	else {

		// Désactiver le bouton
		disableButton(true);
		// Réinitialiser la vue des résultats
	    $('#results').html('');

	    // Appel asynchrone à l'API Airbnb
	    $.get("https://www.airbnb.fr/search/search_results/", searchValue, function(data, status) {

	    	// Si la requête s'est bien effectuée
	    	if(status == "success"){

		    	// data.search_results contient les résultats de la recherche
		    	if(data.results_json.search_results && data.results_json.search_results.length > 0) {
		    		// Lance le traitement pour afficher les résultats
		    		showResults(data.results_json.search_results, searchValue);		    		
					// Défile jusqu'aux résultats
					smoothScrollTo('results', 1000);
		    	}
		    	else {
		    		$('#results').html("Votre recherche n'a donné aucun résultat.");
		    	}

	    	}
	    	else {
	    		$('#results').html('Une erreur est survenue dans la requête vers Airbnb. Veuillez vérifier les champs de recherche et réessayer.');
	    	}

	    	// Réactiver le bouton
	    	disableButton(false);
	    });

	}

}

function showResults(data, searchValue) {

	// Affiche le titre	
	$('#results').append('<hr><h4>' + data.length + ' résultat(s)</h4><br><br>');

	// Contient un tableau des résultats
	data.forEach(function(element, index){
		// Affiche le résultat courant
		// Formatte les éléments à afficher
		var title 		= element['listing'].name;
		var description = element['listing'].localized_city + ' - ' + element['listing'].property_type + ' - Max: ' + element['listing'].person_capacity + ' personne(s) - ' + element['pricing_quote']['rate'].amount + ' ' + element['pricing_quote']['rate'].currency;
		var imgSrc 		= element['listing'].picture_url;
		// Message pour le partage
		var checkinDate 	= formatDate(searchValue.checkin);
		var checkoutDate 	= formatDate(searchValue.checkout);
		var sharingMessage 	= "Je viens de trouver un bon hôtel Airbnb : '"+title+"' disponible du "+ checkinDate +" au "+ checkoutDate +" ! - Envoyé avec Find My Airbnb";
		sharingMessage 		= sharingMessage.replace(/'/g, "\\'");

		// Ajoute l'objet à la vue
		$('#results').append('<div class="row">'+
			'	<div class="col s1 m2"></div>'+
			'	<div class="col s10 m8">'+
			'      <div class="card">'+
			'        <div class="card-image">'+
			'          <img src="'+imgSrc+'" alt="hostel_img">'+
			'          <div class="card-title"></div>'+
			'        </div>'+
			'        <div class="card-content">'+
			'          <p class="bold">'+title+'</p>'+
			'        </div>'+
			'        <div class="card-action">'+
			'			<a class="waves-effect waves-light btn blue" href="#modal'+index+'">Voir</a>'+
			'        </div>'+
			'      </div>'+
			'    </div>'+
			'    <div class="col s1 m2"></div>'+
			'</div>');

		// Ajoute la modale pour chaque résultat
		// TODO: Dans une meilleure version, la rendre générique
		$('#results').append('<div id="modal'+index+'" class="modal">'+
		'    <div class="modal-content">'+
		'	  <img src="'+imgSrc+'" alt="hostel_img">'+
		'      <p class="bold">'+title+'</p>'+
		'      <p>'+description+'</p>'+
		'    </div>'+
		'    <div class="modal-fixed-footer">'+
		'		<a class="waves-effect waves-light btn blue" onclick="share(\''+sharingMessage+'\')">Partager</a>'+
		'		<a class="waves-effect waves-light btn green" onclick="addToCalendar(\''+ title +'\', \''+ element['listing'].localized_city +'\', \''+ description +'\', \''+ searchValue.checkin +'\', \''+ searchValue.checkout +'\')">Réserver</a>'+
		'    </div>'+
		'  </div>');
	});

	// Affiche le titre	
	$('#results').append('<a class="waves-effect waves-light btn" onclick="smoothScrollTo(\'main-container\', 1000);">Retour en haut de page</a>');

	// Lance le chargement des modales après leurs générations dans le DOM
	$('.modal').modal();

}

// Modification du bouton de recherche
function disableButton(disable) {

	if(!disable){
		$('#formButton').disabled = false;
		$('#formButton').val("Rechercher");
	}
	else {
		$('#formButton').disabled = true;
		$('#formButton').val("Chargement en cours ...");
	}

}

// Date du jour au format YYYY-MM-DD
function getCurrentDate (addDay) {
	var today 	= new Date();
	// Possibilité d'ajouter des jours à la date du jour
	if(addDay)
		today 	= today.addDays(addDay);

	var dd 		= today.getDate();
	var mm 		= today.getMonth()+1;
	var yyyy 	= today.getFullYear();

	if(dd < 10)
	    dd='0'+dd;

	if(mm < 10)
	    mm='0'+mm;

	return yyyy +'-'+ mm +'-'+ dd;
}

// Démarre la fonction de partage sur mobile
function share(message) {	
	if(!window.plugins.socialsharing)
  		alert('Une erreur est survenue avec le plugin de partage.');
  	else
		// Invite l'utilisateur à partager avec ses applications favorites
		window.plugins.socialsharing.share(message);
}

// Propose l'ajout d'un évènement au calendrier
function addToCalendar(title, location, notes, checkinDate, checkoutDate) {

	// YYYY-MM-DD
	var startDateArray = checkinDate.split('-');
	var endDateArray = checkoutDate.split('-');

	// Dates de début et fin avec les dates données
	// Soustraction avec le mois car Janvier = 0 et Décembre = 11
	var startDate    = new Date(startDateArray[0], startDateArray[1]-1, startDateArray[2],0,0,0,0,0);
	var endDate      = new Date(endDateArray[0], endDateArray[1]-1, endDateArray[2],0,0,0,0,0);

	// Callback
	var success 	 = function(message) { console.log("Success: " + JSON.stringify(message)); };
  	var error 		 = function(message) { console.log("Error: " + message); };

  	if(!window.plugins.calendar)
  		alert('Une erreur est survenue avec le plugin Calendrier.');
  	else
		// Invite l'utilisateur à modifier / valider l'évènement
		window.plugins.calendar.createEventInteractively(title, location, notes, startDate, endDate, success, error);
}

// Sharing plugin
// https://plugins.telerik.com/cordova/plugin/socialsharing
// https://github.com/Telerik-Verified-Plugins/SocialSharing

// Calendar plugin
// https://plugins.telerik.com/cordova/plugin/calendar
// https://github.com/Telerik-Verified-Plugins/Calendar