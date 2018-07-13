var indexUserId = "";
function display() {
    var signUpURL = 'config/assets/signUp.html';
    var body = $('#main');

    body.css('background-image', 'url(img/bw-business-bubble.jpg)');

    // Check if the user table has 1 user in it!!
    var queryTablePromise = new Promise(function (resolve, reject) {
        odkData.simpleQueryLocalOnlyTables(util.USER_TABLE, null, null, null, null, null,
            null, null, null, resolve, reject);
    });

    queryTablePromise.then(function (result) {
        if (result.getCount() > 1) {
            var errText = 'More than one user exists on this device!!'
            alert(errText);
        } else if (result.getCount() < 1) {
            var errText = 'No user exists on this device!!'
            console(errText);
            odkTables.launchHTML(null, signUpURL);
        } else {
            var userName = $('#user-name');
            userName.text(result.getData(0, util.NAME));
            indexUserId = result.getData(0, util.USER_ID);
            initButtons();
        }

    }).catch(function (reason) {
        errTxt = 'Error while retrieving user: ' + reason;
        // This may be the first time we are using this device - try to sign up
        odkTables.launchHTML(null, signUpURL);
        console.log(errTxt);
    });
}

function initButtons() {
    var agentButton = $('#agent-button');
    agentButton.prop('disabled', false);
    agentButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/agentView.html?' + util.USER_ID + '=' + indexUserId);
    });

    var coordinatorButton = $('#coordinator-button');
    coordinatorButton.prop('disabled', false);
    coordinatorButton.on('click', function() {
        var listURL = 'config/assets/listVerAuthComAll.html';
        var queryParamsToAppend = '?' + util.ACTION + '=' + util.ACTION_LIST;
        queryParamsToAppend += '&' + util.VIEW_TYPE + '=' + util.VIEW_TYPE_COORDINATOR;
        odkTables.launchHTML(null, listURL + queryParamsToAppend);
    });
}
