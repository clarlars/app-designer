/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    var locale = odkCommon.getPreferredLocale();
    $('#agent-title').text(odkCommon.localizeText(locale, "agent_options"));
    $('#reg-button').text(odkCommon.localizeText(locale, "registration"));
    $('#firms-pending-auth-button').text(odkCommon.localizeText(locale, "pending_authorization"));
    $('#agent_business-list-button').text(odkCommon.localizeText(locale, "view_businesses"));

    var VILLAGE_URL = 'config/assets/listOfVillages.html';
    var busListAgentUrl = 'config/tables/business/html/business_list_agent.html';
    var queryParamsToAppend = '';

    var userId = util.getQueryParameter(util.USER_ID);
    var defaultGroup = util.getQueryParameter(util.DEFAULT_GROUP);

    var regButton = $('#reg-button');
    regButton.on('click', function() {

        if (defaultGroup === null || defaultGroup === undefined) {
            alert("You must have a valid default group to enroll a user");
        } else {
            var colMap = {};
            colMap[util.COL_ENROLLER_ID] = userId;
            colMap[util.COL_GROUP_MODIFY] = defaultGroup;
            colMap[util.COL_REGION] = util.getRegionFromDefaultGroup(defaultGroup);
            colMap[util.COL_DISTRICT] = util.getDistrictFromDefaultGroup(defaultGroup);
            colMap[util.COL_WARD] = util.getWardFromDefaultGroup(defaultGroup);
            colMap[util.COL_VILLAGE] = util.getVillageFromDefaultGroup(defaultGroup);

            odkTables.addRowWithSurvey(null, 'business', 'enrollment', null, colMap);

            // TODO: Have separate form that allows coordinator to choose the values
            // Within the form - that could also set the metadata for the group by default?
            // Otherwise need to have some sort of chooser - but would be better to concatenate automatically!
        }
    });

    var firmsPendingAuthButton = $('#firms-pending-auth-button');
    firmsPendingAuthButton.on('click', function() {
        queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_AUTHORIZE;
        queryParamsToAppend += '&' + util.PENDING_AUTHORIZATION + '=' + util.TRUE;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_AGENT;
        queryParamsToAppend += '&' + util.USER_ID + '=' + userId;
        odkTables.launchHTML(null, VILLAGE_URL + queryParamsToAppend);
    });

    var agtBusListButton = $('#agent_business-list-button');
    agtBusListButton.on('click', function() {
        if (userId !== null && userId !== undefined) {
            queryParamsToAppend += '?' + util.COL_ENROLLER_ID + '=' + userId;
            odkTables.launchHTML(null, busListAgentUrl + queryParamsToAppend);
        }
    });
}
