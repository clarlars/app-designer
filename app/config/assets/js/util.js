/* global odkData*/
/**
 * Various functions that we might need across screens.
 */
'use strict';

var util = {};

util.regionLevel2 = 'regionLevel2';
util.region = 'region';
util.rowId = '_id';

util.VIEW_TYPE = 'viewType';
util.PENDING_AUTHORIZATION = 'pendingAuthorization';
util.PENDING_VERIFICATION = 'pendingVerification';
util.ACTION = 'action';
util.COMPLETED = 'completed';

util.VIEW_TYPE_AGENT = 'agent'
util.VIEW_TYPE_COORDINATOR = 'coordinator';

util.ACTION_LIST = 'list';
util.ACTION_VERIFY = 'verify';
util.ACTION_AUTHORIZE = 'authorize';

util.COL_AGENT_VERIFIED = 'has_been_verified_by_agent';
util.COL_VEO_AUTHORIZED = 'has_been_authorized_by_veo';

util.TRUE = 'true';
util.FALSE = 'false';

util.ONE = 1;
util.ZERO = 0;
util.NEG_ONE = -1;

util.VILLAGE = 'village';

util.BUSINESS_BTN_ACTION = 'button-action';

/**
 * Return the menu options for the key.  If no value
 * is passed in return all of the options.
 */
util.getFacilityTypesByDistrict = function(district, successCB, failureCB) {
    var queryStr = 'SELECT facility_type, count(*) FROM health_facility';
    var whereStr = ' WHERE admin_region = ?';
    var groupByStr = ' GROUP BY facility_type';
    var queryParam = [];

    if (district !== null && district !== undefined && district.length > 0) {
        queryParam = [district];
        queryStr = queryStr + whereStr;
    }

    queryStr = queryStr + groupByStr;
    odkData.arbitraryQuery('health_facility',
        queryStr,
        queryParam,
        null,
        null,
        successCB,
        failureCB);
};

/**
 * This function assumes query parameters are of the form
 * url?key1=param1&key2=param2
 *
 * url?key1 - is not valid and will be ignored
 */
util.getAllQueryParameters = function() {
    var href = document.location.search;

    var uriParams = {};

    href = href.substring(1, href.length);

    var keys = href.split('&');

    for (var i = 0; i < keys.length; i++) {
        var keyStrIdx = keys[i].search('=');
        if (keyStrIdx <= 0) {
            continue;
        } else {
            var parsedKey = keys[i].substring(0, keyStrIdx);
            uriParams[parsedKey] = decodeURIComponent(keys[i].substring(keyStrIdx+1, keys[i].length));

        }
    }

    return uriParams;
};

/**
 * Get the query parameter from the url. Note that this is kind of a hacky/lazy
 * implementation that will fail if the key string appears more than once, etc.
 */
util.getQueryParameter = function(key) {
    var href = document.location.search;
    var startIndex = href.search(key);
    if (startIndex < 0) {
        console.log('requested query parameter not found: ' + key);
        return null;
    }

    href = href.substring(1, href.length);

    var keys = href.split('&');

    for (var i = 0; i < keys.length; i++) {
        var keyStrIdx = keys[i].search('=');
        if (keyStrIdx <= 0) {
            continue;
        } else {
            var parsedKey = keys[i].substring(0, keyStrIdx);
            if (parsedKey === key) {
                return decodeURIComponent(keys[i].substring(keyStrIdx+1, keys[i].length));
            }
        }
    }

    return null;
};


util.genUUID = function() {
    // construct a UUID (from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript )
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = (c === 'x') ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return id;
};

// Formats variable names for display
util.formatDisplayText = function(txt) {
    if (txt === null || txt === undefined || txt.length === 0) {
        return null;
    }

    // In case we have a number
    txt = '' + txt;
    var displayText = txt
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, function(str){return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();});

    return displayText;
};

util.formatDate = function(txt) {
    if (txt === null || txt === undefined || txt.length === 0) {
        return null;
    }

    var dateToUse = txt.indexOf('T') > 0 ? txt.substring(0, txt.indexOf('T')) : txt;
    return dateToUse;
};

util.formatColIdForDisplay = function(colId, index, resultSet, applyFormat) {
    if (colId === null || colId === undefined ||
        colId.length === 0) {
        return;
    }

    if (resultSet.getCount() <= 0) {
        return;
    }

    if (index < 0) {
        return;
    }

    // Format for date
    var meta = resultSet.getMetadata();
    var elementMetadata = meta.dataTableModel[colId];
    if (elementMetadata !== undefined && elementMetadata !== null &&
        elementMetadata.elementType === 'date') {
        var dateToUse = resultSet.getData(index, colId);
        if (dateToUse !== null && dateToUse !== undefined) {
            if (applyFormat) {
                dateToUse = util.formatDate(dateToUse);
            }
        }
        return dateToUse;
    }

    var textToDisplay = resultSet.getData(index, colId);
    if (textToDisplay !== null && textToDisplay !== undefined && textToDisplay.length !== 0) {
        if (applyFormat) {
            textToDisplay = util.formatDisplayText(textToDisplay);
        }

        return textToDisplay;
    }
    return '';
};

util.showIdForDetail = function(idOfElement, colId, resultSet, applyFormat) {
    if (idOfElement === null || idOfElement === undefined ||
        idOfElement.length === 0) {
        return;
    }

    if (colId === null || colId === undefined ||
        colId.length === 0) {
        return;
    }

    if (resultSet.getCount() === 0) {
        return;
    }

    // Format for date
    var meta = resultSet.getMetadata();
    var elementMetadata = meta.dataTableModel[colId];
    if (elementMetadata.elementType === 'date') {
        var dateToUse = resultSet.get(colId);
        if (dateToUse !== null && dateToUse !== undefined) {
            if (applyFormat) {
                dateToUse = util.formatDate(dateToUse);
            }
            $(idOfElement).text(dateToUse);
        }
        return;
    }

    var textToDisplay = resultSet.get(colId);
    if (textToDisplay !== null && textToDisplay !== undefined && textToDisplay.length !== 0) {
        if (applyFormat) {
            textToDisplay = util.formatDisplayText(textToDisplay);
        }

        $(idOfElement).text(textToDisplay);
    }
};

