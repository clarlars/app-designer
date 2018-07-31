/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

function createUser() {

    var addUserBtn = $('#add-user');

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

        odkData.createLocalOnlyTableWithColumns(util.USER_TABLE, colTypeMap, resolve, reject);
    });

    createUserTablePromise.then(function(result) {
        return new Promise(function (resolve, reject) {
            var colMap = {};
            colMap[util.USER_ID] = util.genUUID();
            colMap[util.VILLAGE] = $('#village').val();
            colMap[util.PHONE_NUMBER] = $('#phone-number').val();
            colMap[util.NAME] = $('#user-name').val();

            odkData.insertLocalOnlyRow(util.USER_TABLE, colMap, resolve, reject);
        });
    }).then(function(result) {
        return new Promise(function (resolve, reject) {
            odkData.simpleQueryLocalOnlyTables(util.USER_TABLE, null, null, null, null, null,
                null, null, null, resolve, reject);
        });
    }).then(function (result) {
        addUserBtn.prop('disabled', true);
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

    util.getVillages(finishDisplay, failCB);
}
