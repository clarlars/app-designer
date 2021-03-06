/**
 * This is the file that will be creating the list view.
 */
/* global $, odkTables */
'use strict';

// if (JSON.parse(odkCommon.getPlatformInfo()).container === 'Chrome') {
//     console.log('Welcome to Tables debugging in Chrome!');
//     $.ajax({
//         url: odkCommon.getFileAsUrl('output/debug/plot_data.json'),
//         async: false,  // do it first
//         success: function(dataObj) {
//             if (dataObj === undefined || dataObj === null) {
//                 console.log('Could not load data json for table: plot');
//             }
//             window.data.setBackingObject(dataObj);
//         }
//     });
// }

// Use chunked list view for larger tables: We want to chunk the displays so
// that there is less load time.
var plotResultSet = {};   
var idxStart = -1;
    
function cbSuccess(result) {
    plotResultSet = result;
  
    // return (function() {
    displayGroup(idxStart);
    // }());
}

function cbFailure(error) {

    console.log('plot_list: cbFailure failed with error: ' + error);
}
     
/**
 * Called when page loads. idxStart is the index of the row that should be
 * displayed at this iteration through the loop.
 */
var resumeFn = function(fidxStart) {
    odkData.getViewData(cbSuccess, cbFailure);

    idxStart = fidxStart;
    // if (idxStart === 0) {
    //     // We want to be able to drag and drop without the drop triggering a click.
    //     // Idea for this taken from:
    //     // http://stackoverflow.com/questions/14301026/how-do-i-avoid-a-click-event-firing-after-dragging-a-gridster-js-widget-with-cli

    //     var preventClick = function(e) {
    //         e.stopPropagation();
    //         e.preventDefault();
    //     };

    //     $('.gridster ul').gridster({
    //         widget_margins: [10, 10],
    //         widget_base_dimensions: [140, 140],
    //         draggable: {
    //             start: function(event, ui) {
    //                 // stop propagating in the capture phase.
    //                 ui.$player[0].addEventListener('click', preventClick, true);
    //             },
    //             stop: function(event, ui) {
    //                 var player = ui.$player;
    //                 setTimeout(function() {
    //                     player[0].removeEventListener(
    //                       'click',
    //                       preventClick,
    //                       true);
    //                 });
    //             }
    //         }
    //     });
    // }

    console.log('resumeFn called. idxStart: ' + idxStart);
    // The first time through construct any constants you need to refer to
    // and set the click handler on the list elements.
    if (idxStart === 0) {
        // This add a click handler on the wrapper ul that will handle all of
        // the clicks on its children.
        $('#list').click(function(e) {
            var tableId = plotResultSet.getTableId();
            // We have set the rowId while as the li id. However, we may have
            // clicked on the li or anything in the li. Thus we need to get
            // the original li, which we'll do with jQuery's closest()
            // method. First, however, we need to wrap up the target
            // element in a jquery object.
            // wrap up the object so we can call closest()
            var jqueryObject = $(e.target);
            // we want the closest thing with class item_space, which we
            // have set up to have the row id
            var containingDiv = jqueryObject.closest('.item_space');
            var rowId = containingDiv.attr('rowId');
            console.log('clicked with rowId: ' + rowId);
          // make sure we retrieved the rowId
            if (rowId !== null && rowId !== undefined) {
                // we'll pass null as the relative path to use the default file
                odkTables.openDetailView(tableId, rowId, 'config/tables/plot/html/plot_detail.html');
            }
        });
    }

};
            
/**
 * Displays the list view in chunks. The number of list entries per chunk
 * can be modified. The list view is designed so that each row in the table is
 * represented as a list item. If you click a particular list item, it will
 * call the click handler defined in resumeFn. In the example case it opens
 * a detail view on the clicked row.
 */
var displayGroup = function(idxStart) {


    // Number of rows displayed per chunk 
    // var chunk = 50;

    // Ensure that this is the first displayed in the list
    var mapIndex = plotResultSet.getMapIndex();

    // Make sure that it is valid
    if (mapIndex !== null && mapIndex !== undefined) {
        // Make sure that it is not invalid 
        if (mapIndex !== -1) {
            // Make this the first item in the list
            addDataForRow(mapIndex);
        }
    }

    for (var i = 0; i < plotResultSet.getCount(); i++) {

        // Make sure not to repeat the selected item if one existed
        if (i === mapIndex) {
            continue;
        }
        addDataForRow(i);
        
    }
};

function addDataForRow(rowNumber) {
    // var gridster = $('.gridster ul').gridster().data('gridster');

    // Creates the space for a single element in the list. We add rowId as
    // an attribute so that the click handler set in resumeFn knows which
    // row was clicked.
    var item = $('<li>');

    // var containerDiv = $('<div>');
    // containerDiv.text(plotResultSet.getData(rowNumber, 'plot_name'));
    // containerDiv.addClass('content-holder');

    item.attr('rowId', plotResultSet.getRowId(rowNumber));
    item.attr('class', 'item_space');
    // item.addClass('grid-item');
    item.text(plotResultSet.getData(rowNumber, 'plot_name'));

    // item.append(containerDiv);
            
    /* Creates arrow icon (Nothing to edit here) */
    var chevron = $('<img>');
    chevron.attr('src', odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
    chevron.attr('class', 'chevron');
    item.append(chevron);

    var field1 = $('<li>');
    field1.attr('class', 'detail');
    var cropType = plotResultSet.getData(rowNumber, 'planting');
    field1.text('Crop: ' + cropType);
    item.append(field1);

    $('#list').append(item);

    // don't append the last one to avoid the fencepost problem
    var borderDiv = $('<div>');
    borderDiv.addClass('divider');
    $('#list').append(borderDiv);

    // var idItem = $('<div>');
    // idItem.attr('class', 'detail');
    // idItem.text('Crop: ' + plotResultSet.getData(rowNumber, 'planting'));
    // containerDiv.append(idItem);

    // gridster.add_widget(item, 1, 1);
}
