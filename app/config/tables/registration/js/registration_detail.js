/**
 * The file for displaying a detail view.
 */
/* global $, odkTables, odkData */
'use strict';

var clientId;

// Displays details about client and links to various forms
function display(result) {

    // Details - Client name, dob
    clientId = result.get('client_id');
    document.getElementById('first_name').innerHTML = clientId;
    document.getElementById('middle_name').innerHTML = result.get('middle_name');
    document.getElementById('last_name').innerHTML = result.get('last_name');
    document.getElementById('sex').innerHTML = result.get('sex');
    document.getElementById('date_of_birth').innerHTML = result.get('date_of_birth');
    document.getElementById('state').innerHTML = result.get('state');
    document.getElementById('telephone_num').innerHTML = result.get('telephone_num');
    document.getElementById('father').innerHTML = result.get('father');
    document.getElementById('mother').innerHTML = result.get('mother');
}

function cbSuccess(result) {
    display(result);
}

function cbFailure(error) {
    console.log('registration_detail: failed with error: ' + error);
}

// handles events from html page
function setup() {
    odkData.getViewData(cbSuccess, cbFailure);
}

$(document).ready(setup);
