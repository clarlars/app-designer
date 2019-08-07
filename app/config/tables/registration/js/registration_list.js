/**
 * This is the file that will be creating the list view.
 */
/* global $, util, odkTables, odkData, odkCommon */
/*exported display, handleClick, getResults */
'use strict';

var registration = {};

/** Handles clicking on a list item. Applied via a string. */
function handleClick(index) {
    if (!$.isEmptyObject(registration)) {
        odkTables.openDetailView(null,
            registration.getTableId(),
            index,
            'config/tables/registration/html/registration_detail.html');
    }

}

function cbSRSuccess(searchData) {
    console.log('cbSRSuccess data is' + searchData);
    if(searchData.getCount() > 0) {
        // open filtered list view if client found
        var rowId = searchData.getRowId(0);
        odkTables.openTableToListView(null,
            'registration',
            '_id = ?',
            [rowId],
            'config/tables/registration/html/registration_list.html');
    } else {
        document.getElementById("search").value = "";
        document.getElementsByName("query")[0].placeholder="Client not found";
    }
}

function cbSRFailure(error) {
    console.log('registration_list: cbSRFailure failed with error: ' + error);
}

// filters list view by client id entered by user
function getResults() {
    var searchText = document.getElementById('search').value;

    odkData.query('registration', 'first_name = ?', [searchText],
        null, null, null, null, null, null, true, cbSRSuccess, cbSRFailure);
}

// displays list view of clients
function render() {

    for (var i = 0; i < registration.getCount(); i++) {

        var clientId = registration.getData(i, 'client_id');
        var firstName = registration.getData(i, 'first_name');
        var lastName = registration.getData(i, 'last_name');

        if (clientId !== null &&
            clientId !== '' &&
            firstName !== null &&
            firstName !== '' &&
            lastName !== null &&
            lastName !== '') {
            /*    Creating the item space    */
            var item = document.createElement('li');
            item.setAttribute('class', 'item_space');
            item.setAttribute(
                'onClick',
                'handleClick("' + registration.getRowId(i) + '")');
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
            tri.innerHTML = 'First Name: ' + firstName;
            item.appendChild(tri);

            // //  Randomization Arm
            var dis = document.createElement('li');
            dis.setAttribute('class', 'detail');
            dis.innerHTML = 'Last Name: ' + lastName;
            item.appendChild(dis);
        }
    }
}

function cbSuccess(result) {
    registration = result;
    render();
}

function cbFailure(error) {
    console.log('registration_list: failed with error: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}