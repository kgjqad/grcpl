'use strict';

app.clientDetails = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_clientDetails
// END_CUSTOM_CODE_clientDetails
(function(parent) {
    var clientDetailsModel = kendo.observable({
        fields: {
            customerName: '',
        },
        submit: function() {},
        cancel: function() {}
    });

    parent.set('clientDetailsModel', clientDetailsModel);
})(app.clientDetails);

// START_CUSTOM_CODE_clientDetailsModel
// END_CUSTOM_CODE_clientDetailsModel