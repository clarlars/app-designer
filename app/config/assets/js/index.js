/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

var indexUserId = '';
var indexDefaultGroup = '';

function initAgentButton() {
    var agentButton = $('#agent-button');
    agentButton.removeAttr('style');
    agentButton.prop('disabled', false);
    $('#login-text').text('');
    agentButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/agentView.html?' + util.USER_ID + '=' + indexUserId + '&' +
            util.DEFAULT_GROUP + '=' + indexDefaultGroup);
    });
}

function initCoordinatorButton() {
    var coordinatorButton = $('#coordinator-button');
    coordinatorButton.removeAttr('style');
    coordinatorButton.prop('disabled', false);
    $('#login-text').text('');
    coordinatorButton.on('click', function() {
        odkTables.launchHTML(null, 'config/assets/coordinatorView.html?' + util.USER_ID + '=' + indexUserId);
    });
}

function isUserAdmin(user) {
    for (var i = 0; i < user.roles.length; i++) {
        if (util.ADMIN_DEFAULT_GROUPS.indexOf(user.roles[i]) > -1) {
            return true;
        }
    }

    return false;
}

function initAdminPicker(users) {
    var coorId = $('#coordinator_id');
    coorId.removeAttr('style');
    var adminId = $('#admin_user_id');
    adminId.prop('disabled', false);

    var first = false;
    for (var idx = 0; idx < users.length; idx++) {
        if (isUserAdmin(users[idx]) ===  true) {
            var uOpt = $('<option>');
            var uName = users[idx].full_name;
            var uId = users[idx].user_id;
            uOpt.val(uId);
            uOpt.text(uName);
            adminId.append(uOpt);

            if (first === false) {
                first = true;
                indexUserId = uId;
                uOpt.attr('selected', 'selected')
            }
        }
    }

    adminId.change(function () {
      indexUserId = adminId.val();
    });
}




function checkDefaultGroupForOptions() {
    // Get usersInfo to get userid
    var getUsersInfoPromise = new Promise(function(resolve, reject) {
        odkData.getUsers(resolve, reject);
    });

    getUsersInfoPromise.then(function(result) {
        var users = [];
        users = result.getUsers();

        if (users.length > 1) {
            initAdminPicker(users);
        } else {
            indexUserId = users[0].user_id;
        }

        return new Promise(function(resolve, reject) {
            odkData.getDefaultGroup(resolve, reject);
        });

    }).then(function(result) {
        var defGrp = result.getDefaultGroup();
        if (defGrp !== null && defGrp !== undefined) {
            var body = $('#main');
            body.css('background-image', 'url(img/bw-business-bubble.jpg)');
            if (util.ADMIN_DEFAULT_GROUPS.indexOf(defGrp) > -1)
            {
                initCoordinatorButton();
            } else {
                if (util.checkValidAgentDefaultGroup(defGrp)) {
                    indexDefaultGroup = defGrp;
                    initAgentButton();
                } else {
                    $('#login-text').text('Invalid agent default group.')
                }
            }

        } else {
            $('#login-text').text('You must login to use eKichabi.')
            // TODO: Show login button to launch sync
        }

    }).catch(function(error) {
        console.log('Could not get default group or userid for user: ' + error);
        $('#login-text').text('Error getting default group or userid.  User must have a default group and valid userid to use eKichabi.')
    });
}

function display() {
    var locale = odkCommon.getPreferredLocale();
    $('#ekichabi-title').text(odkCommon.localizeText(locale, "welcome_to_ekichabi"));
    $('#agent-button').text(odkCommon.localizeText(locale, "agent"));
    $('#coordinator-button').text(odkCommon.localizeText(locale, "coordinator"));

    checkDefaultGroupForOptions();
}
