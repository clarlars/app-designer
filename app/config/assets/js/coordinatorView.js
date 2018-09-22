/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var locale = odkCommon.getPreferredLocale();
    $('#agent-title').text(odkCommon.localizeText(locale, "coordinator_options"));
    $('#firms-pending-verification-button').text(odkCommon.localizeText(locale, "pending_verification"));
    $('#businesses-list-button').text(odkCommon.localizeText(locale, "view_businesses"));

    var VILLAGE_URL = 'config/assets/listOfVillages.html';
    var queryParamsToAppend = '';

    var busListButton = $('#businesses-list-button');
    busListButton.on('click', function() {
        var listURL = 'config/assets/listVerAuthComAll.html';
        var queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_LIST;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_COORDINATOR;
        odkTables.launchHTML(null, listURL + queryParamsToAppend);
    });

    var firmsPendingVerButton = $('#firms-pending-verification-button');
    firmsPendingVerButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_VERIFY;
        queryParamsToAppend += '&' + util.PENDING_VERIFICATION + '=' + util.TRUE;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_COORDINATOR;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });
}
