/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

var indexUserId = '';

function initAgentButton() {
    var agentButton = $('#agent-button');
    agentButton.prop('disabled', false);
    agentButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/agentView.html?' + util.USER_ID + '=' + indexUserId);
    });
}

function initCoordinatorButton() {
    var coordinatorButton = $('#coordinator-button');
    coordinatorButton.removeAttr('style');
    coordinatorButton.prop('disabled', false);
    coordinatorButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/coordinatorView.html?' + util.USER_ID + '=' + indexUserId);
    });
}

function initButtons() {
    initAgentButton();
    initCoordinatorButton();
}

function checkDefaultGroupForOptions() {
    // show Coordinator button if user default group is admin
    var getDefaultGroupPromise = new Promise(function(resolve, reject) {
        odkData.getDefaultGroup(resolve, reject);
    });

    getDefaultGroupPromise.then(function(result) {
        var defGrp = result.getDefaultGroup();
        if (defGrp !== null && defGrp !== undefined && (util.ADMIN_DEFAULT_GROUPS.indexOf(defGrp) > -1)) {
            initButtons();
        } else {
            initAgentButton();
        }

    }).catch(function(error) {
        console.log('Could not get default group for user: ' + error);
        initAgentButton();
    });
}

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
            var tooManyUsersError = 'More than one user exists on this device!!';
            alert(tooManyUsersError);
            console(tooManyUsersError);
        } else if (result.getCount() < 1) {
            var noUserError = 'No user exists on this device!!';
            alert(noUserError);
            console(noUserError);
            odkTables.launchHTML(null, signUpURL);
        } else {
            var userName = $('#user-name');
            userName.text(result.getData(0, util.NAME));
            indexUserId = result.getData(0, util.USER_ID);
            checkDefaultGroupForOptions();
        }

    }).catch(function (reason) {
        var errTxt = 'Error while retrieving user: ' + reason;
        // This may be the first time we are using this device - try to sign up
        odkTables.launchHTML(null, signUpURL);
        console.log(errTxt);
    });
}
