/**
 * The file for displaying the detail view of the refrigerator inventory table.
 */
/* global $, odkData, odkCommon, odkTables, data, util */
'use strict';

function cbSuccess(result) {

    util.showIdForDetail('#firm-name', 'firm_name', result, false);
    util.showIdForDetail('#sector-type', 'sector_type', result, false);
    util.showIdForDetail('#district', 'district', result, false);
    util.showIdForDetail('#village', 'village', result, false);
    util.showIdForDetail('#gender', 'gender', result, true);
    util.showIdForDetail('#business-age', 'business_age', result, true);
    util.showIdForDetail('#business-owner-age', 'business_owner_age', result, true);
    util.showIdForDetail('#firm-size', 'firm_size', result, true);
    util.showIdForDetail('#phone-number', 'phone_number', result, true);
    util.showIdForDetail('#seondary-phone-number', 'secondary_phone_number', result, true);
    util.showIdForDetail('#has-been-verified-by-agent', util.COL_COORDINATOR_VERIFIED, result, true);
    util.showIdForDetail('#has-been-authorized-by-veo', util.COL_VEO_AUTHORIZED, result, true);
}

function cbFailure(error) {
    console.log('cbFailure: getViewData failed with message: ' + error);
}

function display() {
    odkData.getViewData(cbSuccess, cbFailure);
}
