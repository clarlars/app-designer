window.odkFrameworkDefinitions = {
  "_tokens": {
    "constraint_message": {
      "string_token": "constraint_message",
      "text": {
        "default": "Constraint violated.",
        "sw": "Constraint violated."
      },
      "_row_num": 2
    },
    "invalid_value_message": {
      "string_token": "invalid_value_message",
      "text": {
        "default": "Invalid value.",
        "sw": "Invalid value."
      },
      "_row_num": 3
    },
    "required_message": {
      "string_token": "required_message",
      "text": {
        "default": "Required value not provided.",
        "sw": "Required value not provided."
      },
      "_row_num": 4
    },
    "required_exception_message": {
      "string_token": "required_exception_message",
      "text": {
        "default": "Exception while evaluating required() expression. See console log.",
        "sw": "Exception while evaluating required() expression. See console log."
      },
      "_row_num": 5
    },
    "constraint_exception_message": {
      "string_token": "constraint_exception_message",
      "text": {
        "default": "Exception while evaluating constraint() expression. See console log.",
        "sw": "Exception while evaluating constraint() expression. See console log."
      },
      "_row_num": 6
    },
    "acknLabel": {
      "string_token": "acknLabel",
      "text": {
        "default": "Acknowledge",
        "sw": "Acknowledge"
      },
      "_row_num": 7
    },
    "back_button_label": {
      "string_token": "back_button_label",
      "text": {
        "default": "Back",
        "sw": "Nyuma"
      },
      "_row_num": 8
    },
    "next_button_label": {
      "string_token": "next_button_label",
      "text": {
        "default": "Next",
        "sw": "Mbele/Endelea"
      },
      "_row_num": 9
    },
    "continue_button_label": {
      "string_token": "continue_button_label",
      "text": {
        "default": "Continue",
        "sw": "Continue"
      },
      "_row_num": 10
    },
    "select_one_dropdown_label": {
      "string_token": "select_one_dropdown_label",
      "text": {
        "default": "Choose Option",
        "sw": "Choose Option"
      },
      "_row_num": 11
    },
    "requiredValueErr": {
      "string_token": "requiredValueErr",
      "text": {
        "default": "Required value was not provided.",
        "sw": "Required value was not provided."
      },
      "_row_num": 12
    },
    "geopoint_button_label": {
      "string_token": "geopoint_button_label",
      "text": {
        "default": "Record Location",
        "sw": "Record Location"
      },
      "_row_num": 13
    },
    "geopoint_latitude_component": {
      "string_token": "geopoint_latitude_component",
      "text": {
        "default": "Latitude: {{value.latitude}}",
        "sw": "Latitude: {{value.latitude}}"
      },
      "_row_num": 14
    },
    "geopoint_longitude_component": {
      "string_token": "geopoint_longitude_component",
      "text": {
        "default": "Longitude: {{value.longitude}}",
        "sw": "Longitude: {{value.longitude}}"
      },
      "_row_num": 15
    },
    "geopoint_altitude_component": {
      "string_token": "geopoint_altitude_component",
      "text": {
        "default": "Altitude: {{value.altitude}}",
        "sw": "Altitude: {{value.altitude}}"
      },
      "_row_num": 16
    },
    "geopoint_accuracy_component": {
      "string_token": "geopoint_accuracy_component",
      "text": {
        "default": "Accuracy: {{value.accuracy}}",
        "sw": "Accuracy: {{value.accuracy}}"
      },
      "_row_num": 17
    },
    "waiting_text": {
      "string_token": "waiting_text",
      "text": {
        "default": "Please wait…",
        "sw": "Please wait…"
      },
      "_row_num": 18
    },
    "take_video_button_label": {
      "string_token": "take_video_button_label",
      "text": {
        "default": "Take Video",
        "sw": "Take Video"
      },
      "_row_num": 19
    },
    "choose_video_button_label": {
      "string_token": "choose_video_button_label",
      "text": {
        "default": "Choose Video",
        "sw": "Choose Video"
      },
      "_row_num": 20
    },
    "video_control_not_supported": {
      "string_token": "video_control_not_supported",
      "text": {
        "default": "Video controls are not supported.",
        "sw": "Video controls are not supported."
      },
      "_row_num": 21
    },
    "take_audio_button_label": {
      "string_token": "take_audio_button_label",
      "text": {
        "default": "Capture Audio",
        "sw": "Capture Audio"
      },
      "_row_num": 22
    },
    "choose_audio_button_label": {
      "string_token": "choose_audio_button_label",
      "text": {
        "default": "Choose Audio",
        "sw": "Choose Audio"
      },
      "_row_num": 23
    },
    "audio_control_not_supported": {
      "string_token": "audio_control_not_supported",
      "text": {
        "default": "Audio controls are not supported.",
        "sw": "Audio controls are not supported."
      },
      "_row_num": 24
    },
    "confirm_action_no_label": {
      "string_token": "confirm_action_no_label",
      "text": {
        "default": "NO",
        "sw": "NO"
      },
      "_row_num": 25
    },
    "confirm_action_yes_label": {
      "string_token": "confirm_action_yes_label",
      "text": {
        "default": "YES",
        "sw": "YES"
      },
      "_row_num": 26
    },
    "external_link_button_label": {
      "string_token": "external_link_button_label",
      "text": {
        "default": "Follow link",
        "sw": "Follow link"
      },
      "_row_num": 27
    },
    "survey_form_identification": {
      "string_token": "survey_form_identification",
      "text": {
        "default": "<div><center>ODK Survey</center><hr></div><div><p>Form name: {{localizeText form_title}}</p>{{#if form_version}}<p>Form version: {{form_version}}</p>{{/if}}<hr></div>",
        "sw": "<div><center>ODK Survey</center><hr></div><div><p>Form name: {{localizeText form_title}}</p>{{#if form_version}}<p>Form version: {{form_version}}</p>{{/if}}<hr></div>"
      },
      "_row_num": 28
    },
    "finalize_survey_instance_detail": {
      "string_token": "finalize_survey_instance_detail",
      "text": {
        "default": "<p>You are at the end of instance: </p><p>\"{{display_field}}\"</p><hr>",
        "sw": "<p>You are at the end of instance: </p><p>\"{{display_field}}\"</p><hr>"
      },
      "_row_num": 29
    },
    "finalize_survey_button_label": {
      "string_token": "finalize_survey_button_label",
      "text": {
        "default": "Finalize",
        "sw": "Kamilisha"
      },
      "_row_num": 30
    },
    "save_as_incomplete_survey_button_label": {
      "string_token": "save_as_incomplete_survey_button_label",
      "text": {
        "default": "Incomplete",
        "sw": "Isiyo kamilika"
      },
      "_row_num": 31
    },
    "take_image_button_label": {
      "string_token": "take_image_button_label",
      "text": {
        "default": "Take Photo",
        "sw": "Take Photo"
      },
      "_row_num": 33
    },
    "choose_image_button_label": {
      "string_token": "choose_image_button_label",
      "text": {
        "default": "Choose Image",
        "sw": "Choose Image"
      },
      "_row_num": 34
    },
    "launch_intent_button_label": {
      "string_token": "launch_intent_button_label",
      "text": {
        "default": "Launch Intent",
        "sw": "Launch Intent"
      },
      "_row_num": 35
    },
    "opening_survey_instance_detail": {
      "string_token": "opening_survey_instance_detail",
      "text": {
        "default": "{{#if display_field}}\n        <p>You are at the start of instance: </p>\n        <p>\"{{display_field}}\"</p> \n  {{else}}\n        <p>You are at the start of a new instance.</p>\n  {{/if}}\n        <hr>\n        {{#if last_save_date}}\n            <p>Last saved:</p> \n            <p>{{last_save_date}}</p>\n        {{/if}}\n        <hr>",
        "sw": "{{#if display_field}}\n        <p>You are at the start of instance: </p>\n        <p>\"{{display_field}}\"</p> \n  {{else}}\n        <p>You are at the start of a new instance.</p>\n  {{/if}}\n        <hr>\n        {{#if last_save_date}}\n            <p>Last saved:</p> \n            <p>{{last_save_date}}</p>\n        {{/if}}\n        <hr>"
      },
      "_row_num": 36
    },
    "opening_survey_next_button_label": {
      "string_token": "opening_survey_next_button_label",
      "text": {
        "default": "Go to next prompt",
        "sw": "Nenda ukurasa unaofuata"
      },
      "_row_num": 37
    },
    "options_popup_language_heading": {
      "string_token": "options_popup_language_heading",
      "text": {
        "default": "Language",
        "sw": "Language"
      },
      "_row_num": 38
    },
    "options_popup_contents_heading": {
      "string_token": "options_popup_contents_heading",
      "text": {
        "default": "Contents",
        "sw": "Contents"
      },
      "_row_num": 39
    },
    "options_popup_ignore_changes_heading": {
      "string_token": "options_popup_ignore_changes_heading",
      "text": {
        "default": "Ignore Changes + Exit",
        "sw": "Ignore Changes + Exit"
      },
      "_row_num": 40
    },
    "options_popup_save_changes_heading": {
      "string_token": "options_popup_save_changes_heading",
      "text": {
        "default": "Save Changes + Exit",
        "sw": "Save Changes + Exit"
      },
      "_row_num": 41
    },
    "options_popup_finalize_changes_heading": {
      "string_token": "options_popup_finalize_changes_heading",
      "text": {
        "default": "Finalize Changes + Exit",
        "sw": "Finalize Changes + Exit"
      },
      "_row_num": 42
    },
    "screen_popup_ok_button_label": {
      "string_token": "screen_popup_ok_button_label",
      "text": {
        "default": "OK",
        "sw": "OK"
      },
      "_row_num": 43
    },
    "select_with_other_other_label": {
      "string_token": "select_with_other_other_label",
      "text": {
        "default": "Other:",
        "sw": "Other:"
      },
      "_row_num": 44
    },
    "select_deselect_label": {
      "string_token": "select_deselect_label",
      "text": {
        "default": "Deselect",
        "sw": "Deselect"
      },
      "_row_num": 45
    },
    "take_signature_button_label": {
      "string_token": "take_signature_button_label",
      "text": {
        "default": "Get Signature",
        "sw": "Get Signature"
      },
      "_row_num": 46
    },
    "instances_survey_create_button_label": {
      "string_token": "instances_survey_create_button_label",
      "text": {
        "default": "Create new instance",
        "sw": "Tengeneza ukurasa mpya wa mahojiano"
      },
      "_row_num": 47
    },
    "instances_no_saved_instances_label": {
      "string_token": "instances_no_saved_instances_label",
      "text": {
        "default": "No saved instances.",
        "sw": "No saved instances."
      },
      "_row_num": 48
    },
    "instances_last_save_date_label": {
      "string_token": "instances_last_save_date_label",
      "text": {
        "default": "<p><strong>Last Save Date:</strong></p>",
        "sw": "<p><strong>Last Save Date:</strong></p>"
      },
      "_row_num": 49
    },
    "instances_previously_created_instances_label": {
      "string_token": "instances_previously_created_instances_label",
      "text": {
        "default": "<p>Previously created instances:</p>",
        "sw": "<p>Previously created instances:</p>"
      },
      "_row_num": 50
    },
    "savepoint_type_finalized_text_label": {
      "string_token": "savepoint_type_finalized_text_label",
      "text": {
        "default": "Finalized",
        "sw": "Finalized"
      },
      "_row_num": 51
    },
    "savepoint_type_incomplete_text_label": {
      "string_token": "savepoint_type_incomplete_text_label",
      "text": {
        "default": "Incomplete",
        "sw": "Incomplete"
      },
      "_row_num": 52
    },
    "savepoint_type_checkpoint_text_label": {
      "string_token": "savepoint_type_checkpoint_text_label",
      "text": {
        "default": "Checkpoint",
        "sw": "Checkpoint"
      },
      "_row_num": 53
    },
    "linked_table_new_instance_label": {
      "string_token": "linked_table_new_instance_label",
      "text": {
        "default": "Create new instance",
        "sw": "Create new instance"
      },
      "_row_num": 54
    },
    "barcode_button_label": {
      "string_token": "barcode_button_label",
      "text": {
        "default": "Scan Barcode",
        "sw": "Scan Barcode"
      },
      "_row_num": 55
    },
    "invalid_numeric_message": {
      "string_token": "invalid_numeric_message",
      "text": {
        "default": "Numeric value expected",
        "sw": "Numeric value expected"
      },
      "_row_num": 56
    },
    "invalid_integer_message": {
      "string_token": "invalid_integer_message",
      "text": {
        "default": "Integer value expected",
        "sw": "Integer value expected"
      },
      "_row_num": 57
    },
    "confirm_exit_label": {
      "string_token": "confirm_exit_label",
      "text": {
        "default": "Exit",
        "sw": "Exit"
      },
      "_row_num": 58
    },
    "confirm_cancel_label": {
      "string_token": "confirm_cancel_label",
      "text": {
        "default": "Cancel",
        "sw": "Batilisha"
      },
      "_row_num": 59
    },
    "confirm_message": {
      "string_token": "confirm_message",
      "text": {
        "default": "Are you sure you want to exit and lose all changes?",
        "sw": "Are you sure you want to exit and lose all changes?"
      },
      "_row_num": 60
    },
    "are_you_sure_you_want_to_delete_row": {
      "string_token": "are_you_sure_you_want_to_delete_row",
      "text": {
        "default": "Are you sure you want to delete row",
        "sw": "Are you sure you want to delete row"
      },
      "_row_num": 61
    },
    "edit": {
      "string_token": "edit",
      "text": {
        "default": "Edit",
        "sw": "Edit"
      },
      "_row_num": 62
    },
    "delete": {
      "string_token": "delete",
      "text": {
        "default": "Delete",
        "sw": "Delete"
      },
      "_row_num": 63
    }
  }
}