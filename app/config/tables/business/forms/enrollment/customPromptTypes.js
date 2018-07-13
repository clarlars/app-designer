define(['promptTypes', 'jquery', 'underscore', 'opendatakit', 'database', 'prompts'],
    function (promptTypes, $, _, opendatakit, database) {
// custom functions are placed under 'window' to be visible in calculates...
// note that you need to be careful about naming -- should probably go somewhere else?
window.is_finalized = function () {
    return ('COMPLETE' === database.getInstanceMetaDataValue('_savepoint_type'));
};

var select_group_by = promptTypes._linked_type.extend({
    type: "select",
    _protoDisplay: {
        deselect: false,
        select_deselect_label: 'select_deselect_label',
        select_one_dropdown_label: 'select_one_dropdown_label',
        select_with_other_other_label: 'select_with_other_other_label'
    },
    templatePath: "templates/select.handlebars",
    events: {
        "change input": "modification",
        "change select": "modification",
        //Only needed for child views
        "click .deselect": "deselect",
        "click .grid-select-item": "selectGridItem",
        "taphold .ui-radio": "deselect"
    },
    selectGridItem: function (evt) {
        var $target = $(evt.target).closest('.grid-select-item');
        var $input = $target.find('input');
        $input.prop("checked", function (index, oldPropertyValue) {
            if (oldPropertyValue) {
                $input.prop("checked", false);
                $input.change();
            } else {
                $input.prop("checked", true);
                $input.change();
            }
        });
    },
    reRender: function (evt) {
        var that = this;
        var conIdx = that.getContainerId();
        var screenRedraw = that._screen.havePromptsOnScreenChanged(that.promptIdx);
        if (screenRedraw) {
            // Need to create a context here since
            // screen reRender requires a valid context
            var ctxt = that.controller.newContext(evt, that.type + ".reRender");
            that.controller.enqueueTriggeringContext($.extend({}, ctxt, {
                success: function () {
                    odkCommon.log('D', "prompts." + that.type + ".reRender: _screen.reRender", "px: " + that.promptIdx);
                    that._screen.reRender(ctxt);
                },
                failure: function (m) {
                    odkCommon.log('D', "prompts." + that.type + ".reRender: -- prior event terminated with an error -- aborting", "px: " + that.promptIdx);
                    ctxt.failure(m);
                }
            }));

        } else {
            that._render();
            if (!that.$el) {
                console.error("render px: " + that.promptIdx +
                    " Prompts must have synchronous render functions. " +
                    "Don't debounce them or launch async calls before el is set.");
                console.error(that);
                alert("Sub-prompt has not been rendered. See console for details.");
            }

            var $container = that._screen.$(that.getContainerId());
            $container.html(that.$el);
        }
    },
    choice_filter: function () {
        return true;
    },
    updateRenderValue: function (formValue) {
        var that = this;

        var filteredChoices = _.filter(that.renderContext.choices, function(choice) {
            return that.choice_filter(choice);
        });

        if (!formValue) {
            that.renderContext.choices = _.map(filteredChoices, function (choice) {
                choice.checked = false;
                return choice;
            });
            if (this.withOther) {
                that.renderContext.other = null;
            }
            return;
        }
        //Check appropriate choices based on formValue
        that.renderContext.choices = _.map(filteredChoices, function (choice) {
            choice.checked = _.any(formValue, function (valueObject) {
                return choice.data_value === valueObject.value;
            });
            return choice;
        });
        if (this.withOther) {
            var otherObject = _.find(formValue, function (valueObject) {
                return ('otherValue' === valueObject.name);
            });
            that.renderContext.other = {
                value: otherObject ? otherObject.value : '',
                checked: _.any(formValue, function (valueObject) {
                    return ('other' === valueObject.value);
                })
            };
        }
    },
    generateSaveValue: function (jsonFormSerialization) {
        var that = this;
        var selectedValues;
        if (jsonFormSerialization) {
            selectedValues = _.map(jsonFormSerialization, function (valueObject) {
                if (valueObject.name === that.name) {
                    return valueObject.value;
                }
            });
            if (selectedValues && that.withOther) {
                var otherValue = _.find(selectedValues, function (value) {
                    return ('other' === value);
                });
                if (otherValue) {
                    var otherObject = _.find(jsonFormSerialization, function (valueObject) {
                        return ('otherValue' === valueObject.name);
                    });
                    selectedValues.push(otherObject.value);
                }
            }
            if (selectedValues !== null && (selectedValues === undefined || selectedValues.length === 0)) {
                selectedValues = null;
            }
            return selectedValues;
        }
        return null;
    },
    parseSaveValue: function (savedValue) {
        //Note that this function expects to run after this.renderContext.choices
        //has been initilized.
        var that = this;
        var otherChoices = [];
        var matchedChoice = null;
        var choiceList = [];
        var newChoice = null;

        if (savedValue === null || savedValue === undefined)
            return choiceList;

        for (var i = 0; i < savedValue.length; i++) {
            matchedChoice = _.find(that.renderContext.choices, function (choiceObject) {
                return (savedValue[i] === choiceObject.data_value);
            });

            if (matchedChoice !== null && matchedChoice !== undefined) {
                newChoice = {"name": that.name, "value": savedValue[i]};
                choiceList.push(newChoice);
            } else {
                otherChoices.push(savedValue[i]);
            }
        }

        if (that.withOther && otherChoices.length === 1) {
            // emit the other choice list and the value for it...
            choiceList.push({
                "name": that.name,
                "value": "other"
            });
            choiceList.push({
                "name": "otherValue",
                "value": otherChoices[0]
            });
        } else if (otherChoices.length > 0) {
            odkCommon.log('W', "prompts." + this.type + " px: " + this.promptIdx + " invalid choices are in choices list");
        }

        return choiceList;
    },
    modification: function (evt) {
        var that = this;
        odkCommon.log('D', "prompts." + that.type + ".modification - px: " + that.promptIdx + " val: " + $(evt.target).attr('value'));
        if (that.withOther) {
            //This hack is needed to prevent rerendering
            //causing the other input to loose focus when clicked.
            if ($(evt.target).val() === 'other' &&
                $(evt.target).prop('checked') &&
                //The next two lines determine if the checkbox was already checked.
                that.renderContext.other &&
                that.renderContext.other.checked) {
                odkCommon.log('D', "prompts." + that.type + ".modification.withOther.hack -  px: " + that.promptIdx);
                return;
            }
        }
        if (that.appearance === 'grid') {
            //Make selection more reponsive by providing visual feedback before
            //the template is re-rendered.
            that.$('.grid-select-item.ui-bar-e').removeClass('ui-bar-e').addClass('ui-bar-c');
            that.$('input:checked').closest('.grid-select-item').addClass('ui-bar-e');
        }
        var formValue = (that.$('form').serializeArray());

        // set the value early...
        // if an earlier event fails that's OK.
        // The user intended to make this change, so it
        // is fine to be out-of-order.
        //
        // If the change is applied with an earlier change
        // then the value has been persisted. If it
        // has not yet been persisted, it will be queued and
        // applied when the user corrects whatever error
        // they had that caused the earlier action to fail.
        //
        that.setValueDeferredChange(that.generateSaveValue(formValue));
        that.updateRenderValue(formValue);

        // Here we don't want to enqueueTriggeringContext - we will include the evt in case a screen redraw is necessary
        odkCommon.log('D', "prompts." + that.type + ".modification: reRender", "px: " + that.promptIdx);
        that.reRender(evt);
    },
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
                            that.renderContext.choices = _.map(instanceList, function (instance) {
                                instance.display = {title: {text: instance.display_field}};
                                instance.data_value = instance.display_field;
                                return instance;
                            });
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
    },
    deselect: function (evt) {
        odkCommon.log('D', "prompts." + this.type + ".deselect px: " + this.promptIdx);
        this.$('input:checked').prop('checked', false).change();
    }
});
select_one_group_by = select_group_by.extend({
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
    "select_one_group_by": select_one_group_by
}
});
