/**
 * The file for displaying a detail view.
 */
/* global $, odkTables, odkData */
'use strict';

var clientId;

// Displays details about client and links to various forms
function display(result) {

    // Details - Client id, age, randomization arm
    clientId = result.get('client_id');
    document.getElementById('first_name').innerHTML = clientId;
    document.getElementById('middle_name').innerHTML = result.get('triage');
    document.getElementById('last_name').innerHTML = result.get('reasons');
    document.getElementById('sex').innerHTML = result.get('preli_diag');
    document.getElementById('date_of_birth').innerHTML = result.get('diag_plan');
    document.getElementById('state').innerHTML = result.get('lab_res');
    document.getElementById('telephone_num').innerHTML = result.get('diseases');
    document.getElementById('father').innerHTML = result.get('con_diag');
    document.getElementById('mother').innerHTML = result.get('treatment');
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
