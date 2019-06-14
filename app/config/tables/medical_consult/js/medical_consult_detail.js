/**
 * The file for displaying a detail view.
 */
/* global $, odkTables, odkData */
'use strict';

var clientId;

// Displays details about client and links to various forms
function display(result) {

    // Details - Client id, age, randomization arm
    clientId = result.get('clientId');
    document.getElementById('title').innerHTML = clientId;
    document.getElementById('triage').innerHTML = result.get('triage');
    document.getElementById('reasons').innerHTML = result.get('reasons');
    document.getElementById('preli_diag').innerHTML = result.get('preli_diag');
    document.getElementById('diag_plan').innerHTML = result.get('diag_plan');
    document.getElementById('lab_res').innerHTML = result.get('lab_res');
    document.getElementById('diseases').innerHTML = result.get('diseases');
    document.getElementById('con_diag').innerHTML = result.get('con_diag');
    document.getElementById('treatment').innerHTML = result.get('treatment');
    document.getElementById('end_list').innerHTML = result.get('end_list');
}

function cbSuccess(result) {
    display(result);
}

function cbFailure(error) {
    console.log('femaleClients_detail: failed with error: ' + error);
}

// handles events from html page
function setup() {
    odkData.getViewData(cbSuccess, cbFailure);
}

$(document).ready(setup);


