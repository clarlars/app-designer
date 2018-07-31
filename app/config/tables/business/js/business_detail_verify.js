/**
 * The file for displaying the detail view of the refrigerator inventory table.
 */
/* global $, odkData, odkCommon, odkTables, util */
'use strict';

var bdvUserId = '';
var bdvRowId = '';
function cbSuccess(result) {
    util.showIdForDetail('#firm-name', 'firm_name', result, false);
    util.showIdForDetail('#sector-type', 'sector_type', result, false);
    util.showIdForDetail('#region', 'region', result, false);
    util.showIdForDetail('#ward', 'ward', result, false);
    util.showIdForDetail('#district', 'district', result, false);
    util.showIdForDetail('#village', 'village', result, false);
    util.showIdForDetail('#gender', 'gender', result, true);
    util.showIdForDetail('#year-business-started', 'year_business_started', result, true);
    util.showIdForDetail('#business-owner-age', 'business_owner_age', result, true);
    util.showIdForDetail('#firm-size', 'firm_size', result, true);
    util.showIdForDetail('#phone-number', 'phone_number', result, true);
    util.showIdForDetail('#secondary-phone-number', 'secondary_phone_number', result, true);
    util.showIdForDetail('#has-been-verified-by-coordinator', util.COL_COORDINATOR_VERIFIED, result, true);
    util.showIdForDetail('#has-been-authorized-by-veo', util.COL_VEO_AUTHORIZED, result, true);

    bdvRowId = result.getRowId(0);

    var userIdPromise = new Promise(function (resolve, reject) {
            odkData.simpleQueryLocalOnlyTables(util.USER_TABLE, null, null, null, null, null,
                null, null, null, resolve, reject);
        });

    userIdPromise.then(function (result) {
        if (result.getCount() === 1) {
            bdvUserId = result.getData(0, util.USER_ID);

        } else {
            var errText = 'There should only be 1 user on this device!!';
            console.log(errText);
            throw errText;
        }
    });

    var validButton = $('#valid-button');
    validButton.attr(util.BUTTON_VALUE, 1);
    validButton.on('click', function(evt) {
        updateVerificationStatus(evt);
    });

    var invalidButton = $('#invalid-button');
    invalidButton.attr(util.BUTTON_VALUE, 0);
    invalidButton.on('click', function (evt) {
        updateVerificationStatus(evt);

    });

    var unsureButton = $('#unsure-button');
    unsureButton.attr(util.BUTTON_VALUE, -1);
    unsureButton.on('click', function(evt) {
        updateVerificationStatus(evt);
    });
}

function disableButtons() {
    $('#valid-button').prop('disabled', true);
    $('#invalid-button').prop('disabled', true);
    $('#unsure-button').prop('disabled', true);
}

function updateVerificationStatus(evt) {
    disableButtons();

    var clickedButton = $(evt.target);
    var closestButton = clickedButton.closest('.button');
    var btnValue = closestButton.attr(util.BUTTON_VALUE);

    var updateBusinessPromise = new Promise(function (resolve, reject) {
        var colMap = {};
            colMap[util.COL_COORDINATOR_VERIFIED] = btnValue;
            colMap[util.COL_VERIFIER_ID] = bdvUserId;
            colMap[util.COL_VERIFICATION_DATE] = odkCommon.toOdkTimeStampFromDate(new Date());

        odkData.updateRow('business', colMap, bdvRowId, resolve, reject);

    });

    updateBusinessPromise.then(function (result) {
        odkCommon.closeWindow(util.CLOSE_RESULT_CODE_SUCCESS);
    }).catch(function (reason) {
        var errTxt = 'Error while verifying business: ' + reason;
        alert(errTxt);
        console.log(errTxt);
    });
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
    $('#hdr-gender').text(odkCommon.localizeText(locale, "gender") + ':');
    $('#hdr-business_owner_age').text(odkCommon.localizeText(locale, "business_owner_age") + ':');
    $('#hdr-year-business-started').text(odkCommon.localizeText(locale, "year_business_started") + ':');
    $('#hdr-firm-size').text(odkCommon.localizeText(locale, "firm_size") + ':');
    $('#hdr-phone-number').text(odkCommon.localizeText(locale, "phone_number") + ':');
    $('#hdr-sec-ph-number').text(odkCommon.localizeText(locale, "secondary_phone_number") + ':');
    $('#hdr-has-been-verified-by-coordinator').text(odkCommon.localizeText(locale, "verified_by_coordinator") + ':');
    $('#hdr-has-been-authorized-by-veo').text(odkCommon.localizeText(locale, "authorized_by_veo") + ':');

    $('#valid-button').text(odkCommon.localizeText(locale, "valid_business"));
    $('#invalid-button').text(odkCommon.localizeText(locale, "invalid_business"));
    $('#unsure-button').text(odkCommon.localizeText(locale, "unsure"));

    odkData.getViewData(cbSuccess, cbFailure);
}
