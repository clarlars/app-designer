/* global $, odkData, odkCommon, odkTables, util */
/* exported display */

'use strict';

var VEO_AUTHORIZE_QUERY = 'SELECT * FROM business WHERE village = ? AND ' +
    '(' + util.COL_VEO_AUTHORIZED + ' ISNULL OR ' + util.COL_VEO_AUTHORIZED + ' = ?)';

var AGENT_VERIFY_QUERY = 'SELECT * FROM business WHERE village = ? AND ' +
    '(' + util.COL_COORDINATOR_VERIFIED + ' ISNULL OR ' + util.COL_COORDINATOR_VERIFIED+ ' = ?)';

var baUserId;
var baLocale;

function successCB(result) {
    var tableWrapper = $('#list');

    var verTable = $('<table>');
    verTable.attr('id','bizTable');
    verTable.attr('class', 'table');
    var verHdr = $('<thead>');
    var verHdrRow = $('<tr>');
    var verHdrBLabel = $('<td>');
    verHdrBLabel.text(odkCommon.localizeText(baLocale, "business"));
    verHdrRow.append(verHdrBLabel);

    var verHdrValidLabel = $('<td>');
    verHdrValidLabel.text(odkCommon.localizeText(baLocale, "valid"));
    verHdrRow.append(verHdrValidLabel);

    var verHdrInvalidLabel = $('<td>');
    verHdrInvalidLabel.text(odkCommon.localizeText(baLocale, "invalid"));
    verHdrRow.append(verHdrInvalidLabel);

    var verHdrUnsureLabel = $('<td>');
    verHdrUnsureLabel.text(odkCommon.localizeText(baLocale, "unsure"));
    verHdrRow.append(verHdrUnsureLabel);

    verHdr.append(verHdrRow);
    verTable.append(verHdr);

    function addPopoverContent(btn, res, idx) {
        btn.attr('data-toggle', 'popover');
        btn.attr('data-container', 'body');
        btn.attr('data-placement', 'top');
        var busOwner = res.getData(idx, 'business_owner_name');
        var sectorType = res.getData(idx, 'sector_type');
        var popOverContent = '';
        var busOwnerLbl = odkCommon.localizeText(baLocale, "business_owner_name") + ': ';
        var sectorTypeLbl = odkCommon.localizeText(baLocale, "sector_type") + ': ';
        if (busOwner !== null && busOwner !== undefined) {
            popOverContent += busOwnerLbl + busOwner;
        }

        if (sectorType !== null && sectorType !== undefined) {
            if (popOverContent.length > 0) { popOverContent += ', '; }
            popOverContent += sectorTypeLbl + sectorType;
        }
        btn.attr('data-content', popOverContent);
    }

    for (var i = 0; i < result.getCount(); i++) {
        var rowId = result.getRowId(i);
        var busRow = $('<tr>');
        var busCol = $('<td>');
        var busBtn = $('<button>')
        busBtn.text(result.getData(i, 'firm_name'));
        var bizNameBtn = 'bizBtn' + i;
        busBtn.attr('name', bizNameBtn);
        busBtn.attr('rowId', rowId);
        busBtn.attr('class', 'btn btn-default');
        // Add popover content
        addPopoverContent(busBtn, result, i);
        busCol.append(busBtn);
        var bizName = 'biz' + i;
        busCol.attr('name', bizName);
        busCol.attr('rowId', rowId);
        busRow.append(busCol);

        var valCol = $('<td>');
        var valInput = $('<input>');
        valInput.attr('type', 'radio');
        var inputBizName = 'inputBiz' + i;
        valInput.attr('name', inputBizName);
        valInput.attr('rowId', rowId);
        valInput.attr('value', 1);
        valCol.append(valInput);
        busRow.append(valCol);

        var invCol = $('<td>');
        var invInput = $('<input>');
        invInput.attr('type', 'radio');
        invInput.attr('name', inputBizName);
        invInput.attr('rowId', rowId);
        invInput.attr('value', 0);
        invCol.append(invInput);
        busRow.append(invCol);

        var unsureCol = $('<td>');
        var unsureInput = $('<input>');
        unsureInput.attr('type', 'radio');
        unsureInput.attr('name', inputBizName);
        unsureInput.attr('rowId', rowId);
        unsureInput.attr('value', -1);
        unsureCol.append(unsureInput);
        busRow.append(unsureCol);
        verTable.append(busRow);
    }
    tableWrapper.append(verTable);

    // Enable popovers!
    $('[data-toggle="popover"]').popover();

    var submitBtn = $('#submitBtn');
    if (result.getCount() <= 0) {
        submitBtn.prop('disabled', true);
    } else {
        submitBtn.prop('disabled', false);
    }

    submitBtn.on('click', function (evt) {
        var clickedButton = $(evt.target);
        var closestButton = clickedButton.closest('.button');
        var btnAction = closestButton.attr(util.BUSINESS_BTN_ACTION);

        var rows = $('tr').not('thead tr');
        var promisesArray = [];

        for (var i = 0; i < rows.length; i++) {
            var namedRowItem = 'inputBiz' + i;
            var checkedValue = $('input[name=' + namedRowItem + ']:checked').val();
            var rowId = $('input[name=' + namedRowItem + ']:checked').attr('rowId');

            if (checkedValue !== null && checkedValue !== undefined) {
                promisesArray.push(new Promise(function (resolve, reject) {
                    var colMap = {};
                    if (btnAction === util.ACTION_AUTHORIZE) {
                        // TODO: Add these two in authorization_date, authorization_veo
                        colMap[util.COL_VEO_AUTHORIZED] = checkedValue;
                        colMap[util.COL_AUTHORIZER_ID] = baUserId;
                        colMap[util.COL_AUTHORIZATION_DATE] = odkCommon.toOdkTimeStampFromDate(new Date());

                    } else {
                        // TODO: Add these two in verification_date, verification_agent
                        colMap[util.COL_COORDINATOR_VERIFIED] = checkedValue;
                        colMap[util.COL_VERIFIER_ID] = baUserId;
                        colMap[util.COL_VERIFICATION_DATE] = odkCommon.toOdkTimeStampFromDate(new Date());
                    }
                    odkData.updateRow('business', colMap, rowId, resolve, reject);

                }));
            }
        }

        if (promisesArray.length > 0) {
            Promise.all(promisesArray).then(function (resultArray) {
                alert('All ' + resultArray.length + ' businesses have been updated');
                submitBtn.prop('disabled', true);
            }).catch(function (reason) {
                alert('Some businesses not updated successfully: ' + reason);
                submitBtn.prop('disabled', true);
            });
        } else {
            alert('No businesses to update');
        }
    });
}

function failureCB(error) {
    console.log('failureCB: error while retrieving business to verify: ' + error);
}

function display(action) {

    baLocale = odkCommon.getPreferredLocale();

    var veoAuthHdr = $('#veo-authorization-hdr');
    if (veoAuthHdr !== null && veoAuthHdr !== undefined) {
        veoAuthHdr.text(odkCommon.localizeText(baLocale, "veo_authorization"));
    }

    var coordVerHdr = $('#coordinator-verification-hdr');
    if (coordVerHdr !== null && coordVerHdr !== undefined) {
        $('#coordinator-verification-hdr').text(odkCommon.localizeText(baLocale, "coordinator_verification"));
    }

    $('#submitBtn').text(odkCommon.localizeText(baLocale, "submit"));

    var village = util.getQueryParameter(util.VILLAGE);
    baUserId = util.getQueryParameter(util.USER_ID);

    var url = AGENT_VERIFY_QUERY;
    if (action === util.ACTION_AUTHORIZE) {
        url = VEO_AUTHORIZE_QUERY;
    }
    odkData.arbitraryQuery('business',
        url, [village, util.NEG_ONE], null, null, successCB, failureCB);
}
