
var viewType;
var pendingAuth;
var pendingVer;
var actionToPerform;
var completed;
function display() {
    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    // TODO: Need to figure out how to show the badge for pending auth/ver
    // Will do that once I have tables for villages, subvillages, and test data

    viewType = util.getQueryParameter(util.VIEW_TYPE);
    pendingAuth = util.getQueryParameter(util.PENDING_AUTHORIZATION);
    pendingVer = util.getQueryParameter(util.PENDING_VERIFICATION);
    actionToPerform = util.getQueryParameter(util.ACTION);
    completed = util.getQueryParameter(util.COMPLETED);

    var REGION_ATTR = 'region';

    var village1Button = $('#village1-button');
    village1Button.on('click', function () {
        determineButtonAction(village1Button.attr(REGION_ATTR));
    });

    var village2Button = $('#village2-button');
    village2Button.on('click', function () {
        determineButtonAction(village2Button.attr(REGION_ATTR));
    });

    var village3Button = $('#village3-button');
    village3Button.on('click', function () {
        determineButtonAction(village3Button.attr(REGION_ATTR));
    });

    var village4Button = $('#village4-button');
    village4Button.on('click', function () {
        determineButtonAction(village4Button.attr(REGION_ATTR));
    });
}

function determineButtonAction(village) {

    var listURL = 'config/assets/listVerAuthComAll.html';
    var businessAuthorizeURL = 'config/tables/business/html/business_authorize.html';
    var businessVerifyURL = 'config/tables/business/html/business_verify.html';

    var queryParamToAppend = '';
    var urlToUse = '';

    // A region should always be associated with a button
    if (village !== null && village !== undefined) {
        queryParamToAppend = '?' + util.VILLAGE + '=' + village;
    }

    if (viewType !== null && viewType !== undefined) {
        queryParamToAppend += '&' + util.VIEW_TYPE + '=' + viewType;
    }

    if (actionToPerform === util.ACTION_LIST) {
        urlToUse = listURL + queryParamToAppend;

    } else if (actionToPerform === util.ACTION_AUTHORIZE) {
        urlToUse = businessAuthorizeURL + queryParamToAppend;
    } else if (actionToPerform === util.ACTION_VERIFY) {
        urlToUse = businessVerifyURL + queryParamToAppend;
    }

    if (urlToUse !== '' && urlToUse !== null && urlToUse !== undefined) {
        odkTables.launchHTML(null, urlToUse);
    }
}
