define(['promptTypes', 'jquery', 'underscore', 'opendatakit', 'database', 'prompts'],
    function (promptTypes, $, _, opendatakit, database) {
// custom functions are placed under 'window' to be visible in calculates...
// note that you need to be careful about naming -- should probably go somewhere else?
window.is_finalized = function () {
    return ('COMPLETE' === database.getInstanceMetaDataValue('_savepoint_type'));
};

var select_unique = promptTypes.select.extend({
    configureRenderContext: function (ctxt) {
        var that = this;
        var newctxt = $.extend({}, ctxt, {
            success: function (outcome) {
                ctxt.log('D', "prompts." + that.type + ".configureRenderContext." + outcome,
                    "px: " + that.promptIdx);
                that.updateRenderValue(that.parseSaveValue(that.getValue()));
                ctxt.success();
            },
            failure: function (m) {
                ctxt.failure(m);
            }
        });

        var populateChoicesViaQueryUsingLinkedTable = function (query, newctxt) {
            newctxt.log('D', "prompts." + that.type + ".configureRenderContext", "px: " + that.promptIdx);
            that.getlinkedModel($.extend({}, newctxt, {
                success: function (linkedModel) {
                    var dbTableName = linkedModel.table_id;
                    var selString = that.convertSelection(linkedModel);
                    var selArgs = query.selectionArgs();
                    var ordBy = that.convertOrderBy(linkedModel);
                    var displayElementName = query.columnValue;
                    database.get_linked_instances($.extend({}, newctxt, {
                        success: function (instanceList) {
                            that.renderContext.choices = _.chain(instanceList).uniq(function(instance) {
                                    return instance.display_field;
                                })
                                .map(function (instance) {
                                instance.display = {title: {text: instance.display_field}};
                                instance.data_value = instance.display_field;
                                return instance;
                            }).value();
                            newctxt.success();
                        }
                    }), dbTableName, selString, selArgs, displayElementName, ordBy);
                }
            }));
        };

        var populateChoicesViaQuery = function (query, newctxt) {
            if (query.query_type == 'csv' || query.query_type == 'ajax') {
                that.populateChoicesViaQueryUsingAjax(query, newctxt);
            }
            else if (query.query_type == 'linked_table') {
                populateChoicesViaQueryUsingLinkedTable(query, newctxt);
            }
            else {
                newctxt.failure({message: "Error: undefined query type - a query in the queries sheet must have a query_type"});
            }
        };

        that.renderContext.passiveError = null;
        var queryDefn = opendatakit.getQueriesDefinition(that.values_list);
        var choiceListDefn = opendatakit.getChoicesDefinition(that.values_list);
        if (queryDefn !== null && queryDefn !== undefined) {
            populateChoicesViaQuery(queryDefn, newctxt);
        } else if (choiceListDefn !== null && choiceListDefn !== undefined) {
            //Very important.
            //We need to clone the choices so their values are unique to the prompt.
            that.renderContext.choices = _.map(choiceListDefn, _.clone);
            newctxt.success("choiceList.success");
        } else {
            newctxt.failure({message: "Error fetching choices -- no ajax query or choices defined"});
        }
    }
});
select_one_unique = select_unique.extend({
    renderContext: {
        "select_one": true
    },
    generateSaveValue: function (jsonFormSerialization) {
        var selectedValue, otherValue;
        var promptName = this.name;
        if (jsonFormSerialization) {
            selectedValue = _.find(jsonFormSerialization, function (valueObject) {
                return (promptName === valueObject.name);
            });
            if (selectedValue) {
                if (this.withOther) {
                    if (selectedValue.value === 'other') {
                        otherValue = _.find(jsonFormSerialization, function (valueObject) {
                            return ('otherValue' === valueObject.name);
                        });
                        if (otherValue !== null &&
                            otherValue !== undefined &&
                            otherValue.value !== null &&
                            otherValue.value !== undefined &&
                            otherValue.value.length !== 0) {
                            return otherValue.value;
                        } else {
                            // We need to store a space since null values
                            // are not allowed in the database
                            return ' ';
                        }
                    }
                }
                return selectedValue.value;
            }
        }
        return null;
    },
    /**
     * Parse a saved string value into the format
     * returned by jQuery's serializeArray function.
     */
    parseSaveValue: function (savedValue) {
        //Note that this function expects to run after renderContext.choices
        //has been initilized.
        var valInChoices = false;
        if (!_.isString(savedValue)) {
            return null;
        }
        if (this.renderContext.choices) {
            valInChoices = _.any(this.renderContext.choices, function (choice) {
                return (choice.data_value === savedValue);
            });
        }
        if (valInChoices) {
            return [{
                "name": this.name,
                "value": savedValue
            }];
        }
        else {
            return [{
                "name": this.name,
                "value": "other"
            }, {
                "name": "otherValue",
                "value": savedValue
            }];
        }
    }
});
return {
    "select_one_unique": select_one_unique
}
});
