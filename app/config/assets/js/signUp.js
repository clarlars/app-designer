/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

var signUpUserParams = {};

function getInsertIntoLocalTablePromise() {
    return new Promise(function (resolve, reject) {
        odkData.insertLocalOnlyRow(util.LOCAL_USER_TABLE, signUpUserParams, resolve, reject);
    });
}

function getUserTableCreateRowPromise() {
    return new Promise(function (resolve, reject) {
        odkData.addRow(util.USER_TABLE, signUpUserParams, util.genUUID(), resolve, reject);

    });
}

function createUser() {

    // Disable button after it has been clicked
    var addUserBtn = $('#add-user');
    addUserBtn.prop('disabled', true);

    var createUserTablePromise = new Promise(function(resolve, reject) {
        var colTypeMap = [];
        var eKey = util.ELEMENT_KEY;
        var eName = util.ELEMENT_NAME;
        var eType = util.ELEMENT_TYPE;
        var listCE = util.LIST_CHILD_ELEMENT_KEYS;

        var col1 = {};
        col1[eKey] = util.USER_ID;
        col1[eName] = util.USER_ID;
        col1[eType] = 'string';
        col1[listCE] = '[]';
        colTypeMap.push(col1);

        var col2 = {};
        col2[eKey] = util.NAME;
        col2[eName] = util.NAME;
        col2[eType] = 'string';
        col2[listCE] = '[]';
        colTypeMap.push(col2);

        var col3 = {};
        col3[eKey] = util.PHONE_NUMBER;
        col3[eName] = util.PHONE_NUMBER;
        col3[eType] = 'string';
        col3[listCE] = '[]';
        colTypeMap.push(col3);

        var col4 = {};
        col4[eKey] = util.VILLAGE;
        col4[eName] = util.VILLAGE;
        col4[eType] = 'string';
        col4[listCE] = '[]';
        colTypeMap.push(col4);

        odkData.createLocalOnlyTableWithColumns(util.LOCAL_USER_TABLE, colTypeMap, resolve, reject);
    });

    signUpUserParams[util.USER_ID] = util.genUUID();
    signUpUserParams[util.VILLAGE] = $('#village').val();
    signUpUserParams[util.PHONE_NUMBER] =  $('#phone-number').val();
    signUpUserParams[util.NAME] = $('#user-name').val();

    createUserTablePromise.then(function(result){
        // Check if that user already exists in the user table
        // Assuming village and phone number should be unique enough as name is just used for display
        // use existing uuid if they do
        return new Promise(function(resolve, reject) {
            var whereCls = util.VILLAGE + ' = ? AND ' + util.PHONE_NUMBER + ' = ?';
            odkData.query(util.USER_TABLE, whereCls, [signUpUserParams[util.VILLAGE], signUpUserParams[util.PHONE_NUMBER]],
                null, null, null, null, null, null, null, resolve, reject);
        });
    }).then(function(result){
        if (result.getCount() === 1) {
            // User found on server - only need to update local table
            signUpUserParams[util.USER_ID] = result.getData(0, util.USER_ID);
            return getInsertIntoLocalTablePromise();

        } else if (result.getCount() > 1 ) {
            var errText = 'More than 1 user with these credentials on the server!! ' +
                'Please resolve before continuing!';
            alert(errText);
            console.log(errText);
            throw errText;
        } else {
            // NO user found on server
            // Need to add user data to the server
            return getUserTableCreateRowPromise().then(function(result){
                if (result.getCount() === 1) {
                    return getInsertIntoLocalTablePromise();
                } else {
                    var couldNotUpdateUserError = 'Could not update user table with this users info. P' +
                        'lease resolve before continuing';
                    alert(couldNotUpdateUserError);
                    console.log(couldNotUpdateUserError);
                    throw couldNotUpdateUserError;
                }
            });
        }
    }).then(function(result) {
        return new Promise(function (resolve, reject) {
            odkData.simpleQueryLocalOnlyTables(util.LOCAL_USER_TABLE, null, null, null, null, null,
                null, null, null, resolve, reject);
        });
    }).then(function (result) {
        if (result.getCount() === 1) {
            odkCommon.closeWindow(util.CLOSE_RESULT_CODE_SUCCESS);

        } else {
            var errText = 'There should only be 1 user on this device!!';
            alert(errText);
            console.log(errText);
            throw errText;
        }

    }).catch(function (reason) {
        var errTxt = 'Error while creating user: ' + reason;
        alert(errTxt);
        console.log(errTxt);
        addUserBtn.prop('disabled', true);
    });
}

function finishDisplay(data) {
    var selectId = $('#village');
    for (var i = 0; i < data.getCount(); i++) {
        var vName = data.getData(i, util.VILLAGE);
        var vOpt = $('<option>');
        vOpt.val(vName);
        vOpt.text(vName);

        selectId.append(vOpt);
        if (i === 0) {
            vOpt.attr('selected', 'selected');
        }
    }

    var addUserBtn = $('#add-user');
    addUserBtn.on('click', createUser);
}

function failCB(error) {
    console.log('Error while trying to get list of regions: ' + error);
}

function display() {
    var locale = odkCommon.getPreferredLocale();
    $('#ekichabi-title').text(odkCommon.localizeText(locale, "sign_up_for_ekichabi"));
    $('#lbl-user-name').text(odkCommon.localizeText(locale, "name"));
    $('#lbl-phone-number').text(odkCommon.localizeText(locale, "phone_number"));
    $('#lbl-village').text(odkCommon.localizeText(locale, "village"));
    $('#add-user').text(odkCommon.localizeText(locale, "submit"));

    util.getVillages(finishDisplay, failCB);
}
