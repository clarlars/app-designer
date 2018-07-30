/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

var viewType;
var pendingAuth;
var pendingVer;
var actionToPerform;
var completed;
var lovUserId;
var REGION_ATTR = 'region';

function addBackground() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');
}


function determineButtonAction(evt) {

    var listURL = 'config/assets/listVerAuthComAll.html';
    var businessAuthorizeURL = 'config/tables/business/html/business_authorize.html';
    var businessVerifyURL = 'config/tables/business/html/business_list_verify.html';

    var queryParamToAppend = '';
    var urlToUse = '';
    var viewTypeQueryParamToAppend = '';
    var userQueryParamToAppend = '';

    var clickedButton = $(evt.target);
    var closestButton = clickedButton.closest('.button');
    var village = closestButton.attr(REGION_ATTR);

    // A region should always be associated with a button
    if (village !== null && village !== undefined) {
        queryParamToAppend = '?' + util.VILLAGE + '=' + village;
    }

    if (viewType !== null && viewType !== undefined) {
        viewTypeQueryParamToAppend = '&' + util.VIEW_TYPE + '=' + viewType;
    }

    if (lovUserId !== null && lovUserId !== undefined) {
        userQueryParamToAppend = '&' + util.USER_ID + '=' + lovUserId;
    }

    if (actionToPerform === util.ACTION_LIST) {
        queryParamToAppend += viewTypeQueryParamToAppend;
        queryParamToAppend += userQueryParamToAppend;
        urlToUse = listURL + queryParamToAppend;

    } else if (actionToPerform === util.ACTION_AUTHORIZE) {
        queryParamToAppend += viewTypeQueryParamToAppend;
        queryParamToAppend += userQueryParamToAppend;
        urlToUse = businessAuthorizeURL + queryParamToAppend;
    } else if (actionToPerform === util.ACTION_VERIFY) {
        // We don't want to restrict coordinator by util.USER_ID
        urlToUse = businessVerifyURL + queryParamToAppend;
    }

    if (urlToUse !== '' && urlToUse !== null && urlToUse !== undefined) {
        odkTables.launchHTML(null, urlToUse);
    }
}

function loadVillages(data) {
    var btnDiv = $('#buttonsDiv');

    for (var i = 0;  i < data.getCount(); i++) {
        var vName = data.getData(i, util.VILLAGE);
        var vCount = data.getData(i, 'count(*)');

        var vBtn = $('<button>');
        var vBadge = $('<span>');
        vBadge.attr('class', 'button-badge badge');
        vBadge.text(vCount);
        vBtn.text(vName);
        vBtn.attr('class', 'button');
        vBtn.attr('region', vName);
        vBtn.on('click', function (evt) {
            determineButtonAction(evt);
        });
        vBtn.append(vBadge);
        btnDiv.append(vBtn);
    }

    addBackground();
}

function failCB(error) {
    console.log('failCB: error occurred while trying to get villages: ' + error);
}

function display() {
    viewType = util.getQueryParameter(util.VIEW_TYPE);
    pendingAuth = util.getQueryParameter(util.PENDING_AUTHORIZATION);
    pendingVer = util.getQueryParameter(util.PENDING_VERIFICATION);
    actionToPerform = util.getQueryParameter(util.ACTION);
    completed = util.getQueryParameter(util.COMPLETED);
    lovUserId = util.getQueryParameter(util.USER_ID);

    // Display villages pending auth
    if (pendingAuth === util.TRUE) {
        if (viewType === util.VIEW_TYPE_AGENT) {
            // This will only work if an agent id is given!!
            if (lovUserId !== null && lovUserId !== undefined) {
                util.getVillagesByPendingAuthUserId(lovUserId, loadVillages, failCB);
            } else {
                addBackground();
                alert('A user id must be given to display villages pending authorization for agent');
            }
        } else if (viewType === util.VIEW_TYPE_COORDINATOR) {
            util.getVillagesByPendingAuth(loadVillages, failCB);
        }
    } else if (pendingVer === util.TRUE) {
        if (viewType === util.VIEW_TYPE_COORDINATOR) {
            util.getVillagesByPendingVer(loadVillages, failCB);
        }
    }

}
