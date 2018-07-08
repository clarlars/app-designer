/**
 * The file for displaying the detail view of the refrigerator inventory table.
 */
/* global $, odkData, odkCommon, odkTables, data, util */
'use strict';

function cbSuccess(result) {

    util.showIdForDetail('#firm-name', 'firm_name', result, false);
    util.showIdForDetail('#sector-type', 'sector_type', result, false);
    util.showIdForDetail('#address', 'address', result, false);
    util.showIdForDetail('#village', 'village', result, false);
    util.showIdForDetail('#subvillage', 'subvillage', result, false);
    util.showIdForDetail('#owner', 'owner', result, true);
    util.showIdForDetail('#gender', 'gender', result, true);
    util.showIdForDetail('#enrollment-date', 'enrollment_date', result, true);
    util.showIdForDetail('#business-age', 'business_age', result, true);
    util.showIdForDetail('#firm-size', 'firm_size', result, true);
    util.showIdForDetail('#phone-number', 'phone_number', result, true);
    util.showIdForDetail('#seondary-phone-number', 'secondary_phone_number', result, true);
}

function cbFailure(error) {
    console.log('cbFailure: getViewData failed with message: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}
