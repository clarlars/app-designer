
var viewType;
var pendingAuth;
var pendingVer;
var actionToPerform;
var completed;
var REGION_ATTR = 'region';

function display() {
    viewType = util.getQueryParameter(util.VIEW_TYPE);
    pendingAuth = util.getQueryParameter(util.PENDING_AUTHORIZATION);
    pendingVer = util.getQueryParameter(util.PENDING_VERIFICATION);
    actionToPerform = util.getQueryParameter(util.ACTION);
    completed = util.getQueryParameter(util.COMPLETED);

    util.getVillagesByPendingAuth(loadVillages, failCB);
}

function failCB(error) {
    console.log('failCB: error occurred while trying to get villages: ' + error);
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

    var body = $('#main');
    body.css('background-image', 'url(img/bw-business-bubble.jpg)');
}

function determineButtonAction(evt) {

    var listURL = 'config/assets/listVerAuthComAll.html';
    var businessAuthorizeURL = 'config/tables/business/html/business_authorize.html';
    var businessVerifyURL = 'config/tables/business/html/business_verify.html';

    var queryParamToAppend = '';
    var urlToUse = '';

    var clickedButton = $(evt.target);
    var closestButton = clickedButton.closest('.button');
    var village = closestButton.attr(REGION_ATTR);

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
