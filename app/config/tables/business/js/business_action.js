var VEO_AUTHORIZE_QUERY = 'SELECT * FROM business WHERE village = ? AND ' +
    '(' + util.COL_VEO_AUTHORIZED + ' ISNULL OR ' + util.COL_VEO_AUTHORIZED + ' = ?)';

var AGENT_VERIFY_QUERY = 'SELECT * FROM business WHERE village = ? AND ' +
    '(' + util.COL_AGENT_VERIFIED + ' ISNULL OR ' + util.COL_AGENT_VERIFIED+ ' = ?)';

var baUserId;
function display(action) {
    var village = util.getQueryParameter(util.VILLAGE);
    baUserId = util.getQueryParameter(util.USER_ID);

    var url = AGENT_VERIFY_QUERY;
    if (action === util.ACTION_AUTHORIZE) {
        url = VEO_AUTHORIZE_QUERY;
    }
    odkData.arbitraryQuery('business',
        url, [village, util.NEG_ONE], null, null, successCB, failureCB);
}

function successCB(result) {
    var tableWrapper = $('#list');

    var verTable = $('<table>');
    verTable.attr('id','bizTable');
    verTable.attr('class', 'table');
    var verHdr = $('<thead>');
    var verHdrRow = $('<tr>');
    var verHdrBLabel = $('<td>');
    verHdrBLabel.text('Business');
    verHdrRow.append(verHdrBLabel);

    var verHdrValidLabel = $('<td>');
    verHdrValidLabel.text('Valid');
    verHdrRow.append(verHdrValidLabel);

    var verHdrInvalidLabel = $('<td>');
    verHdrInvalidLabel.text('Invalid');
    verHdrRow.append(verHdrInvalidLabel);

    var verHdrUnsureLabel = $('<td>');
    verHdrUnsureLabel.text('Unsure');
    verHdrRow.append(verHdrUnsureLabel);

    verHdr.append(verHdrRow);
    verTable.append(verHdr);

    for (var i = 0; i < result.getCount(); i++) {
        var rowId = result.getRowId(i);
        var busRow = $('<tr>');
        var busCol = $('<td>');
        busCol.text(result.getData(i, 'firm_name'));
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
                    } else {
                        var colMap = {};
                        // TODO: Add these two in verification_date, verification_agent
                        colMap[util.COL_AGENT_VERIFIED] = checkedValue;
                        colMap[util.COL_VERIFIER_ID] = baUserId;
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
