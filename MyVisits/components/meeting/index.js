'use strict';

app.meeting = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_meeting
// END_CUSTOM_CODE_meeting
(function(parent) {
    var meetingModel = kendo.observable({
        fields: {
            address: '',
            location: '',
            confirmed: '',
            customer: '',
            time1: '',
            time: '',
            date: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('meetingModel', meetingModel);
})(app.meeting);

// START_CUSTOM_CODE_meetingModel
// END_CUSTOM_CODE_meetingModel