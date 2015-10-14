'use strict';

app.formView1 = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_formView1
// END_CUSTOM_CODE_formView1
(function(parent) {
    var formView1Model = kendo.observable({
        fields: {},
        submit: function() {},
        cancel: function() {}
    });

    parent.set('formView1Model', formView1Model);
})(app.formView1);

// START_CUSTOM_CODE_formView1Model
// END_CUSTOM_CODE_formView1Model