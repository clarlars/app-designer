/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var VILLAGE_URL = 'config/assets/listOfVillages.html';
    var queryParamsToAppend = '';

    var userId = util.getQueryParameter(util.USER_ID);

    var regButton = $('#reg-button');
    regButton.on('click', function() {
        var colMap = {};
        colMap[util.COL_ENROLLER_ID] = userId;
        odkTables.addRowWithSurvey(null, 'business', 'enrollment', null, colMap);
    });

    var firmsPendingAuthButton = $('#firms-pending-auth-button');
    firmsPendingAuthButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_AUTHORIZE;
        queryParamsToAppend += '&' + util.PENDING_AUTHORIZATION + '=' + util.TRUE;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_AGENT;
        queryParamsToAppend += '&' + util.USER_ID + '=' + userId;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });
}
