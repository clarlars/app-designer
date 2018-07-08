var verURL = 'config/assets/agentBusinessesToVerify.html';
var authURL = 'config/assets/agentBusinessesToAuth.html';

function display() {
    var village = util.getQueryParameter('village');
    var appendToUrl = '';
    if (village !== null && village !== undefined && village !== null) {
        appendToUrl = '?village=' + village;
    }

    var verButton = $('#ver-button');
    verButton.on('click', function() {
       var verUrlToLaunch = verURL + appendToUrl;
       odkTables.launchHTML(null, verUrlToLaunch);
    });

    var authButton = $('#auth-button');
    authButton.on('click', function() {
        var authURLToLaunch = authURL + appendToUrl;
        odkTables.launchHTML(null, authURLToLaunch);
    });
}
