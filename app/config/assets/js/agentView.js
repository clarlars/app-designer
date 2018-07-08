function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var VILLAGE_URL = 'config/assets/listOfVillages.html';
    var queryParamsToAppend = '';

    var regButton = $('#reg-button');
    regButton.on('click', function() {
        odkTables.addRowWithSurvey(null, 'business', 'enrollment', null, null);
    });

    var firmsPendingVerButton = $('#firms-pending-ver-button');
    firmsPendingVerButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_VERIFY;
        queryParamsToAppend += '&' + util.PENDING_VERIFICATION + '=' + util.TRUE;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_AGENT;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });

    var firmsPendingAuthButton = $('#firms-pending-auth-button');
    firmsPendingAuthButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_AUTHORIZE;
        queryParamsToAppend += '&' + util.PENDING_AUTHORIZATION + '=' + util.TRUE;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_AGENT;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });

    var statusButton = $('#status-button');
    statusButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_LIST;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_AGENT;
       odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });
}
