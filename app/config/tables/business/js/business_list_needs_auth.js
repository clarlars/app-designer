/**
 * This is the file that will create the list view for the table.
 */
/* global $, odkCommon, odkData, odkTables, util, listViewLogic */
'use strict';

var listQuery = 'SELECT * FROM business WHERE (' + util.COL_VEO_AUTHORIZED +' ISNULL OR ' + util.COL_VEO_AUTHORIZED + '=' + util.ZERO + ')';

var searchParams = '(firm_name LIKE ? OR sector_type LIKE ? OR owner LIKE ?)';

function resumeFunc(state) {
    if (state === 'init') {
        // Translations
        // var locale = odkCommon.getPreferredLocale();
        // $('#showing').text(odkCommon.localizeText(locale, "showing"));
        // $('#of').text(odkCommon.localizeText(locale, "of"));
        // $('#prevButton').text(odkCommon.localizeText(locale, "previous"));
        // $('#nextButton').text(odkCommon.localizeText(locale, "next"));
        // $('#submit').val(odkCommon.localizeText(locale, "search"));

        // set the parameters for the list view
        listViewLogic.setTableId('business');
        listViewLogic.setListQuery(listQuery);
        listViewLogic.setSearchParams(searchParams);
        listViewLogic.setListElement('#list');
        listViewLogic.setSearchTextElement('#search');
        listViewLogic.setHeaderElement('#header');
        listViewLogic.setLimitElement('#limitDropdown');
        listViewLogic.setPrevAndNextButtons('#prevButton', '#nextButton');
        listViewLogic.setNavTextElements('#navTextLimit', '#navTextOffset', '#navTextCnt');
        listViewLogic.showEditAndDeleteButtons(true, 'business');

        var busTxt = 'Business';
        var sectorTypeTxt = 'Sector Type';
        var ownerTxt = 'Owner';

        listViewLogic.setColIdsToDisplayInList(busTxt, 'firm_name',
            sectorTypeTxt, 'sector_type', ownerTxt, 'owner');
    }

    listViewLogic.resumeFn(state);
}

function clearListResults() {
    listViewLogic.clearResults();
}

function prevListResults() {
    listViewLogic.prevResults();
}

function nextListResults() {
    listViewLogic.nextResults();
}

function getSearchListResults(){
    listViewLogic.getSearchResults();
}

function newListLimit(){
    listViewLogic.newLimit();
}
