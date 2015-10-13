'use strict';

app.meetingView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_meetingView
// END_CUSTOM_CODE_meetingView
(function(parent) {
    var dataProvider = app.data.defaultProvider,
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        // Location type property
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Meeting',
                dataProvider: dataProvider
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'AltAddress': {
                            field: 'AltAddress',
                            defaultValue: ''
                        },
                        'AltLocalization': {
                            field: 'AltLocalization',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        meetingViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/meetingView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = meetingViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.ExpectedStartTime) {
                    itemModel.ExpectedStartTime = String.fromCharCode(160);
                }
                meetingViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('meetingViewModel', meetingViewModel);
})(app.meetingView);

// START_CUSTOM_CODE_meetingViewModel
// END_CUSTOM_CODE_meetingViewModel