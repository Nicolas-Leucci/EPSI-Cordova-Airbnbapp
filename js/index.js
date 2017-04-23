$(document).ready(function() {

    // Attendre pour le chargement des scripts
    // Pour un rendu optimal de MaterializeCSS avec Jquery
    setTimeout(function() {
        $('#preloader').hide(20);
        $('#main-container').show(500);
    }, 500);

    // Materialize loaders
    $('select').material_select();
});

// Recherche avec les valeurs du formulaire
function search() {
    var searchValue = {};

    searchValue.place       = $('#place').val() || "";
    searchValue.travelers   = $('#travelers').val() || 1;
    searchValue.dateFrom    = $('#datepicker-from').val() || "";
    searchValue.dateTo      = $('#datepicker-to').val() || "";

    console.log(searchValue);
    alert(JSON.stringify(searchValue));
}