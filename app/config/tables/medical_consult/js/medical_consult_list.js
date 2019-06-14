/**
 * This is the file that will be creating the list view.
 */
/* global $, util, odkTables, odkData, odkCommon */
/*exported display, handleClick, getResults */
'use strict';

var medicalConsult = {};

/** Handles clicking on a list item. Applied via a string. */
function handleClick(index) {
    if (!$.isEmptyObject(medicalConsult)) {
        odkTables.openDetailView(null,
            medicalConsult.getTableId(),
            index,
            'config/tables/medical_consult/html/medical_consult_detail.html');
    }

}

function cbSRSuccess(searchData) {
    console.log('cbSRSuccess data is' + searchData);
    if(searchData.getCount() > 0) {
        // open filtered list view if client found
        var rowId = searchData.getRowId(0);
        odkTables.openTableToListView(null,
            'medical_consult',
            '_id = ?',
            [rowId],
            'config/tables/medical_consult/html/medical_consult_list.html');
    } else {
        document.getElementById("search").value = "";
        document.getElementsByName("query")[0].placeholder="Client not found";
    }
}

function cbSRFailure(error) {
    console.log('femaleClients_list: cbSRFailure failed with error: ' + error);
}

// filters list view by client id entered by user
function getResults() {
    var searchText = document.getElementById('search').value;

    odkData.query('medical_consult', 'client_id = ?', [searchText],
        null, null, null, null, null, null, true, cbSRSuccess, cbSRFailure);
}

// displays list view of clients
function render() {

    // create button that adds enrolled client to the system - launches mini
    // 'add client' form
    var addClient = document.createElement('p');
    addClient.onclick = function() {
        odkTables.addRowWithSurvey(null,
            'medical_consult',
            'addClient',
            null,
            null); //
    };
    addClient.setAttribute('class', 'launchForm');
    addClient.innerHTML = 'Add Client';
    document.getElementById('searchBox').appendChild(addClient);

    /* create button that launches graph display */
    var graphView = document.createElement('p');
    graphView.onclick = function() {
        odkTables.openTableToListView(null,
            'medical_consult',
            null,
            null,
            'config/tables/femaleClients/html/graph_view.html');
    };
    graphView.setAttribute('class', 'launchForm');
    graphView.innerHTML = 'Graph View';
    document.getElementById('searchBox').appendChild(graphView);

    for (var i = 0; i < medicalConsult.getCount(); i++) {

        var clientId = medicalConsult.getData(i, 'clientId');
        var triage = medicalConsult.getData(i, 'triage');
        var disease = medicalConsult.getData(i, 'diseases');

        if (clientId !== null &&
            clientId !== '' &&
            triage !== null &&
            triage !== '' &&
            disease !== null &&
            disease !== '') {
            /*    Creating the item space    */
            var item = document.createElement('li');
            item.setAttribute('class', 'item_space');
            item.setAttribute(
                'onClick',
                'handleClick("' + medicalConsult.getRowId(i) + '")');
            item.innerHTML = clientId;
            document.getElementById('list').appendChild(item);

            var chevron = document.createElement('img');
            chevron.setAttribute(
                'src',
                odkCommon.getFileAsUrl('config/assets/img/little_arrow.png'));
            chevron.setAttribute('class', 'chevron');
            item.appendChild(chevron);

            // create sub-list in item space
            //  Age information
            var tri = document.createElement('li');
            tri.setAttribute('class', 'detail');
            tri.innerHTML = 'Triage: ' + triage;
            item.appendChild(tri);

            //  Randomization Arm
            var dis = document.createElement('li');
            dis.setAttribute('class', 'detail');
            dis.innerHTML = 'Disease: ' + disease;
            item.appendChild(dis);
        }
    }
}

function cbSuccess(result) {
    medicalConsult = result;
    render();
}

function cbFailure(error) {
    console.log('medicalConsult_list: failed with error: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}
