
var viewType;
var pendingAuth;
var pendingVer;
var actionToPerform;
var completed;
var REGION_ATTR = 'region';

function display() {
    // TODO: Need to figure out how to show the badge for pending auth/ver

    viewType = util.getQueryParameter(util.VIEW_TYPE);
    pendingAuth = util.getQueryParameter(util.PENDING_AUTHORIZATION);
    pendingVer = util.getQueryParameter(util.PENDING_VERIFICATION);
    actionToPerform = util.getQueryParameter(util.ACTION);
    completed = util.getQueryParameter(util.COMPLETED);

    $.get( "village.csv", function( data ) {
        loadVillages(data);
    });
}

function loadVillages(data) {

    var csvVillages = $.csv.toObjects(data);



    var villages = _.chain(csvVillages).pluck('village_name').uniq().value();

    var btnDiv = $('#buttonsDiv');

    for (i = 0; i < villages.length; i++) {
        var vBtn = $('<button>');
        var vName = villages[i];
        vBtn.text(vName);
        vBtn.attr("class", "button");
        vBtn.attr("region", vName);
        vBtn.on('click', function (evt) {
            determineButtonAction(evt);
        });
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
