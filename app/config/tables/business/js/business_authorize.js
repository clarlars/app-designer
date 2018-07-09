var AGENT_VERIFY_QUERY = 'SELECT * FROM business WHERE village = ? AND ' +
    '(has_been_authorized_by_veo ISNULL OR has_been_authorized_by_veo = ?)';

function display() {
    var village = util.getQueryParameter(util.VILLAGE);

    odkData.arbitraryQuery('business',
        AGENT_VERIFY_QUERY, [village, 0], null, null, successCB, failureCB);
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
        verTable.append(busRow);
    }
    tableWrapper.append(verTable);

    var submitBtn = $('#submitBtn');
    if (result.getCount() <= 0) {
        submitBtn.prop('disabled', true);
    } else {
        submitBtn.prop('disabled', false);
    }

    submitBtn.on('click', function () {
        var rows = $('tr').not('thead tr');
        var promisesArray = [];

        for (var i = 0; i < rows.length; i++) {
            var namedRowItem = 'inputBiz' + i;
            var checkedValue = $('input[name=' + namedRowItem + ']:checked').val();
            var rowId = $('input[name=' + namedRowItem + ']:checked').attr('rowId');

            if (checkedValue !== null && checkedValue !== undefined) {
                promisesArray.push(new Promise(function (resolve, reject) {
                    var colMap = {};
                    colMap['has_been_authorized_by_veo'] = checkedValue;

                    // TODO: Add these two in
                    // authorization_date
                    // authorization_veo
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
