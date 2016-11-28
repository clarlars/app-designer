/**
 * File used to create list view for large data set test
 */

'use strict';
var largeDataSetResult = {};
var limit = 10;
var offset = 0;
var idxStart = -1;
var rowCount = 0;
var testUUID = 0;
var device = 'Nexus 6 2015';
var os = '5.1';
var perfTestName = 'TST001';

var prevResults = function () {
    offset -= limit;

    if (offset < 0) {offset = 0;}

    console.log('prevResults called. limit=' + limit + ' offset=' + offset);

    // Empty the list and then re-render
    $('#list').empty();
    render(idxStart);
}

var nextResults = function () {
    offset += limit;

    if (rowCount > 0 && offset > rowCount) {offset = 0;}

    console.log('nextResults called. limit=' + limit + ' offset=' + offset);

    // Empty the list and then re-render
    $('#list').empty();
    render(idxStart);
}

var cbSuccess = function (result) {
    largeDataSetResult = result;

    // Write row to the database
    var desc = 'Query large_dataset table with limit=' + limit + ' offset=' + offset;
    var step = 'In cbSuccess for odkData.getViewData()';
    var numOfResultRows = largeDataSetResult.getCount();
    addTestDataRow(perfTestName, desc, step, device, os, rowCount, numOfResultRows, cbAddTestRowSuccess, cbAddTestRowFailure);

    return (function() {
        displayGroup();
    }());
}

var cbFailure = function (error) {
    console.log('cbFailure: failed with error ' + error);
}

var cbAddTestRowSuccess = function (result) {
    console.log('cbAddTestRowSuccess: added test row successful');
}

var cbAddTestRowFailure = function (error) {
    console.log('cbAddTestRowFailure: failed with error ' + error);
}

var render = function(fIdxStart) {
    idxStart = fIdxStart;
    console.log('render called. idxStart: ' + idxStart);

    if (idxStart === 0) {
        $('#prevButton').on('click', function () {
           prevResults();
        });

        $('#nextButton').on('click', function () {
            nextResults();
        })

        // Define click listener for any cell in the list
        // To open the appropriate detail view
        $('#list').click(function(e) {
            var tableId = largeDataSetResult.getTableId();

            var jqueryObject = $(e.target);
            var containingDiv = jqueryObject.closest('.item_space');
            var rowId = containingDiv.attr('row_id');
            console.log('clicked with row_id: ' + rowId);
            if (rowId !== null && rowId !== undefined) {
                odkTables.openDetailView(tableId, rowId, null);
            }
        });

        var tempLimit = util.getQueryParameter('limit');
        var tempValue = util.verifyIntegerQueryParameterValue(tempLimit);
        limit = tempValue === 0 ? limit : tempValue;

        var tempOffset = util.getQueryParameter('offset');
        offset = util.verifyIntegerQueryParameterValue(tempOffset);

        var tempRowCnt = util.getQueryParameter('count');
        rowCount = util.verifyIntegerQueryParameterValue(tempRowCnt);

        // We reuse the testUUID until render(0) is called
        testUUID = util.genUUID();

        idxStart++;
    }

    // Write row to the database
    var desc = 'Query large_dataset table with limit=' + limit + ' offset=' + offset;
    var step = 'Calling odkData.getViewData in render(' + idxStart + ')';
    addTestDataRow(perfTestName, desc, step, device, os, rowCount, '0', cbAddTestRowSuccess, cbAddTestRowFailure);
    odkData.getViewData(cbSuccess, cbFailure, limit, offset);

}

var displayGroup = function () {
    console.log('displayGroup called with limit: '  + limit + ' offset: ' + offset);
    console.log('called with largeDataSet.count() = : ' + largeDataSetResult.getCount());

    // Now that we are able the chunk requests - having
    // additional logic for chunking for the display doesn't make sense
    for (var i = 0; i < largeDataSetResult.getCount(); i++) {

        var item = $('<li>');
        item.attr('row_id', largeDataSetResult.getRowId(i));
        item.attr('id', largeDataSetResult.getRowId(i));
        item.attr('class', 'item_space');
        item.text('Object Name: ' + largeDataSetResult.getData(i, 'obj_name'));

        var chevron = $('<img>');
        chevron.attr('src', odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
        chevron.attr('class','chevron');
        item.append(chevron);

        var field1 = $('<li>');
        field1.attr('class', 'detail');
        field1.text('Description: ' + largeDataSetResult.getData(i, 'description'));
        item.append(field1);


        var field2 = $('<li>');
        field2.attr('class', 'detail');
        field2.text('Scan Code: ' + largeDataSetResult.getData(i, 'scancode'));
        item.append(field2);

        $('#list').append(item);

        var borderDiv = $('<div>');
        borderDiv.addClass('divider');

        $('#list').append(borderDiv);
    }

    var desc = 'Query large_dataset table with limit=' + limit + ' offset=' + offset;
    var step = 'Finish displayGroup()';
    var numOfResultRows = largeDataSetResult.getCount();
    addTestDataRow(perfTestName, desc, step, device, os, rowCount, numOfResultRows, cbAddTestRowSuccess, cbAddTestRowFailure);
}

var addTestDataRow = function(testName, testDesc, testStep, testDevice, testOS, numOfRowsInTable, resultRows, cbSuccessFn, cbFailureFn) {
    var struct = {};
    struct['testId'] = testUUID
    struct['test'] = testName;
    struct['description'] = testDesc
    struct['step'] = testStep;
    struct['device'] = testDevice;
    struct['os'] = testOS;
    struct['rowsInTable'] = numOfRowsInTable;
    struct['resultRows'] = resultRows;

    // Get the current time 
    var date = new Date();
    struct['time'] = odkCommon.toOdkTimeFromDate(date);;
    
    var uuidForRow = util.genUUID();
    odkData.addRow('testRun', struct, uuidForRow, cbSuccessFn, cbFailureFn);
}