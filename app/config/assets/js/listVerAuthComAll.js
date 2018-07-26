/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function display() {

    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var busListUrl = 'config/tables/business/html/business_list.html';
    var busListAuthUrl = 'config/tables/business/html/business_list_needs_auth.html';
    var busListVerUrl = 'config/tables/business/html/business_list_needs_ver.html';

    var village = util.getQueryParameter(util.VILLAGE);
    var appendToUrl = '';

    if (village !== null && village !== undefined) {
        appendToUrl = '?' + util.VILLAGE + '=' + village;
    }

    var verButton = $('#ver-button');
    verButton.on('click', function() {
       var verUrlToLaunch = busListVerUrl + appendToUrl;
       odkTables.launchHTML(null, verUrlToLaunch);
    });

    var authButton = $('#auth-button');
    authButton.on('click', function() {
        var authURLToLaunch = busListAuthUrl + appendToUrl;
        odkTables.launchHTML(null, authURLToLaunch);
    });

    var allButton = $('#all-button');
    allButton.on('click', function() {
        var allURLToLaunch = busListUrl + appendToUrl;
        odkTables.launchHTML(null, allURLToLaunch);
    });
}
