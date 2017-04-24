// Variables
$(document).ready(function() {

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

});

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
	
	// Si checkin > checkout, erreur 
	if((checkinTimestamp > checkoutTimestamp) || (checkinTimestamp == checkoutTimestamp)){
		alert("La date de début ne peut pas être supérieure ou égale à la date de fin de séjour.");
	}
	else {

		// Désactiver le bouton
		toggleButton(false);

	    // Appel asynchrone à l'API Airbnb
	    $.get("https://www.airbnb.fr/search/search_results/", searchValue, function(data, status) {

	    	// Si la requête s'est bien effectuée
	    	if(status == "SUCCESS"){

		    	// data.search_results contient les résultats de la recherche
		    	if(data.search_results && data.search_results.length > 0) {
		    		showResults(data.search_results);
		    	}
		    	else {
		    		alert("Votre recherche n'a donné aucun résultat.");
		    	}

	    	}
	    	else {
	    		alert("Une erreur est survenue dans la requête vers Airbnb. Veuillez vérifier les champs de recherche et réessayer.");
	    	}

	    	// Réactiver le bouton
	    	toggleButton(true);
	    });

	}

}

function showResults(data) {

}

function toggleButton(disable) {

	if(disable){
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

// Ajoute un jour à la date
// Permet de passer correctement au mois suivant si le jour est le dernier du mois
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}