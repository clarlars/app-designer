/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var VILLAGE_URL = 'config/assets/listOfVillages.html';
    var queryParamsToAppend = '';

    var userId = util.getQueryParameter(util.USER_ID);

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
        queryParamsToAppend += '&' + util.USER_ID + '=' + userId;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });
}
