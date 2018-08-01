/**
 * The file for displaying the detail view of the refrigerator inventory table.
 */
/* global $, odkData, odkCommon, odkTables, util */
'use strict';

function cbSuccess(result) {
    util.showIdForDetail('#firm-name', 'firm_name', result, false);
    util.showIdForDetail('#sector-type', 'sector_type', result, false);
    util.showIdForDetail('#region', 'region', result, false);
    util.showIdForDetail('#district', 'district', result, false);
    util.showIdForDetail('#ward', 'ward', result, false);
    util.showIdForDetail('#village', 'village', result, false);
    util.showIdForDetail('#business-owner-name', 'business_owner_name', result, true);
    util.showIdForDetail('#gender', 'gender', result, true);
    util.showIdForDetail('#year-business-started', 'year_business_started', result, true);
    util.showIdForDetail('#business-owner-age', 'business_owner_age', result, true);
    util.showIdForDetail('#firm-size', 'firm_size', result, true);
    util.showIdForDetail('#phone-number', 'phone_number', result, true);
    util.showIdForDetail('#secondary-phone-number', 'secondary_phone_number', result, true);
    util.showIdForDetail('#has-been-verified-by-coordinator', util.COL_COORDINATOR_VERIFIED, result, true);
    util.showIdForDetail('#has-been-authorized-by-veo', util.COL_VEO_AUTHORIZED, result, true);

}

function cbFailure(error) {
    console.log('cbFailure: getViewData failed with message: ' + error);
}

function display() {
    var locale = odkCommon.getPreferredLocale();
    $('#bus-hdr').text(odkCommon.localizeText(locale, "business"));
    $('#hdr-firm-name').text(odkCommon.localizeText(locale, "name") + ':');
    $('#hdr-sector-type').text(odkCommon.localizeText(locale, "sector_type") + ':');
    $('#hdr-region').text(odkCommon.localizeText(locale, "region") + ':');
    $('#hdr-district').text(odkCommon.localizeText(locale, "district") + ':');
    $('#hdr-ward').text(odkCommon.localizeText(locale, "ward") + ':');
    $('#hdr-village').text(odkCommon.localizeText(locale, "village") + ':');
    $('#hdr-business-owner-name').text(odkCommon.localizeText(locale, "business_owner_name") + ':');
    $('#hdr-gender').text(odkCommon.localizeText(locale, "gender") + ':');
    $('#hdr-business-owner-age').text(odkCommon.localizeText(locale, "business_owner_age") + ':');
    $('#hdr-year-business-started').text(odkCommon.localizeText(locale, "year_business_started") + ':');
    $('#hdr-firm-size').text(odkCommon.localizeText(locale, "firm_size") + ':');
    $('#hdr-phone-number').text(odkCommon.localizeText(locale, "phone_number") + ':');
    $('#hdr-sec-ph-number').text(odkCommon.localizeText(locale, "secondary_phone_number") + ':');
    $('#hdr-has-been-verified-by-coordinator').text(odkCommon.localizeText(locale, "verified_by_coordinator") + ':');
    $('#hdr-has-been-authorized-by-veo').text(odkCommon.localizeText(locale, "authorized_by_veo") + ':');

    odkData.getViewData(cbSuccess, cbFailure);
}
