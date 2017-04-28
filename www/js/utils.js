
// Ajoute un jour à la date
// Permet de passer correctement au mois suivant si le jour est le dernier du mois
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

// Scroll doux jusqu'à un ID donné
function smoothScrollTo(id, delay) {
	$('html, body').animate({
		scrollTop: $("#"+id).offset().top
	}, delay);
}

// Formate un objet date YYYY-MM-DD en format DD/MM/YYYY
function formatDate(date){
	return date.split('-').reverse().join('/');
} 